export interface Webhook {
    id: string;
    type: string;
    status: string;
    payload: unknown;
    publisherId: string | null;
    subscriberId: string | null;
    createdAt: Date;
    metadata: unknown;
    prevEvent: Webhook | null;
}

export interface WebhookDTO {
    _id: string;
    type: string;
    status: string;
    payload: unknown;
    publisherId: string | null;
    subscriberId: string | null;
    createdAt: Date;
    metadata: unknown;
    prevEvent: Webhook | null;
}
