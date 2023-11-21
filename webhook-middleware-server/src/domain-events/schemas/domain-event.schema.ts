import {
    Prop,
    Schema as NestMongooseSchema,
    SchemaFactory,
} from '@nestjs/mongoose';
import { Document, Schema } from 'mongoose';

export type DomainEventDocument = DomainEvent & Document;

export enum DomainEventStatus {
    Success = 'success',
    Error = 'error',
}

export enum DomainEventType {
    Received = 'received_message',
    Sent = 'sent_message',
}
export interface ResponseType {
    response: string | null;
    status: number;
}

@NestMongooseSchema({ versionKey: false })
export class DomainEvent {
    constructor(
        type: string,
        status: string | null,
        payload: unknown,
        publisherId: string | null = null,
        subscriberId: string | null = null,
        metadata: ResponseType | null = null,
        prevEvent: DomainEvent | null = null,
        executionTime: number | null = null,
    ) {
        this.type = type;
        this.status = status;
        this.payload = payload;
        this.payloadString = JSON.stringify(payload);
        this.publisherId = publisherId;
        this.subscriberId = subscriberId;
        this.metadata = metadata;
        this.prevEvent = prevEvent;
        this.executionTime = executionTime;
    }
    @Prop()
    id: string;

    @Prop({ required: true, enum: DomainEventType })
    type: string;

    @Prop({ required: true, enum: DomainEventStatus })
    status: string;

    @Prop({ required: true, type: Schema.Types.Mixed })
    payload: unknown;

    @Prop({ required: true })
    payloadString: string;

    @Prop({ required: false })
    publisherId: string | null;

    @Prop({ required: false })
    subscriberId: string | null;

    @Prop({ type: Date, required: true, default: Date.now })
    createdAt: Date;

    @Prop({ required: false, type: Schema.Types.Mixed })
    metadata: unknown;

    @Prop({ required: false, type: this })
    prevEvent: DomainEvent;

    @Prop({ required: false })
    executionTime: number;
}

export const DomainEventSchema = SchemaFactory.createForClass(DomainEvent);
