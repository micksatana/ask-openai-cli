import { DefaultMaxTokens, DefaultModel, DefaultTemperature } from '../env';

const EOL = '\n';
const fakeHomeDir = '/home/tester';
const homedir = () => fakeHomeDir;

jest.mock('fs', () => ({ existsSync: () => false }));
jest.mock('os', () => ({ homedir, EOL }));
jest.spyOn(console, 'log').mockReturnValue();

describe('initSync', () => {
  const mkdirSync = jest.fn();
  const writeFileSync = jest.fn();
  const prompt = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock('fs', () => ({ mkdirSync, writeFileSync }));
    jest.mock('prompt-sync', () => () => prompt);
  });

  describe('when user inputs all', () => {
    const orgId = 'testUserInputOrgId';
    const apiKey = 'testUserInputApiKey';
    const model = 'testUserInputModel';
    const maxTokens = '99';
    const temperature = '0.99';
    let initSync;

    beforeEach(async () => {
      prompt
        .mockReturnValueOnce(orgId)
        .mockReturnValueOnce(apiKey)
        .mockReturnValueOnce(model)
        .mockReturnValueOnce(maxTokens)
        .mockReturnValueOnce(temperature);
      initSync = (await import('../init-sync')).initSync;
      initSync();
    });

    it('get user inputs', () => {
      expect(prompt).toHaveBeenNthCalledWith(1, 'OpenAI Organization ID: ', {
        echo: '*'
      });
      expect(prompt).toHaveBeenNthCalledWith(2, 'OpenAI API Key: ', {
        echo: '*'
      });
      expect(prompt).toHaveBeenNthCalledWith(3, 'Model ID: ');
      expect(prompt).toHaveBeenNthCalledWith(4, 'Max Tokens: ');
    });

    it('generate .env file', () => {
      expect(mkdirSync).toBeCalledWith(`${fakeHomeDir}/.ask-openai-cli`, {
        recursive: true
      });
      expect(writeFileSync).toBeCalledWith(
        `${fakeHomeDir}/.ask-openai-cli/.env`,
        [
          `OPENAI_API_KEY=${apiKey}`,
          `OPENAI_DEFAULT_MODEL=${model}`,
          `OPENAI_DEFAULT_TEMPERATURE=${temperature}`,
          `OPENAI_DEFAULT_MAX_TOKENS=${maxTokens}`,
          `OPENAI_ORG_ID=${orgId}`
        ].join(EOL)
      );
    });
  });

  describe('when user inputs empty', () => {
    let initSync;

    beforeEach(async () => {
      prompt
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');
      initSync = (await import('../init-sync')).initSync;
      initSync();
    });

    it('generate .env file with default values', () => {
      expect(writeFileSync).toBeCalledWith(
        `${fakeHomeDir}/.ask-openai-cli/.env`,
        [
          `OPENAI_API_KEY=`,
          `OPENAI_DEFAULT_MODEL=${DefaultModel}`,
          `OPENAI_DEFAULT_TEMPERATURE=${DefaultTemperature}`,
          `OPENAI_DEFAULT_MAX_TOKENS=${DefaultMaxTokens}`,
          `OPENAI_ORG_ID=`
        ].join(EOL)
      );
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
