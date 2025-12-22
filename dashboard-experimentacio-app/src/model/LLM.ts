export type LLM = {
    id: number;
    name: string;
    provider: string;
    API_endpoint: string;
    creation_date: string;
}

export type CreateLLMDto = {
    name: string;
    provider: string;
    API_endpoint: string;
    API_key: string;
}