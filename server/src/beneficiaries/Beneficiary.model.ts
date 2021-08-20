export type Gender = 'male' | 'female' | 'unknown'

export interface Beneficiary {
  globalId: string
  localId: string
  firstName: string
  lastName: string
  preferredName: string
  gender: 'male' | 'female' | 'unknown'
  birthdate: string
}

export const SCHEMA = {
  "type": "record",
  "name": "Beneficiary",
  "fields": [
    {"name": "globalId", "type":"string"},
    {"name": "localId", "type":"string"},
    {"name": "firstName", "type":"string"},
    {"name": "lastName", "type":"string"},
    {"name": "preferredName", "type":"string"},
    {"name": "gender", "type":"string"},
    {"name": "birthdate", "type":"string"}
  ]
}

export const jsonToBeneficiary = (json: string): Beneficiary => {
  const result = JSON.parse(json);
  return result as Beneficiary;
}
