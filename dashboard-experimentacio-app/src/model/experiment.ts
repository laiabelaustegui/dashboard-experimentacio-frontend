export type CreateExperimentDto = {
    name: string;
    prompt_template: number; // PromptTemplate ID
    configurated_models: number [];   // Array of ConfiguredModel IDs
    num_runs: number;
}