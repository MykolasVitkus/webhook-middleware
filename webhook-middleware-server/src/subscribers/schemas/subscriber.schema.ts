import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
    SubscribedPublisher,
    SubscribedPublisherSchema,
} from './subscribed-publisher.schema';

export type SubscriberDocument = Subscriber & Document;

@Schema({ versionKey: false })
export class Subscriber {
    @Prop()
    id: string;

    @Prop({ required: true })
    name: string;

    @Prop([{ type: SubscribedPublisherSchema }])
    subscribedTo: SubscribedPublisher[];

    @Prop()
    webhookUrl: string;

    @Prop({ type: Date, required: true, default: Date.now })
    createdAt: Date;
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
