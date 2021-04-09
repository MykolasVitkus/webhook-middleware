export interface Webhook {
    id: string;
    type: string;
    status: string;
    payload: unknown;
    publisherId: string | null;
    subscriberId: string | null;
    createdAt: Date;
    metadata: ResponseType | null;
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
    metadata: ResponseType | null;
    prevEvent: Webhook | null;
}

export enum WebhookStatus {
    Error = 'error',
    Success = 'success',
}

export interface ResponseType {
    response: string | null;
    status: number;
}
