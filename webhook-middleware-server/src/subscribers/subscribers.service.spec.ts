import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { EventEmitter2 } from 'eventemitter2';
import { Model } from 'mongoose';
import { MappersService } from '../mappers/mappers.service';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { SubscribersService } from './subscribers.service';
import jsonpathObjectTransform from 'jsonpath-object-transform';

export type MockType<T> = {
    [P in keyof T]?: jest.Mock<unknown>;
};

describe('Subscribers Controller', () => {
    let subscribersService: SubscribersService;
    let mockModel: Model<SubscriberDocument>;

    const eventEmitterMockFactory: () => MockType<EventEmitter2> = jest.fn(
        () => ({
            emit: jest.fn((event) => event),
        }),
    );

    const mappersServiceMockFactory: () => MockType<MappersService> = jest.fn(
        () => ({
            getById: jest.fn((id: string) => id),
            mapPayloadToFormat: jest.fn((payload, format) =>
                jsonpathObjectTransform(payload, format),
            ),
        }),
    );

    const subscriberModelMockFactory: () => MockType<
        Model<SubscriberDocument>
    > = jest.fn(() => ({
        // then: jest.fn(() => mockModel),
        forEach: jest.fn((_) => _),
        findByIdAndRemove: jest.fn((_id) => mockModel),
        findByIdAndUpdate: jest.fn((_id, subscriber) => subscriber),
        findById: jest.fn((_) => mockModel),
        save: jest.fn((something) => something),
        find: jest.fn((_) => mockModel),
        skip: jest.fn((_) => mockModel),
        limit: jest.fn((_) => mockModel),
        exec: jest.fn((something) => something),
    }));

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken(Subscriber.name),
                    useFactory: subscriberModelMockFactory,
                },
                {
                    provide: MappersService,
                    useFactory: mappersServiceMockFactory,
                },
                {
                    provide: EventEmitter2,
                    useFactory: eventEmitterMockFactory,
                },
                SubscribersService,
            ],
        }).compile();

        subscribersService = module.get<SubscribersService>(SubscribersService);
        mockModel = module.get<Model<SubscriberDocument>>(
            getModelToken(Subscriber.name),
        );
    });

    it('should return a Subscriber doc', async () => {
        const spy = jest.spyOn(mockModel, 'findById');
        await subscribersService.getById('123');
        expect(spy).toBeCalled();
    });

    it('should return all Subscriber docs', async () => {
        const spy = jest.spyOn(mockModel, 'find');
        await subscribersService.findAll('0', '10');
        expect(spy).toBeCalled();
    });

    // it('should create a Subscriber doc', async () => {
    //     await subscribersService.create({
    //         name: 'name',
    //         webhookUrl: 'url',
    //         subscribedTo: [],
    //     });
    // });

    it('should return update a Subscriber doc', async () => {
        const spy = jest.spyOn(mockModel, 'findByIdAndUpdate');
        await subscribersService.update('0', {
            name: 'name',
            webhookUrl: 'url',
            subscribedTo: [],
        });
        expect(spy).toBeCalled();
    });

    it('should delete a Subscriber doc', async () => {
        const spy = jest.spyOn(mockModel, 'findByIdAndRemove');
        await subscribersService.delete('0');
        expect(spy).toBeCalled();
    });

    it('should get all Subscriber docs by publisher id', async () => {
        const spy = jest.spyOn(mockModel, 'find');
        await subscribersService.findAllByPublisherId('0');
        expect(spy).toBeCalled();
    });

    it('should remove all subscriptions with mapper', async () => {
        const spy = jest.spyOn(mockModel, 'find');
        await subscribersService.removeAllSubscriptionsWithMapper('0');
        expect(spy).toBeCalled();
    });

    it('should remove all subscriptions with publisher', async () => {
        const spy = jest.spyOn(mockModel, 'find');
        await subscribersService.removeAllSubscriptionsWithPublisher('0');
        expect(spy).toBeCalled();
    });

    // it('should create a Subscriber document', async () => {
    //     const spyOn()
    // })
});
