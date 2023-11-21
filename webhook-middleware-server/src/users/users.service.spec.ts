import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: UsersService,
                    useValue: {
                        create: jest.fn(
                            (_username: string, _psw: string) => ({}),
                        ),
                        createUser: jest.fn(
                            (username: string, password: string) =>
                                service.create(username, password),
                        ),
                    },
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a user', async () => {
        const spyOn = jest.spyOn(service, 'create');
        await service.createUser('new', 'user');
        expect(spyOn).toBeCalledTimes(1);
    });
});
