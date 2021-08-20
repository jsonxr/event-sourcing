import { Argv } from 'yargs';
import fs from 'fs/promises';
import path from 'path';
import { createPulsarAdmin, PulsarAdmin } from './PulsarAdmin';

const register = () => {
  const admin: PulsarAdmin = createPulsarAdmin({
    url: 'http://localhost:8080'
  });
  //admin.registerJsonSchema('users-topic1', path.resolve(__dirname, '../beneficiaries/User.schema.json'));
  admin.registerJsonSchema('beneficiaries', path.resolve(__dirname, '../beneficiaries/Beneficiary.schema.json'));
}
export default register;
