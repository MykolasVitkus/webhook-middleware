import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SubscribersService } from '../subscribers/subscribers.service';
import { MapperDto } from './dto/mapper.dto';
import { MappersController } from './mappers.controller';
import { MappersService } from './mappers.service';
import jsonpathObjectTransform from 'jsonpath-object-transform';

describe('Mappers Controller', () => {
    let mappersController: MappersController;
    let subscribersService: SubscribersService;
    let mappersService: MappersService;

    const date = new Date();

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [MappersController],
            providers: [
                {
                    provide: MappersService,
                    useValue: {
                        findAll: jest.fn(),
                        create: jest.fn((arg: MapperDto) => ({
                            id: 'New',
                            createdAt: date,
                            ...arg,
                        })),
                        count: jest.fn(),
                        getById: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                        mapPayloadToFormat: jest.fn((input: any, format: any) =>
                            jsonpathObjectTransform(input, format),
                        ),
                    },
                },
                {
                    provide: SubscribersService,
                    useValue: {
                        removeAllSubscriptionsWithMapper: jest.fn(),
                    },
                },
            ],
        }).compile();
        mappersController = module.get<MappersController>(MappersController);
        mappersService = module.get<MappersService>(MappersService);
        subscribersService = module.get<SubscribersService>(SubscribersService);
    });

    it('should create a new Mapper', async () => {
        const spyOn = jest.spyOn(mappersService, 'create');
        await mappersController.create({ name: '', format: {}, sample: {} });
        expect(spyOn).toBeCalledTimes(1);
    });

    it('should edit a Mapper', async () => {
        const spyOn = jest.spyOn(mappersService, 'update');
        await mappersController.update('1', {
            name: 'updated',
            format: {
                data: '',
            },
            sample: {
                test: '',
            },
        });
        expect(spyOn).toBeCalledTimes(1);
    });

    it('should delete a Mapper', async () => {
        const spyOn = jest.spyOn(mappersService, 'delete');
        const spyOn2 = jest.spyOn(
            subscribersService,
            'removeAllSubscriptionsWithMapper',
        );
        mappersController.delete('605f1bb2650c2d4d134d04c2');
        expect(spyOn).toBeCalledTimes(1);
        expect(spyOn2).toBeCalledTimes(1);
    });

    it('should fetch all Mappers', async () => {
        const spyOn = jest.spyOn(mappersService, 'findAll');
        await mappersController.findAll();
        expect(spyOn).toBeCalledTimes(1);
    });

    it('should fetch a Mapper by id', async () => {
        const spyOn = jest.spyOn(mappersService, 'getById');
        await mappersController.findById('605f1bb2650c2d4d134d04c2');
        expect(spyOn).toBeCalledTimes(1);
    });

    it('should return 404 when getting a Mapper by incorrect id', async () => {
        const spyOn = jest.spyOn(mappersService, 'getById');
        try {
            await mappersController.findById('invalid');
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
            expect(spyOn).toBeCalledTimes(0);
        }
    });

    it('should transform a webhook', async () => {
        const result = mappersService.mapPayloadToFormat(
            { default: 'value' },
            { new: '$.default' },
        );
        expect(result).toMatchObject({
            new: 'value',
        });
    });
});
