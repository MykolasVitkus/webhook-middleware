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
import { SubscriberDto } from './dto/subscriber.dto';
import { SubscribersService } from './subscribers.service';
import { Subscriber } from './schemas/subscriber.schema';
import { Types } from 'mongoose';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from './subscribers.module';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('subscribers')
@ApiTags('Subscribers')
export class SubscribersController {
    constructor(private readonly subscribersService: SubscribersService) {}

    @Get()
    @ApiQuery({ name: 'offset', required: false })
    @ApiQuery({ name: 'limit', required: false })
    findAll(
        @Query('offset') offset: string = DEFAULT_OFFSET,
        @Query('limit') limit: string = DEFAULT_LIMIT,
    ): Promise<Subscriber[]> {
        return this.subscribersService.findAll(offset, limit);
    }

    @Post()
    async create(@Body() subscriberDto: SubscriberDto): Promise<Subscriber> {
        return this.subscribersService.create(subscriberDto);
    }

    @Get('/count')
    count(): Promise<number> {
        return this.subscribersService.count();
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<Subscriber> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException();
        }
        return this.subscribersService.getById(id);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() subscriberDto: SubscriberDto,
    ): Promise<Subscriber> {
        return this.subscribersService.update(id, subscriberDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id') id: string): void {
        if (!Types.ObjectId.isValid(id)) {
            return;
        }
        this.subscribersService.delete(id);
        return;
    }
}
