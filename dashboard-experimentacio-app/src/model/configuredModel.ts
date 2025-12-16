export type ConfiguredModel = {
    id: number;
    llm: number;
    configuration: number;
    short_name: string;
}

export type CreateConfiguredModelDto = {
    llm: number;
    configuration: number;
    short_name: string;
}
