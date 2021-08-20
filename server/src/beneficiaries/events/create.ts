import path from 'path'
import { Beneficiary } from '../Beneficiary.model';
import Pulsar from 'pulsar-client'
import {createPulsarAdmin, PulsarAdmin} from '../../pulsar/PulsarAdmin';

const TOPIC = 'beneficiary-create'

// Register the schema for this topic
const admin: PulsarAdmin = createPulsarAdmin({
  url: 'http://localhost:8080',
});
admin.registerJsonSchema(TOPIC, path.resolve(__dirname, '../Beneficiary.schema.json'));

// Create a client
const client = new Pulsar.Client({
  serviceUrl: 'pulsar://localhost:6650',
});

const createBeneficiary = async (beneficary: Beneficiary) => {
  const producer = await client.createProducer({
    topic: 'beneficiary-create',
  });
  const msg = JSON.stringify(beneficary);
  producer.send({
    data: Buffer.from(msg),
    properties: {}
  });
  await producer.flush();
}



// Leaving client stranded because we need an event life cycle to connect the
// client, and to create the producer, and then close the client
// await client.close();

export default createBeneficiary
