import register from '../pulsar/register';


const handler = async (argv) => register()

export default {
  command: 'schemas',
  describe: 'Register schemas',
  handler,
}
