#!/usr/bin/env node
import { config } from 'dotenv-flow';
import { askCommand } from './command';

config();
askCommand().catch((error) => {
  console.log(error.message);
  process.exit(1);
});
