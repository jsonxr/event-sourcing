import { Argv } from 'yargs';
import { execute } from '../db/migrate';

const handler = async (argv) => {
  execute({ bootstrap: argv.bootstrap, drop: argv.drop })
}

export default {
  command: 'migrate',
  describe: 'Migrate database',
  builder: (yargs: Argv) => {
    return yargs
      .option('drop', {
        type: 'boolean',
        dscription: 'First drops the database. This is ignored unless the NODE_ENV is set to development'
      })
      .option('bootstrap', {
        type: 'boolean',
        dscription: 'Bootstraps the database for development'
    })

  },
  handler,
}
