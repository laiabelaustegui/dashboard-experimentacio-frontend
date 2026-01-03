import axios, { type AxiosInstance, type AxiosRequestConfig, AxiosError } from 'axios';
import { toaster } from '@/components/ui/toaster';

const BASE_URL = 'http://127.0.0.1:8000/';

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

class ApiProvider {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: BASE_URL,
        });
    }

    private handleError(error: unknown): never {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            const statusCode = axiosError.response?.status || 500;
            const message = axiosError.response?.data?.message || 
                           axiosError.response?.data?.error || 
                           axiosError.message || 
                           'An unexpected error occurred';
            
            throw new ApiError(statusCode, message, axiosError.response?.data);
        }
        throw error;
    }

    public async get<T>(
        path: string,
        params: Record<string, unknown> = {},
        options: AxiosRequestConfig = {}
    ): Promise<T> {
        try {
            const response = await this.axiosInstance.get<T>(path, {
                ...options,
                params,
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
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
        try {
            const response = await this.axiosInstance.post<T>(path, body, {
                ...options,
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async delete<T>(
        path: string,
        options: AxiosRequestConfig = {}
    ): Promise<T> {
        try {
            const response = await this.axiosInstance.delete<T>(path, {
                ...options,
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

}

const apiProvider = new ApiProvider();

export const fetcher = <T>(url: string) => apiProvider.get<T>(url);

export default apiProvider;
