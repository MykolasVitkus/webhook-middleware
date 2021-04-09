export interface SubscriberForm {
    name: string;
    webhookUrl: string;
    subscribedTo: SubscribedPublisher[];
}

export interface SubscribedPublisher {
    publisherId: string;
    mapperId: string;
}

export interface Subscriber {
    id: string;
    name: string;
    webhookUrl: string;
    subscribedTo: SubscribedPublisher[];
    createdAt: Date;
}

export interface SubscriberDTO {
    _id: string;
    name: string;
    webhookUrl: string;
    subscribedTo: SubscribedPublisher[];
    createdAt: Date;
}
