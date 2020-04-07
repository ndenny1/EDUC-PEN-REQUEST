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
import BceidLoginPage from './pageObjects/BceidLoginPage';
import PenRequestForm from './pageObjects/PenRequestForm';
import { credentials, fullStudent, BceidLoginUrl } from './helpers/constants';


const penRequestForm = new PenRequestForm()
const bceidLoginPage = new BceidLoginPage()

fixture`Bceid Login and Fill Pen request form`
  .page(BceidLoginUrl)
  .beforeEach(async t =>{
    await t.maximizeWindow()
  })

test('basic bceid login', async t => {
 
  await bceidLoginPage.bceidLogin(t, credentials);

  await penRequestForm.fillRequestForm(t, fullStudent, false);

  await t.takeScreenshot();
});
