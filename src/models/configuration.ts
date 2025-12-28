export type Configuration = {
    id: number;
    name: string;
    temperature: number;
    topP: number | null;
}

export type CreateConfigurationDto = {
    name: string;
    temperature: number;
    topP?: number;
}