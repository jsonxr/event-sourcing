import { Argv } from 'yargs';
import env from '../env'
import { server } from '../api/server';


const handler = function (argv) {
  server(argv.port);
}

export default {
  command: 'serve [port]',
  describe: 'Start the server',
  builder: (yargs: Argv) => {
    return yargs.positional('port', {
      describe: 'port to bind on',
      default: env.PORT
    })
  },
  handler,
}
