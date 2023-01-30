import { mkdirSync, writeFileSync } from 'fs';
import { homedir, EOL } from 'os';
import { dirname, resolve } from 'path';
import PromptSync from 'prompt-sync';
import { DefaultMaxTokens, DefaultModel, DefaultTemperature } from './env';

export const HomeEnv = resolve(homedir(), '.ask-openai-cli', '.env');
export const ModelDescription =
  'ID of the model to use. This value can be found at https://beta.openai.com/docs/api-reference/models/list.';
export const MaxTokensDescription =
  "The maximum number of tokens to generate in the completion. The token count of your prompt plus this value cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).";
export const TemperatureDescription =
  'Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer.';

export const initSync = () => {
  const prompt = PromptSync();
  const apiKey = prompt('OpenAI API Key: ', {
    echo: '*'
  });
  console.log(`${ModelDescription} Default is ${DefaultModel}`);
  const model = prompt('Model ID: ') || DefaultModel;
  console.log(`${MaxTokensDescription} Default is ${DefaultMaxTokens}`);
  const maxTokens = prompt('Max Tokens: ') || DefaultMaxTokens;
  console.log(`${TemperatureDescription} Default is ${DefaultTemperature}`);
  const temperature = prompt('Temperature: ') || DefaultTemperature;

  mkdirSync(dirname(HomeEnv), { recursive: true });
  writeFileSync(
    HomeEnv,
    [
      `OPENAI_API_KEY=${apiKey}`,
      `OPENAI_DEFAULT_MODEL=${model}`,
      `OPENAI_DEFAULT_TEMPERATURE=${temperature}`,
      `OPENAI_DEFAULT_MAX_TOKENS=${maxTokens}`
    ].join(EOL)
  );

  console.log(`Environment file created at ${HomeEnv}.`);
};
