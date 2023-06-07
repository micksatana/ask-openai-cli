declare global {
  interface RawAskEnv {
    OPENAI_API_KEY: string;
    OPENAI_DEFAULT_MODEL: string;
    OPENAI_DEFAULT_TEMPERATURE: string;
    OPENAI_DEFAULT_MAX_TOKENS: string;
    OPENAI_ORG_ID: string;
  }
  interface AskEnv {
    OPENAI_API_KEY: string;
    OPENAI_DEFAULT_MODEL: string;
    OPENAI_DEFAULT_TEMPERATURE: number;
    OPENAI_DEFAULT_MAX_TOKENS: number;
    OPENAI_ORG_ID: string;
  }
  namespace NodeJS {
    interface ProcessEnv extends RawAskEnv {
      npm_package_version: string;
    }
  }
}

export {};
