import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/';

class ApiProvider {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: BASE_URL,
        });
    }

    public async get<T>(
        path: string,
        params: Record<string, unknown> = {},
        options: AxiosRequestConfig = {}
    ): Promise<T> {
        const response = await this.axiosInstance.get<T>(path, {
            ...options,
            params,
        });
        return response.data;
    }
    // T és el tipus de dada que esperem rebre
    // D és el tipus de dada que enviem en el body
    public async post<T, D>({
        body = undefined,
        path,
        options = {},
    }: {
        body?: D;
        options?: AxiosRequestConfig<D>;
        path: string;
    }): Promise<T> {
        const response = await this.axiosInstance.post<T>(path, body, {
            ...options,
        });
        return response.data;
    }

    public async delete<T>(
        path: string,
        options: AxiosRequestConfig = {}
    ): Promise<T> {
        const response = await this.axiosInstance.delete<T>(path, {
            ...options,
        });
        return response.data;
    }

}

const apiProvider = new ApiProvider();

export const fetcher = <T>(url: string) => apiProvider.get<T>(url);

export default apiProvider;
