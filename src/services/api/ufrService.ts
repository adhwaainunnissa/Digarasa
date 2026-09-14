import api from '../../api/axios';

export interface UfrStepData {
    tag_name: string;
    gi_name: string;
    target: string;
    value: string | number;
    quality: string | number;
    time: string;
    value_cb?: string | number | null;
    time_cb?: string | null;
}

export interface UfrBebanData {
    tag_name: string;
    target: string;
    value: string | number;
    quality: string | number;
    time: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}

export const getUfrStepRelay = async (step: number, page: number = 1, limit: number = 100, search: string = ''): Promise<PaginatedResponse<UfrStepData>> => {
    const response = await api.get(`/ufr/step/${step}`, {
        params: { page, limit, search }
    });
    return response.data;
};

export const getUfrBeban = async (beban: number, page: number = 1, limit: number = 100, search: string = ''): Promise<PaginatedResponse<UfrBebanData>> => {
    const response = await api.get(`/ufr/beban/${beban}`, {
        params: { page, limit, search }
    });
    return response.data;
};
