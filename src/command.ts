import { Command } from 'commander';
import version from './version';
import { ask } from './openai/ask';
import { DefaultMaxTokens, DefaultModel } from './env';

let command: Command;

export interface AskCommandOptions {
  init: boolean;
  model: string;
  maxTokens: number;
  temperature: number;
}

export const getCommand = () => {
  if (!command) {
    command = new Command();
    command
      .name('ask')
      .description('CLI to ask OpenAI')
      .option('-i, --init', 'Setup CLI variables into ~/.ask-openai-cli/.askrc')
      .option(
        '-m, --model <string>',
        `ID of the model to use. Default is ${
          process.env.OPENAI_DEFAULT_MODEL || DefaultModel
        }.`
      )
      .option(
        '-t, --max-tokens <number>',
        `The maximum number of tokens to generate in the completion. The token count of your prompt plus this value cannot exceed the model\'s context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096). Default is ${
          process.env.OPENAI_DEFAULT_MAX_TOKENS || DefaultMaxTokens
        }.`,
        Number.parseFloat
      )
      .option(
        '-T, --temperature <number>',
        'Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer.',
        Number.parseFloat
      )
      .version(version);

    command.parse();
  }

  return command;
};

export const askCommand = async () => {
  const command = getCommand();
  const options = command.opts<AskCommandOptions>();

  if (options.init) {
  } else if (command.args && command.args.length > 0) {
    const data = await ask(command.args.join(' '), options);

    console.log(data.choices[0].text);
  } else {
    command.help();
  }
};
