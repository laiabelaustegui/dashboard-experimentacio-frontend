export type CreateExperimentDto = {
    name: string;
    prompt_template: number; // PromptTemplate ID
    configurated_models: number [];   // Array of ConfiguredModel IDs
    num_runs: number;
}

export type Experiment = {
    id: number;
    prompt_template: number; // PromptTemplate ID
    configurated_models: number [];   // Array of ConfiguredModel IDs
    name: string;
    num_runs: number;
    execution_date: string; // ISO date string
    status: string;
}