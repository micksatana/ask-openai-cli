import { Command } from 'commander';
import version from './version';
import { ask } from './openai/ask';
import { DefaultMaxTokens, DefaultModel, DefaultTemperature } from './env';
import {
  HomeEnv,
  initSync,
  MaxTokensDescription,
  ModelDescription,
  TemperatureDescription
} from './init-sync';
import { NotEnoughMaxTokens } from './errors';

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
      .option('-i, --init', `Setup CLI variables and save into ${HomeEnv}`)
      .option(
        '-m, --model <string>',
        `${ModelDescription} Default is ${
          process.env.OPENAI_DEFAULT_MODEL || DefaultModel
        }.`
      )
      .option(
        '-t, --max-tokens <number>',
        `${MaxTokensDescription} Default is ${
          process.env.OPENAI_DEFAULT_MAX_TOKENS || DefaultMaxTokens
        }.`,
        Number.parseFloat
      )
      .option(
        '-T, --temperature <number>',
        `${TemperatureDescription} Default is ${
          process.env.OPENAI_DEFAULT_TEMPERATURE || DefaultTemperature
        }.`,
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
    initSync();
  } else if (command.args && command.args.length > 0) {
    const data = await ask(command.args.join(' '), options);

    console.log(data.choices[0].text);

    if (data.choices[0].finish_reason === 'length') {
      console.log(`\n\n${NotEnoughMaxTokens}`);
    }
  } else {
    command.help();
  }
};
