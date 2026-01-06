export type Feature = {
  id: number;
  name: string;
  description?: string;
  user_prompt?: number; // FK to UserPrompt, optional when nested
};

export type CreateFeatureDto = {
  name: string;
  description?: string;
};

export type PromptTemplate = {
    id: number;
    name: string;
    creation_date: string;
    experiments_count?: number; // Number of experiments using this template
    system_prompt: {
      text: string;
      schema: unknown; // fichero JSON completo
    };
    user_prompt: {
      text: string;
      k?: number; // Number of items to recommend
      features: Feature[];
    };
};

export type CreatePromptTemplateDto = {
  name: string;
  system_prompt: {
    text: string;
    schema: unknown; // fichero JSON completo
  };
  user_prompt: {
    text: string;
    k?: number;
    features?: CreateFeatureDto[];
  };
};

