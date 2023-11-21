export interface MapperForm {
    name: string;
    format: unknown;
    sample: unknown;
}

export interface Mapper {
    id: string;
    name: string;
    format: unknown;
    sample: unknown;
    createdAt: Date;
}

export interface MapperDTO {
    _id: string;
    name: string;
    format: unknown;
    sample: unknown;
    createdAt: Date;
}
