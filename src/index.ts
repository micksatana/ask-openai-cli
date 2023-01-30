#!/usr/bin/env node
import { config } from 'dotenv-flow';
import { existsSync } from 'fs';
import { dirname } from 'path';
import { askCommand } from './command';
import { HomeEnv } from './init-sync';

if (existsSync(HomeEnv)) {
  config({ path: dirname(HomeEnv) });
} else {
  config();
}

askCommand().catch((error) => {
  console.log(error.message);
  process.exit(1);
});
