import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
    DomainEvent,
    DomainEventStatus,
    DomainEventType,
} from '../domain-events/schemas/domain-event.schema';
import { PublishersService } from '../publishers/publishers.service';
import { Types } from 'mongoose';

@Controller('webhooks')
@ApiTags('Webhooks')
export class WebhooksController {
    constructor(
        private eventEmitter: EventEmitter2,
        private publishersService: PublishersService,
    ) {}
    /* eslint-disable @typescript-eslint/explicit-module-boundary-types*/
    /* eslint-disable @typescript-eslint/no-explicit-any*/
    @Post(':publisherId')
    @HttpCode(HttpStatus.OK)
    async create(
        @Param('publisherId') publisherId: string,
        @Body() webhookPayload: any,
    ): Promise<void> {
        console.log(webhookPayload);
        if (
            !Types.ObjectId.isValid(publisherId) ||
            !(await this.publishersService.getById(publisherId))
        ) {
            throw new NotFoundException();
        }
        this.eventEmitter.emit(
            DomainEventType.Received,
            new DomainEvent(
                DomainEventType.Received,
                DomainEventStatus.Success,
                webhookPayload,
                publisherId,
            ),
        );
    }
}
