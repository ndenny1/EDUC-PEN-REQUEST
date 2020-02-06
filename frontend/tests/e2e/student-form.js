/* eslint-disable */
//Purpose:
//this script starts at OSPR splash page, navigates to CLP and allows user to log in with Basic BCeID, and takes a screenshot of completed forms
//Screenshots saved to C:\temp\artifacts\screenshots\  with -s path=artifacts/screenshots,fullPage=true,pathPattern=${TEST_INDEX}/${USERAGENT}/${FILE_INDEX}.png NOTE: (that string not required in script if screenshots not taken)

/*
BEFORE RUNNING TESTCAFE COMMAND

Setting Local Env on Powershell:
$env:NODE_ENV="local"

Setting local Env on CMD:
set NODE_ENV=local
*/


//To Run:
//open CMD
//navigate to folder where .js files are stored (EG C:temp with cd .\..\, then cd temp)
//to run type: testcafe chrome sharene_basic_login_test.js --hostname 127.0.0.1 -s path=artifacts/screenshots,fullPage=true,pathPattern=${TEST_INDEX}/${USERAGENT}/${FILE_INDEX}.png

import { Selector } from 'testcafe';
import { bceidLogin, fillRequestForm } from './helpers/helperFunctions';
import { credentials, fullStudent } from './helpers/constants';
//import { enterLoginWithBasicBCeID } from './helper.js';

fixture `Basic BCeID SDF Test`
  .page `https://pen-request-c2mvws-test.pathfinder.gov.bc.ca/`;


test('basic bceid login', async t => {
  await t
    .click(Selector('#login-button'))
    .expect(Selector('#password').count).eql(1); //login type displayed
    
  await bceidLogin(t, credentials);
  await fillRequestForm(t, fullStudent, false);

  await t.takeScreenshot();		
});
