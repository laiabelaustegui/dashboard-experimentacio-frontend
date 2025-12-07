
// TODO: Expandir aquest tipus per obtenir més camps segons sigui necessari
export type PromptTemplate = {
    id: number;
    name: string;
    creation_date: string;
};

export type CreatePromptTemplateDto = {
  name: string;
  system_prompt: {
    text: string;
    schema: unknown; // fichero JSON completo
  };
  user_prompt: {
    text: string;
  };
};

