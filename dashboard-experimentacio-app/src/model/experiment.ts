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
    runs: ExperimentRun[];
}

export type MobileAppRanking = {
    id: number;
    mobile_app: string; 
    rank: number;
}

export type RankingCriterion = {
  id: number;
  name: string;
  description: string;
};

export type ExperimentRun = {
  id: number;
  elapsed_time: number;
  configured_model: number; // ID del configured model
  mobile_app_rankings: MobileAppRanking[];
  ranking_criteria: RankingCriterion[];
};