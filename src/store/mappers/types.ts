export interface MapperForm {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    format: any;
}

export interface Mapper {
    id: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    format: any;
    createdAt: Date;
}

export interface MapperDTO {
    _id: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    format: any;
    createdAt: Date;
}
