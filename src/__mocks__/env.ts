export const DefaultMaxTokens = 100
export const DefaultModel = 'text-davinci-003'
export const DefaultTemperature = 0.5;

export const getEnv = jest.fn(() => ({
  OPENAI_API_KEY: 'fakeOpenAIAPIKey',
  OPENAI_DEFAULT_MODEL: DefaultModel,
  OPENAI_DEFAULT_TEMPERATURE: DefaultTemperature,
  OPENAI_DEFAULT_MAX_TOKENS: DefaultMaxTokens
}));
