import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscribedPublisherDocument = SubscribedPublisher & Document;

@Schema({ versionKey: false })
export class SubscribedPublisher {
    @Prop()
    id: string;

    @Prop({ required: true })
    publisherId: string;

    @Prop({ required: true })
    mapperId: string;

    @Prop({ type: Date, required: true, default: Date.now })
    createdAt: Date;
}

export const SubscribedPublisherSchema = SchemaFactory.createForClass(
    SubscribedPublisher,
);
