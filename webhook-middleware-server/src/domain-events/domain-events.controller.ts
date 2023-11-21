import {
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    UseGuards,
    Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { SubscribersService } from '../subscribers/subscribers.service';
import { DomainEventsService } from './domain-events.service';
import { PublisherTotalsDto } from './dto/publisher-totals.dto';
import {
    DomainEvent,
    DomainEventDocument,
} from './schemas/domain-event.schema';
import type { DayCount } from './domain-events.service';
@UseGuards(AuthGuard('jwt'))
@Controller('domain-events')
@ApiTags('DomainEvents')
export class DomainEventsController {
    constructor(
        private readonly domainEventsService: DomainEventsService,
        private readonly subscribersService: SubscribersService,
    ) {}

    @Get('/')
    get(
        @Query('offset') offset: string = null,
        @Query('limit') limit: string = null,
        @Query('type') type: string = null,
        @Query('searchQuery') searchQuery: string = null,
        @Query('searchProperty') searchProperty: string = null,
        @Query('status') status: string = null,
        @Query('orderField') orderField: string = null,
        @Query('orderDirection') orderDirection: string = null,
        @Query('dateFrom') dateFrom: string = null,
        @Query('dateTo') dateTo: string = null,
    ): Promise<DomainEvent[]> {
        return this.domainEventsService.findBy({
            offset,
            limit,
            type,
            searchQuery,
            searchProperty,
            status,
            orderField,
            orderDirection,
            dateFrom,
            dateTo,
        });
    }

    @Get('/count')
    async getCount(
        @Query('type') _type: string = null,
        @Query('searchQuery') _searchQuery: string = null,
        @Query('searchProperty') _searchProperty: string = null,
        @Query('status') _status: string = null,
        @Query('from') _dateFrom: string = null,
        @Query('to') _dateTo: string = null,
    ): Promise<number> {
        const result = await this.domainEventsService.findByCount({
            offset: null,
            limit: null,
            type: _type,
            searchQuery: _searchQuery,
            searchProperty: _searchProperty,
            status: _status,
            orderField: null,
            orderDirection: null,
            dateFrom: _dateFrom,
            dateTo: _dateTo,
        });
        if (result) {
            return result[0] ? result[0].count : 0;
        }
        return null;
    }

    @Get('/publisher/:publisherId/totals')
    getTotals(@Param('publisherId') id: string): Promise<PublisherTotalsDto> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException();
        }
        return this.domainEventsService.getPublisherTotals(id);
    }

    @Get('/publisher/:publisherId/published-webhooks')
    getPublishedWebhooks(
        @Param('publisherId') id: string,
    ): Promise<DomainEvent[]> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException();
        }
        return this.domainEventsService.getPublishedWebhooksByPublisher(id);
    }

    @Get('/subscriber/:subscriberId/received-webhooks')
    getSubscribedWebhooks(
        @Param('subscriberId') id: string,
    ): Promise<DomainEvent[]> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException();
        }
        return this.domainEventsService.getReceivedWebhooksBySubscriber(id);
    }

    @Post('/retry/:domainEventId')
    async resendWebhook(
        @Param('domainEventId') id: string,
    ): Promise<DomainEvent> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException();
        }
        const domainEvent = await this.domainEventsService.getById(id);

        const prevEvent = domainEvent.prevEvent;
        const splitId = (<DomainEventDocument>prevEvent)._id
            .toString()
            .split('_');
        const newId = splitId[0].concat(
            splitId.length > 1
                ? '_'.concat((parseInt(splitId[1]) + 1).toString())
                : '_1',
        );
        (<DomainEventDocument>prevEvent)._id = newId;
        this.subscribersService.notifySubscriber(
            prevEvent,
            await this.subscribersService.getById(domainEvent.subscriberId),
        );
        return this.domainEventsService.getByPrevEventId(newId);
    }

    @Get('/count')
    count(
        @Query('from') from: string | null,
        @Query('to') to: string | null,
        @Query('type') type: string | null,
    ): Promise<number> {
        return this.domainEventsService.getCount(from, to, type);
    }

    @Get('/average-time')
    async averageTime(): Promise<number> {
        const result = await this.domainEventsService.getAverageExecutionTime();
        if (result) {
            return result[0] ? result[0].average : 0;
        }
        return 0;
    }

    @Get('/times')
    async times(
        @Query('from') from: string | null,
        @Query('to') to: string | null,
    ): Promise<number[]> {
        const result = await this.domainEventsService.getExecutionTimes(
            from,
            to,
        );
        return result ? result.map((time) => time.time) : [];
    }

    @Get('/counts')
    counts(
        @Query('from') from: string | null,
        @Query('to') to: string | null,
        @Query('type') type: string | null,
    ): Promise<DayCount[]> {
        return this.domainEventsService.getCounts(from, to, type);
    }
}
