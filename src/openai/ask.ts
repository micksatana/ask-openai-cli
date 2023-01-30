import { getApi } from './api';
import { getEnv } from '../env';
import { CreateCompletionRequest } from 'openai';
import { parseError } from '../axios/parse-error';

export interface AskOptions {
  temperature?: number;
  maxTokens?: number;
  model: string;
}

export const parseDefaultAskOptions = (options?: AskOptions): AskOptions => {
  const env = getEnv();

  const {
    model = env.OPENAI_DEFAULT_MODEL,
    maxTokens = env.OPENAI_DEFAULT_MAX_TOKENS,
    temperature = env.OPENAI_DEFAULT_TEMPERATURE
  } = options || {};

  return { model, maxTokens, temperature };
};

export const ask = async (prompt: string, options?: AskOptions) => {
  const {
    model,
    maxTokens: max_tokens,
    temperature
  } = parseDefaultAskOptions(options);
  const api = getApi();

  try {
    const response = await api.createCompletion({
      model,
      prompt,
      temperature,
      max_tokens
    } as CreateCompletionRequest);

    return response.data;
  } catch (e) {
    throw parseError(e);
  }
};
