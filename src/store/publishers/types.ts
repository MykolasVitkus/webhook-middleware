export interface Publisher {
    id: string;
    name: string;
    createdAt: Date;
}

export interface PublisherDTO {
    _id: string;
    name: string;
    createdAt: string;
}