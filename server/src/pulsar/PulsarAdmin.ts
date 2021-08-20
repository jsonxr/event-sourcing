import path from 'path';
import fs from 'fs/promises';
import fetch from 'node-fetch';

export interface PulsarConfig {
  url: string;
  tenant?: string;
  namespace?: string;
}

export const createPulsarAdmin = ({ url, tenant = 'public', namespace = 'default' }: PulsarConfig) => {

  const registerJsonSchema = async (topic: string, filename: string) => {
    const text = await fs.readFile(filename, { encoding: 'utf-8'});
    const json = JSON.parse(text);
    const schema = JSON.stringify(json) // Turn it from human readable into gross compact form

    const body = {
      "type": "JSON",
      schema,
      "properties": {} // the properties associated with the schema
    }

    //curl -v http://localhost:8080/admin/v2/schemas/public/default/users-topic/schema
    const schemaUploadUrl = `${url}/admin/v2/schemas/${tenant}/${namespace}/${topic}/schema`;
    const options = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }

    console.log('==================================')
    try {
      const response = await fetch(schemaUploadUrl, options)
      if (response.ok) {
        console.log(`Registered schema for topic "${topic}"`)
        console.log('\n', json)
      } else {
        console.error(`Failed to registered schema for topic "${topic}"`)
        console.error('\n', json)
      }
    } catch(err) {
      console.error(err);
    }
  }

  return {
    registerJsonSchema,
  }
}
export type PulsarAdmin = ReturnType<typeof createPulsarAdmin>
