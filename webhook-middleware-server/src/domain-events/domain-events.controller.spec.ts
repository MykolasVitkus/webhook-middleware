import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SubscribersService } from '../subscribers/subscribers.service';
import { DomainEventsController } from './domain-events.controller';
import { DomainEventsService } from './domain-events.service';

export type MockType<T> = {
    [P in keyof T]?: jest.Mock<unknown>;
};

describe('Domain Events Controller', () => {
    let domainEventsController: DomainEventsController;
    let domainEventsService: DomainEventsService;
    let subscribersService: SubscribersService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [DomainEventsController],
            providers: [
                {
                    provide: DomainEventsService,
                    useValue: {
                        findAll: jest.fn(),
                        findByCount: jest.fn(),
                        count: jest.fn(),
                        findBy: jest.fn(),
                        getById: jest.fn((_) => ({
                            prevEvent: {
                                _id: '12539468394-0234',
                            },
                        })),

                        update: jest.fn(),
                        delete: jest.fn(),
                        getPublisherTotals: jest.fn(),
                        getPublishedWebhooksByPublisher: jest.fn(),
                        getReceivedWebhooksBySubscriber: jest.fn(),
                        getByPrevEventId: jest.fn(),
                        getCount: jest.fn(),
                        getAverageExecutionTime: jest.fn(),
                        getExecutionTimes: jest.fn(),
                        getCounts: jest.fn(),
                    },
                },
                {
                    provide: SubscribersService,
                    useValue: {
                        getById: jest.fn(),
                        notifySubscriber: jest.fn(),
                        findAll: jest.fn(),
                        findBy: jest.fn(),
                        removeAllSubscriptionsWithMapper: jest.fn(),
                    },
                },
            ],
        }).compile();
        subscribersService = module.get<SubscribersService>(SubscribersService);

        domainEventsController = module.get<DomainEventsController>(
            DomainEventsController,
        );
        domainEventsService = module.get<DomainEventsService>(
            DomainEventsService,
        );
        subscribersService.findAll('0', '0');
    });

    it('should get all domain events', async () => {
        const spyOn = jest.spyOn(domainEventsService, 'findBy');
        await domainEventsController.get();
        expect(spyOn).toBeCalledTimes(1);
    });

    it('should get count of all domain events', async () => {
        const spyOn = jest.spyOn(domainEventsService, 'findByCount');
        await domainEventsController.getCount();
        expect(spyOn).toBeCalledTimes(1);
    });

    it('should get totals', async () => {
        const spyOn = jest.spyOn(domainEventsService, 'getPublisherTotals');
        try {
            await domainEventsController.getTotals('1');
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
            expect(spyOn).toBeCalledTimes(0);
        }
        await domainEventsController.getTotals('605f1bb2650c2d4d134d04c2');
        expect(spyOn).toBeCalledTimes(1);
    });

    it('should get published webhooks', async () => {
        const spyOn = jest.spyOn(
            domainEventsService,
            'getPublishedWebhooksByPublisher',
        );
        try {
            await domainEventsController.getPublishedWebhooks('1');
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
            expect(spyOn).toBeCalledTimes(0);
        }
        await domainEventsController.getPublishedWebhooks(
            '605f1bb2650c2d4d134d04c2',
        );
        expect(spyOn).toBeCalledTimes(1);
    });

    it('should get subscribed webhooks', async () => {
        const spyOn = jest.spyOn(
            domainEventsService,
            'getReceivedWebhooksBySubscriber',
        );
        try {
            await domainEventsController.getSubscribedWebhooks('1');
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
            expect(spyOn).toBeCalledTimes(0);
        }
        await domainEventsController.getSubscribedWebhooks(
            '605f1bb2650c2d4d134d04c2',
        );
        expect(spyOn).toBeCalledTimes(1);
    });

    it('should get resend webhook', async () => {
        const spyOn = jest.spyOn(domainEventsService, 'getByPrevEventId');
        const spyOn2 = jest.spyOn(subscribersService, 'notifySubscriber');

        try {
            await domainEventsController.resendWebhook('1');
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
            expect(spyOn).toBeCalledTimes(0);
            expect(spyOn2).toBeCalledTimes(0);
        }
        await domainEventsController.resendWebhook('605f1bb2650c2d4d134d04c2');
        expect(spyOn).toBeCalledTimes(1);
        expect(spyOn2).toBeCalledTimes(1);
    });

    it('should get get webhook count', async () => {
        const spyOn = jest.spyOn(domainEventsService, 'getCount');
        await domainEventsController.count(null, null, null);
        expect(spyOn).toBeCalledTimes(1);
    });

    it('should get get webhook average time', async () => {
        const spyOn = jest.spyOn(
            domainEventsService,
            'getAverageExecutionTime',
        );
        await domainEventsController.averageTime();
        expect(spyOn).toBeCalledTimes(1);
    });

    it('should get get webhook times', async () => {
        const spyOn = jest.spyOn(domainEventsService, 'getExecutionTimes');
        await domainEventsController.times(null, null);
        expect(spyOn).toBeCalledTimes(1);
    });

    it('should get get webhook counts', async () => {
        const spyOn = jest.spyOn(domainEventsService, 'getCounts');
        await domainEventsController.counts(null, null, null);
        expect(spyOn).toBeCalledTimes(1);
    });
});
