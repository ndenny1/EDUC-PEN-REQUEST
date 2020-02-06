import { Selector } from 'testcafe';

export async function bceidLogin(t, credentials){
  await t
    .click(Selector('#zocial-bceid'))  
    .expect(Selector('#password').count).eql(1) //BCeID login page
    .typeText(Selector('#user'), credentials.username) //enter UN
    .typeText(Selector('#password'), credentials.password) //enter PW
    .click(Selector('input[name=\'btnSubmit\']')); //completes login
}

export async function fillRequestForm(t, studentData, submitBool){
  await t
    .wait(5)
    .expect(Selector('#legalLastName').count).eql(1);
  if(studentData.legalLastName){
    await t.typeText(Selector('#legalLastName'),studentData.legalLastName);
  }
  if(studentData.legalFirstName){
    await t.typeText(Selector('#legalFirstName'),studentData.legalFirstName); 
  }
  if(studentData.legalMiddleNames){
    await t.typeText(Selector('#legalMiddleNames'),studentData.legalMiddleNames);
  }
  if(studentData.usualLastName){
    await t.typeText(Selector('#usualLastName'),studentData.usualLastName); //enter usual last name
  }
  if(studentData.usualFirstName){
    await t.typeText(Selector('#usualFirstName'),studentData.usualFirstName);
  }
  if(studentData.usualMiddleNames){
    await t.typeText(Selector('#usualMiddleNames'),studentData.usualMiddleNames); //enter usual last name
  }
  if(studentData.maidenName){
    await t.typeText(Selector('#maidenName'),studentData.maidenName); //enter maiden name, omitted for male student
  }
  if(studentData.pastNames){
    await t.typeText(Selector('#pastNames'),studentData.pastNames); //enter past name
  }
  if(studentData.birthdate){
    console.log(studentData.birthdate);
    const month = studentData.birthdate.getMonth();
    const day = studentData.birthdate.getUTCDate();
    const year = studentData.birthdate.getYear();
    await t
      .click(Selector('#birthdate'))
      .click(Selector('ul').filter('.v-date-picker-years').nth(-1))
      .click(Selector('div.v-date-picker-table').find('.v-btn__content').nth(month - 1))
      .click(Selector('div.v-date-picker-table').find('.v-btn__content').nth(day - 1));
    //.click(Selector('div.v-select__selections'));
    //.click(Selector('div.v-list-item__content').find('.v-list-item__title').nth(-1));
  }
  if(studentData.gender){
    await t
      .click(Selector('div.v-select__selections'))
      .click(Selector('div.v-list-item__content').find('.v-list-item__title').nth(studentData.gender));
  }
  if(studentData.email){
    await t.typeText(Selector('#email'),studentData.email); //enter email
  }
  if(studentData.lastBCSchool){
    await t.typeText(Selector('#lastBCSchool'),studentData.lastBCSchool); //enter last BC school attended
  }
  if(studentData.lastBCStudentNumber){
    await t.typeText(Selector('#lastBCStudentNumber'), studentData.lastBCStudentNumber); //enter student number
  }
  if(studentData.currentSchool){
    await t.typeText(Selector('#currentSchool'),studentData.currentSchool); //enter enter current school, omitted for this test case
  }

  await t.debug();

  if(submitBool === true){
    await t.click(Selector('#submit_form'));
  } else {
    await t.eval(() => location.reload(true));
  }
}
