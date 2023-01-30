import { cleanEnv, num, str } from 'envalid';

export const DefaultModel = 'text-davinci-003';
export const DefaultTemperature = 0.5;
export const DefaultMaxTokens = 100;

let env: AskEnv;

export const getEnv = () => {
  if (!env) {
    env = cleanEnv(process.env, {
      OPENAI_API_KEY: str(),
      OPENAI_DEFAULT_MAX_TOKENS: num({ default: DefaultMaxTokens }),
      OPENAI_DEFAULT_MODEL: str({ default: DefaultModel }),
      OPENAI_DEFAULT_TEMPERATURE: num({ default: DefaultTemperature })
    });
  }

  return env;
};
