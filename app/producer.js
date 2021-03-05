const Pulsar = require('pulsar-client');
const constants = require('./constants')
const { TOPIC } = constants;

const produce = async client => {
  // Create a producer
  const producer = await client.createProducer({
    topic: TOPIC,
  });

  // Send messages
  for (let i = 0; i < 2; i += 1) {
    const msg = JSON.stringify({
      id: i,
      username: `username-${i}-${new Date()}`
    })
    producer.send({
      data: Buffer.from(msg),
      properties: {
        "EVENT": "UPDATE"
      }
    });
    console.log(`Sent message: ${msg}`);
  }
  await producer.flush();
  await producer.close();
};

(async () => {
  // Create a client
  const client = new Pulsar.Client({
    serviceUrl: 'pulsar://localhost:6650',
  });
  await produce(client);
  await client.close();
})();
