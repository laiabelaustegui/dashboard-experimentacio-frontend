import {
  Flex,
  Heading,
  Text,
  Card,
  Stack,
  Separator,
} from "@chakra-ui/react";

export default function HelpPage() {
  return (
    <Flex direction="column" gap={6} p={6} w="full" maxW="900px" mx="auto">
      <Heading as="h1" size="xl">
        Dashboard Help
      </Heading>
      <Text color="fg.muted">
        Welcome to the LLM-Powered Mobile App Recommender Experimentation Dashboard.
        This guide will help you understand how to use the platform.
      </Text>

      <Separator />

      {/* Overview Section */}
      <Card.Root>
        <Card.Body>
          <Stack gap={3}>
            <Heading as="h2" size="lg">
              Overview
            </Heading>
            <Text>
              This dashboard allows you to experiment with different Large Language Models (LLMs)
              for mobile app recommendation tasks. You can configure models, create prompt templates,
              and run experiments to compare their performance.
            </Text>
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* Models Section */}
      <Card.Root>
        <Card.Body>
          <Stack gap={3}>
            <Heading as="h2" size="lg">
              Large Language Models (LLMs)
            </Heading>
            <Text fontWeight="semibold">What are LLMs?</Text>
            <Text>
              LLMs are AI models that can understand and generate natural language. In this dashboard,
              you can add different models (OpenAI, Anthropic, etc.) and configure them with specific
              parameters.
            </Text>
            <Text fontWeight="semibold">How to use:</Text>
            <ul style={{ paddingLeft: '24px' }}>
              <li>Go to <strong>Models</strong> to view all available LLMs</li>
              <li>Click <strong>Add new model</strong> to register a new LLM provider</li>
              <li>Configure models with specific parameters (temperature, max tokens, etc.)</li>
              <li>View model configurations to see all available setups</li>
            </ul>
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* Prompt Templates Section */}
      <Card.Root>
        <Card.Body>
          <Stack gap={3}>
            <Heading as="h2" size="lg">
              Prompt Templates
            </Heading>
            <Text fontWeight="semibold">What are Prompt Templates?</Text>
            <Text>
              Prompt templates define the instructions and format for how the LLM should recommend
              mobile apps. They include system prompts, user prompts, and structured output schemas.
            </Text>
            <Text fontWeight="semibold">How to use:</Text>
            <ul style={{ paddingLeft: '24px' }}>
              <li>Go to <strong>Prompt Templates</strong> to view existing templates</li>
              <li>Click <strong>Create template</strong> to design a new prompt structure</li>
              <li>Define system prompts (instructions for the model)</li>
              <li>Define user prompts (the actual recommendation request)</li>
              <li>Upload JSON schemas to enforce structured outputs</li>
            </ul>
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* Experiments Section */}
      <Card.Root>
        <Card.Body>
          <Stack gap={3}>
            <Heading as="h2" size="lg">
              Experiments
            </Heading>
            <Text fontWeight="semibold">What are Experiments?</Text>
            <Text>
              Experiments allow you to test different model configurations and prompt templates
              to see which combination performs best for mobile app recommendations.
            </Text>
            <Text fontWeight="semibold">How to use:</Text>
            <ul style={{ paddingLeft: '24px' }}>
              <li>Go to <strong>Experiments</strong> to view all experiments</li>
              <li>Click <strong>Create experiment</strong> to start a new test</li>
              <li>Select a configured model and prompt template</li>
              <li>Provide test parameters (number of runs, etc.)</li>
              <li>View experiment results including rankings and criteria</li>
            </ul>
            <Text fontWeight="semibold">Understanding Results:</Text>
            <ul style={{ paddingLeft: '24px' }}>
              <li><strong>Run ID:</strong> Unique identifier for each experiment run</li>
              <li><strong>Elapsed time:</strong> How long the model took to respond</li>
              <li><strong>Mobile app rankings:</strong> The ordered list of recommended apps</li>
              <li><strong>Ranking criteria:</strong> The factors used to rank each app</li>
            </ul>
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* Workflow Section */}
      <Card.Root>
        <Card.Body>
          <Stack gap={3}>
            <Heading as="h2" size="lg">
              Recommended Workflow
            </Heading>
            <ol style={{ paddingLeft: '24px', marginBottom: '8px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Add your LLM:</strong> Register the language models you want to test
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Configure models:</strong> Set up different configurations with various parameters
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Create prompt templates:</strong> Design the prompts that will guide the model
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Run experiments:</strong> Test different combinations of models and prompts
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Analyze results:</strong> Compare performance metrics to find the best setup
              </li>
            </ol>
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* Tips Section */}
      <Card.Root>
        <Card.Body>
          <Stack gap={3}>
            <Heading as="h2" size="lg">
              Tips & Best Practices
            </Heading>
            <ul style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                Start with a simple prompt template and iterate based on results
              </li>
              <li style={{ marginBottom: '8px' }}>
                Test multiple model configurations to find the optimal parameters
              </li>
              <li style={{ marginBottom: '8px' }}>
                Run several experiments with the same setup to ensure consistency
              </li>
              <li style={{ marginBottom: '8px' }}>
                Use structured JSON schemas to ensure predictable output formats
              </li>
              <li style={{ marginBottom: '8px' }}>
                Monitor elapsed time to balance quality with performance
              </li>
            </ul>
          </Stack>
        </Card.Body>
      </Card.Root>

      <Text textStyle="sm" color="fg.muted" textAlign="center" mt={4}>
        Need more help? Contact your system administrator.
      </Text>
    </Flex>
  );
}
