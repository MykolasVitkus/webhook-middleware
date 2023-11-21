import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { PublisherDto } from './dto/publisher.dto';
import { PublishersService } from './publishers.service';
import { Publisher } from './schemas/publisher.schema';
import { Types } from 'mongoose';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from './publishers.module';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { SubscribersService } from '../subscribers/subscribers.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('publishers')
@ApiTags('Publishers')
export class PublishersController {
    constructor(
        private readonly publishersService: PublishersService,
        private readonly subscribersService: SubscribersService,
    ) {}

    @Get()
    @ApiQuery({ name: 'offset', required: false })
    @ApiQuery({ name: 'limit', required: false })
    findAll(
        @Query('offset') offset: string = DEFAULT_OFFSET,
        @Query('limit') limit: string = DEFAULT_LIMIT,
    ): Promise<Publisher[]> {
        return this.publishersService.findAll(offset, limit);
    }

    @Post()
    async create(@Body() publisherDto: PublisherDto): Promise<Publisher> {
        return this.publishersService.create(publisherDto);
    }

    @Get('/count')
    count(): Promise<number> {
        return this.publishersService.count();
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<Publisher> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException();
        }
        return this.publishersService.getById(id);
    }

    @Put(':id')
    update(
        @Param('id') publisherId: string,
        @Body() publisherDto: PublisherDto,
    ): Promise<Publisher> {
        return this.publishersService.update(publisherId, publisherDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id') id: string): void {
        if (!Types.ObjectId.isValid(id)) {
            return;
        }
        this.publishersService.delete(id);
        this.subscribersService.removeAllSubscriptionsWithPublisher(id);
        return;
    }
}
