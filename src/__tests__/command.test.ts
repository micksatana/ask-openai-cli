import version from '../version';
import answer from '../openai/__mocks__/data/create-completion.json';

jest.spyOn(console, 'log').mockReturnValue(undefined);
const command = {
  name: jest.fn(() => command),
  option: jest.fn(() => command),
  description: jest.fn(() => command),
  version: jest.fn(() => command),
  parse: jest.fn(),
  opts: jest.fn(),
  help: jest.fn(),
  args: []
};
const Command = jest.fn(() => command);
const ask = jest.fn(() => Promise.resolve(answer));

jest.mock('commander', () => ({
  Command
}));
jest.mock('../openai/ask', () => ({ ask }));

describe('getCommand', () => {
  beforeAll(async () => {
    const { getCommand } = await import('../command');
    getCommand();
  });

  it('has model option', () => {
    expect(command.option).toBeCalledWith(
      '-m, --model <string>',
      expect.anything()
    );
  });

  it('has temperature option with a correct parser', () => {
    expect(command.option).toBeCalledWith(
      '-T, --temperature <number>',
      expect.anything(),
      Number.parseFloat
    );
  });

  it('has max-tokens option with a correct parser', () => {
    expect(command.option).toBeCalledWith(
      '-t, --max-tokens <number>',
      expect.anything(),
      Number.parseFloat
    );
  });

  it('has version option', () => {
    expect(command.version).toBeCalledWith(version);
  });

  it('parses', () => {
    expect(command.parse).toBeCalledTimes(1);
  });
});

describe('askCommand', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when init option exists', () => {
    const options = { init: true };

    beforeEach(async () => {
      command.opts.mockReturnValue(options);
      const { askCommand } = await import('../command');
      askCommand();
    });

    it('init with correct options', () => {
      expect(command.help).not.toBeCalled();
    });
  });

  describe('when init option does not exist', () => {
    const options = {};

    beforeEach(async () => {
      command.opts.mockReturnValue(options);
    });

    describe('and command.args exists', () => {
      beforeEach(async () => {
        command.args = ['Are', 'you', 'a', 'robot?'];
      });

      describe('and able to get API response', () => {
        beforeEach(async () => {
          const { askCommand } = await import('../command');
          askCommand();
        });

        it('called with correct args and options', () => {
          expect(ask).toBeCalledWith(command.args.join(' '), options);
          expect(command.help).not.toBeCalled();
        });

        it('log with the text of the first choice', () => {
          expect(console.log).toBeCalledWith(answer.choices[0].text);
          expect(command.help).not.toBeCalled();
        });
      });

      describe('and failed to get response from OpenAI', () => {
        const error = new Error('Failed to get response');
        let askCommand;

        beforeEach(async () => {
          ask.mockRejectedValueOnce(error);
          askCommand = (await import('../command')).askCommand;
        });

        it('throw the error', async () => {
          await expect(askCommand()).rejects.toEqual(error);
        });
      });
    });

    describe('and command.args is empty', () => {
      beforeEach(async () => {
        command.args = [];
        const { askCommand } = await import('../command');
        askCommand();
      });

      it('display help', () => {
        expect(command.help).toBeCalledTimes(1);
      });
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
