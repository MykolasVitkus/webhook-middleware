import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SubscribersService } from '../subscribers/subscribers.service';
import { PublisherDto } from './dto/publisher.dto';
import { PublishersController } from './publishers.controller';
import { PublishersService } from './publishers.service';

describe('Publishers Controller', () => {
    let publishersController: PublishersController;
    let publishersService: PublishersService;
    let subscribersService: SubscribersService;

    const date = new Date();

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [PublishersController],
            providers: [
                {
                    provide: PublishersService,
                    useValue: {
                        findAll: jest.fn(),
                        create: jest.fn((arg: PublisherDto) => ({
                            id: 'New',
                            createdAt: date,
                            ...arg,
                        })),
                        count: jest.fn(),
                        getById: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
                {
                    provide: SubscribersService,
                    useValue: {
                        removeAllSubscriptionsWithPublisher: jest.fn(),
                    },
                },
            ],
        }).compile();
        publishersController = module.get<PublishersController>(
            PublishersController,
        );
        publishersService = module.get<PublishersService>(PublishersService);
        subscribersService = module.get<SubscribersService>(SubscribersService);
    });

    it('should create a new Publisher', async () => {
        const spyOn = jest.spyOn(publishersService, 'create');
        await publishersController.create({ name: 'New' });
        expect(spyOn).toBeCalledTimes(1);
    });

    it('should get all Publishers', async () => {
        const spyOn = jest.spyOn(publishersService, 'findAll');
        await publishersController.findAll();
        expect(spyOn).toBeCalledTimes(1);
    });
    it('should get a Publisher', async () => {
        const spyOn = jest.spyOn(publishersService, 'getById');
        try {
            await publishersController.findById('invalid');
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
            expect(spyOn).toBeCalledTimes(0);
        }
        await publishersController.findById('605f1bb2650c2d4d134d04c2');
        expect(spyOn).toBeCalledTimes(1);
    });
    it('should get Publisher count', async () => {
        const spyOn = jest.spyOn(publishersService, 'count');
        await publishersController.count();
        expect(spyOn).toBeCalledTimes(1);
    });

    it('should update a Publisher', async () => {
        const spyOn = jest.spyOn(publishersService, 'update');
        await publishersController.update('publisherId', { name: '' });
        expect(spyOn).toBeCalledTimes(1);
    });

    it('should delete a Publisher', async () => {
        const spyOnDelete = jest.spyOn(publishersService, 'delete');
        const spyOnRemoveSubscriptions = jest.spyOn(
            subscribersService,
            'removeAllSubscriptionsWithPublisher',
        );
        await publishersController.delete('invalid');
        expect(spyOnRemoveSubscriptions).toBeCalledTimes(0);
        expect(spyOnDelete).toBeCalledTimes(0);
        await publishersController.delete('605f1bb2650c2d4d134d04c2');
        expect(spyOnDelete).toBeCalledTimes(1);
        expect(spyOnRemoveSubscriptions).toBeCalledTimes(1);
    });
});
