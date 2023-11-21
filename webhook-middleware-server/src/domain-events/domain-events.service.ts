import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PublisherTotalsDto } from './dto/publisher-totals.dto';
import {
    DomainEvent,
    DomainEventDocument,
    DomainEventType,
} from './schemas/domain-event.schema';

export interface DayCount {
    day: string;
    count: number;
}

export interface Filters {
    offset: string | null;
    limit: string | null;
    type: string | null;
    searchQuery: string | null;
    searchProperty: string | null;
    status: string | null;
    orderField: string | null;
    orderDirection: string | null;
    dateFrom: string | null;
    dateTo: string | null;
}

@Injectable()
export class DomainEventsService {
    constructor(
        @InjectModel(DomainEvent.name)
        private domainEventModel: Model<DomainEventDocument>,
    ) {}

    async create(event: DomainEvent): Promise<DomainEvent> {
        const newEvent = new this.domainEventModel(event);
        return newEvent.save();
    }

    async findBy(filters: Filters): Promise<DomainEvent[]> {
        return this.domainEventModel
            .aggregate([
                {
                    $match: {
                        ...(filters.searchQuery && {
                            payloadString: {
                                $regex: filters.searchQuery,
                                $options: 'i',
                            },
                        }),
                        ...(filters.status && {
                            status: filters.status,
                        }),
                        ...(filters.type && { type: filters.type }),
                        ...(filters.dateFrom || filters.dateTo
                            ? {
                                  createdAt: {
                                      ...(filters.dateFrom && {
                                          $gte: new Date(filters.dateFrom),
                                      }),
                                      ...(filters.dateTo && {
                                          $lte: new Date(filters.dateTo),
                                      }),
                                  },
                              }
                            : {}),
                    },
                },
                ...(filters.orderField
                    ? [
                          {
                              $sort: {
                                  [filters.orderField]:
                                      parseInt(filters.orderDirection) || 1,
                              },
                          },
                      ]
                    : [
                          {
                              $sort: {
                                  createdAt: -1,
                              },
                          },
                      ]),
                {
                    $skip: parseInt(filters.offset) || 0,
                },
                {
                    $limit: parseInt(filters.limit) || 10,
                },
            ])
            .exec();
    }

    async findByCount(filters: Filters): Promise<number> {
        return this.domainEventModel
            .aggregate([
                {
                    $match: {
                        ...(filters.searchQuery && {
                            payloadString: {
                                $regex: filters.searchQuery,
                                $options: 'i',
                            },
                        }),
                        ...(filters.status && {
                            status: filters.status,
                        }),
                        ...(filters.type && { type: filters.type }),
                        ...(filters.dateFrom || filters.dateTo
                            ? {
                                  createdAt: {
                                      ...(filters.dateFrom && {
                                          $gte: new Date(filters.dateFrom),
                                      }),
                                      ...(filters.dateTo && {
                                          $lte: new Date(filters.dateTo),
                                      }),
                                  },
                              }
                            : {}),
                    },
                },
                {
                    $group: {
                        _id: null,
                        count: {
                            $sum: 1,
                        },
                    },
                },
            ])
            .exec();
    }

    async findAll(offset: string, limit: string): Promise<DomainEvent[]> {
        return this.domainEventModel
            .find()
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .exec();
    }

    async getById(id: string): Promise<DomainEvent> {
        const event: DomainEvent | null = await this.domainEventModel
            .findById(id)
            .exec();
        return event;
    }

    async getByPrevEventId(id: string): Promise<DomainEvent> {
        return this.domainEventModel
            .findOne({
                'prevEvent._id': id,
            })
            .exec();
    }

    async getPublisherTotals(id: string): Promise<PublisherTotalsDto> {
        const _totalWebhooksPublished = await this.domainEventModel
            .find({
                publisherId: id,
                type: DomainEventType.Received,
            })
            .count()
            .exec();
        return {
            totalWebhooksPublished: _totalWebhooksPublished,
        };
    }

    async getPublishedWebhooksByPublisher(id: string): Promise<DomainEvent[]> {
        return this.domainEventModel
            .find({
                publisherId: id,
                type: DomainEventType.Received,
            })
            .sort({
                createdAt: 'desc',
            })
            .limit(10)
            .exec();
    }

    async getReceivedWebhooksBySubscriber(id: string): Promise<DomainEvent[]> {
        return this.domainEventModel
            .find({
                subscriberId: id,
                type: DomainEventType.Sent,
            })
            .sort({
                createdAt: 'desc',
            })
            .limit(10)
            .exec();
    }

    normalizeWebhookPayload = (payload: any): any => {
        for (const prop in payload) {
            const json = this.stringToJson(payload[prop]);
            if (json) {
                payload[prop] = json;
                this.normalizeWebhookPayload(payload[prop]);
            }
        }
        return payload;
    };

    stringToJson = (str: string): boolean => {
        try {
            return JSON.parse(str);
        } catch (e) {
            return false;
        }
    };

    getCount(
        from: string | null,
        to: string | null,
        _type: string | null,
    ): Promise<number> {
        return this.domainEventModel
            .find({
                ...((from || to) && {
                    createdAt: {
                        ...(from && { $gte: new Date(from) }),
                        ...(to && { $lte: new Date(to) }),
                    },
                }),
                ...(_type && { type: _type }),
            })
            .count()
            .exec();
    }

    getAverageExecutionTime(): Promise<number> {
        return this.domainEventModel
            .aggregate([
                {
                    $match: {
                        type: DomainEventType.Sent,
                        executionTime: {
                            $ne: null,
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        average: {
                            $avg: '$executionTime',
                        },
                    },
                },
            ])
            .exec();
    }

    getExecutionTimes(from: string | null, to: string | null): Promise<any[]> {
        return this.domainEventModel
            .aggregate([
                {
                    $match: {
                        executionTime: {
                            $ne: null,
                        },
                        createdAt: {
                            $gt: new Date(from),
                            $lt: new Date(to),
                        },
                    },
                },
                {
                    $project: {
                        time: '$executionTime',
                    },
                },
            ])
            .exec();
    }

    async getCounts(
        from: string | null,
        to: string | null,
        _type: string | null,
    ): Promise<DayCount[]> {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const days = this.getDaysArray(fromDate, toDate);
        return Promise.all(
            days.map(async (day: Date) => {
                const dayStart = new Date(day);
                dayStart.setMinutes(0);
                dayStart.setHours(0);
                dayStart.setSeconds(0);
                const dayEnd = new Date(day);
                dayEnd.setMinutes(59);
                dayEnd.setHours(23);
                dayEnd.setSeconds(59);

                const counted = await this.domainEventModel
                    .find({
                        type: _type,
                        createdAt: {
                            $gte: dayStart,
                            $lte: dayEnd,
                        },
                    })
                    .count()
                    .exec();

                let month = (1 + dayStart.getMonth()).toString();
                month = month.length > 1 ? month : '0' + month;
                let _day = dayStart.getDate().toString();
                _day = _day.length > 1 ? _day : '0' + _day;
                return {
                    day: month + '-' + _day,
                    count: counted,
                };
            }),
        );
    }

    getDaysArray = (start: Date, end: Date): Date[] => {
        const arr = [];
        for (
            let dt = new Date(start);
            dt <= end;
            dt.setDate(dt.getDate() + 1)
        ) {
            arr.push(new Date(dt));
        }
        return arr;
    };
}
