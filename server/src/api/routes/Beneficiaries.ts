import { Beneficiary } from '../../beneficiaries/Beneficiary.model'
import { writeJson } from '../utils/writer';
import create from '../../beneficiaries/events/create';

export const listBeneficiaries = (req, res, next, status) => {
  const beneficiary: Beneficiary = {
    firstName: "Jason",
    lastName: 'Smith',
    globalId: 'MX0000100001',
    localId: '00001',
    preferredName: 'Jason',
    gender: 'male',
    birthdate: '2018-09-12'
  }
  writeJson(res, [beneficiary]);
}

export const createBeneficiary = (req, res, next, status) => {
  const beneficiary = req.body;
  create(beneficiary);
  writeJson(res, beneficiary);
}


/*

Beneficiary in Draft State (Event: Discovered): Name, DoB
Beneficiary in Active State (Event: Registered): Name, DoB, Gender, Height, Weight, Photo, Registration Date
Beneficiary in Inactive State (Event: Departed): Departure Reason, Departure Date
Beneficiary Health Update (Event: Health Update): Height, Weight
Beneficiary Photo Update (Event: Photo): Current_Photo_Url

*/
