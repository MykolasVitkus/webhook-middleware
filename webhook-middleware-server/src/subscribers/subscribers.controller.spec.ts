import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SubscriberDto } from './dto/subscriber.dto';
import { SubscribersController } from './subscribers.controller';
import { SubscribersService } from './subscribers.service';

describe('Subscribers Controller', () => {
    let subscribersController: SubscribersController;
    let subscribersService: SubscribersService;

    const date = new Date();

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [SubscribersController],
            providers: [
                {
                    provide: SubscribersService,
                    useValue: {
                        findAll: jest.fn(),
                        create: jest.fn((arg: SubscriberDto) => ({
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
            ],
        }).compile();
        subscribersController = module.get<SubscribersController>(
            SubscribersController,
        );
        subscribersService = module.get<SubscribersService>(SubscribersService);
    });

    it('should create a new Subscriber', async () => {
        const spyOn = jest.spyOn(subscribersService, 'create');
        await subscribersController.create({
            name: 'New',
            webhookUrl: 'temp',
            subscribedTo: [],
        });
        expect(spyOn).toBeCalledTimes(1);
    });

    it('should get all Subscribers', async () => {
        const spyOn = jest.spyOn(subscribersService, 'findAll');
        await subscribersController.findAll();
        expect(spyOn).toBeCalledTimes(1);
    });
    it('should get a Subscriber', async () => {
        const spyOn = jest.spyOn(subscribersService, 'getById');
        try {
            await subscribersController.findById('invalid');
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
            expect(spyOn).toBeCalledTimes(0);
        }
        await subscribersController.findById('605f1bb2650c2d4d134d04c2');
        expect(spyOn).toBeCalledTimes(1);
    });

    it('should update a Subscriber', async () => {
        const spyOn = jest.spyOn(subscribersService, 'update');
        await subscribersController.update('subscriberId', {
            name: '',
            webhookUrl: '',
            subscribedTo: [],
        });
        expect(spyOn).toBeCalledTimes(1);
    });

    it('should delete a Subscriber', async () => {
        const spyOnDelete = jest.spyOn(subscribersService, 'delete');
        await subscribersController.delete('invalid');
        expect(spyOnDelete).toBeCalledTimes(0);
        await subscribersController.delete('605f1bb2650c2d4d134d04c2');
        expect(spyOnDelete).toBeCalledTimes(1);
    });
});
