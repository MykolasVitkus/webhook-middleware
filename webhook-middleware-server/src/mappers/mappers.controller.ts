import {
    Body,
    Controller,
    Delete,
    forwardRef,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { MapperDto } from './dto/mapper.dto';
import { MappersService } from './mappers.service';
import { Mapper } from './schemas/mapper.schema';
import { Types } from 'mongoose';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from './mappers.module';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { SubscribersService } from '../subscribers/subscribers.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('mappers')
@ApiTags('Mappers')
export class MappersController {
    constructor(
        private readonly mappersService: MappersService,
        @Inject(forwardRef(() => SubscribersService))
        private readonly subscribersService: SubscribersService,
    ) {}

    @Get()
    @ApiQuery({ name: 'offset', required: false })
    @ApiQuery({ name: 'limit', required: false })
    findAll(
        @Query('offset') offset: string = DEFAULT_OFFSET,
        @Query('limit') limit: string = DEFAULT_LIMIT,
    ): Promise<Mapper[]> {
        return this.mappersService.findAll(offset, limit);
    }

    @Get('/count')
    count(): Promise<number> {
        return this.mappersService.count();
    }

    @Post()
    async create(@Body() mapperDto: MapperDto): Promise<Mapper> {
        return this.mappersService.create(mapperDto);
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<Mapper> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException();
        }
        return this.mappersService.getById(id);
    }

    @Put(':id')
    update(
        @Param('id') mapperId: string,
        @Body() mapperDto: MapperDto,
    ): Promise<Mapper> {
        return this.mappersService.update(mapperId, mapperDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id') id: string): void {
        if (!Types.ObjectId.isValid(id)) {
            return;
        }
        this.mappersService.delete(id);
        this.subscribersService.removeAllSubscriptionsWithMapper(id);
        return;
    }
}
