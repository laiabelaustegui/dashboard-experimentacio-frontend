"use client";

import { Flex } from "@chakra-ui/react"
import { TemplateForm } from "@/components/prompt-templates/TemplateForm";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import apiProvider from "@/providers/api";
import type { PromptTemplate } from "@/models/promptTemplate";

export default function NewPromptTemplatePage() {
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get('duplicate');
  const [initialData, setInitialData] = useState<PromptTemplate | undefined>();
  const [loading, setLoading] = useState(!!duplicateId);

  useEffect(() => {
    if (duplicateId) {
      const fetchTemplate = async () => {
        try {
          const data = await apiProvider.get<PromptTemplate>(
            `/prompt-templates/${duplicateId}/`
          );
          setInitialData(data);
        } catch (error) {
          console.error("Error fetching template to duplicate:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTemplate();
    }
  }, [duplicateId]);

  if (loading) {
    return (
      <Flex direction="column" gap={4} p={4} w="full">
        Loading...
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap={4} p={4} w="full">
        <TemplateForm initialData={initialData} />
    </Flex>
    );
}