describe('index', () => {
  const askCommand = jest.fn();
  const config = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    jest.mock('dotenv-flow', () => ({ config }));
  });

  describe('when askCommand success', () => {
    beforeEach(async () => {
      jest.mock('../command', () => ({ askCommand }));
      askCommand.mockResolvedValue(undefined);
    });

    it('configures and executes askCommand', async () => {
      await expect(import('../index')).resolves.toBeDefined();

      expect(config).toBeCalledTimes(1);
      expect(askCommand).toBeCalledTimes(1);
    });
  });

  describe('when askCommand failed', () => {
    const error = new Error('Failed to ask');

    beforeEach(async () => {
      jest.spyOn(console, 'log').mockReturnValue(undefined);
      jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      jest.mock('../command', () => ({ askCommand }));
      askCommand.mockRejectedValue(error);
    });

    it('exits with code 1', async () => {
      await expect(import('../index')).resolves.toBeDefined();

      expect(console.log).toBeCalledWith(error.message);
      expect(process.exit).toBeCalledWith(1);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });
  });
});
