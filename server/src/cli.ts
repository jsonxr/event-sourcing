// This must be the first line
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') })

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'
import serve from './commands/serve';
import migrate from './commands/migrate';
import schemas from './commands/schemas';
import { display } from './env'

yargs(hideBin(process.argv))
  .command(schemas)
  .command(serve)
  .command(migrate).argv


//console.log('argv')
