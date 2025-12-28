import { ConfiguredModel } from "./configuredModel";
import { Feature } from "./promptTemplate";

export type CreateExperimentDto = {
    name: string;
    prompt_template: number; // PromptTemplate ID
    configured_models: number [];   // Array of ConfiguredModel IDs
    num_runs: number;
}

export type Experiment = {
    id: number;
    prompt_template: number; // PromptTemplate ID
    configured_models: number [];   // Array of ConfiguredModel IDs
    configured_models_detail?: ConfiguredModel []; // Optional detailed info
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
  configured_model: ConfiguredModel;
  feature: Feature;
  mobile_app_rankings: MobileAppRanking[];
  ranking_criteria: RankingCriterion[];
};