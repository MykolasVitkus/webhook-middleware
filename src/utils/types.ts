export type Dictionary<T> = { [id: string]: T };

export type PaginatedDictionary<T> = { [id: string]: T };

export type Pagination = {
    page: number;
    offset: number;
    limit: number;
};
