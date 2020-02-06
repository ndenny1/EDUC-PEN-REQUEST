import config from '../config/index';
import faker from 'faker';

export const credentials = Object.freeze({
  username: config.get('bceid:user'), 
  password: config.get('bceid:pass')
});

export const fullStudent = Object.freeze({
  legalLastName: faker.name.lastName(),
  legalFirstName: faker.name.firstName(),
  legalMiddleNames: faker.name.firstName(),
  maidenName: faker.name.lastName(),
  usualLastName:faker.name.lastName(),
  usualFirstName: faker.name.firstName(),
  usualMiddleNames: faker.name.firstName(),
  pastNames: null,
  birthdate: faker.date.past(50),
  gender: faker.random.number({max: 3}),
  email: faker.internet.email(),
  lastBCSchool: faker.address.city() + ' Middle School',
  lastBCStudentNumber: String(faker.random.number()),
  currentSchool: faker.address.city() + ' High School'
});
