const Pulsar = require('pulsar-client');
const constants = require('./constants')
const { TOPIC, SUBSCRIPTION } = constants;

const consume = async client => {
  console.log('CREATE CONSUMER');
  const consumer = await client.subscribe({
    topic: TOPIC,
    subscription: SUBSCRIPTION,
  });

  console.log('RECEIVE');

  try {
    while (true) {
      const msg = await consumer.receive();
      console.log('\n\ndata: ', msg.getData().toString(), '\n\n');
      consumer.acknowledge(msg);
    }
  } catch(err) {
    // TODO: Need to trap ctrl-c (SIGHUP, or SIGTERM, or SIGKILL)
    // This code doesn't get executed
    console.log('CLOSE CONSUMER');
    await consumer.close();
  }

};

(async () => {
  // Create a client
  const client = new Pulsar.Client({
    serviceUrl: 'pulsar://localhost:6650',
  });
  await consume(client);
  await client.close();
})();
