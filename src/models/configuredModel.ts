export type ConfiguredModel = {
    id: number;
    llm: number;
    llm_name: string;
    configuration: number;
    configuration_name: string;
    short_name: string;
    temperature: number;
    topP: number | null;
}

export type CreateConfiguredModelDto = {
    llm: number;
    configuration: number;
    short_name: string;
}
