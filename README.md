# EDUC-PEN-REQUEST
This project contains the frontend for PEN requests. 

# Ministry of Education PEN Request
The PEN request application consists of a Vue.js frontend (UI and UX) and a Node.js backend (auth and session management). Currently early in the development process, so the front and backend are currently quite thin (only a single UI page).

## Before deployment
In order to deploy this project into OpenShift, you must create a config-map by running the following command (be sure to replace the values in curly brackets with actual values):
``` sh
oc create -n {YOUR_OPENSHIFT_ENVIRONMENT} configmap pen-request-config \
--from-literal=ISSUER={ISSUER FOR JWT} \
--from-literal=UI_PRIVATE_KEY={KEY_PAIR_VALUE} \
--from-literal=UI_PUBLIC_KEY={KEY_PAIR_VALUE} \
--from-literal=SOAM_PUBLIC_KEY={SOAM PUBLIC KEY} \
--from-literal=SOAM_DISCOVERY={SOAM DISCOVER} \
--from-literal=SOAM_CLIENT_ID={SOAM CLIENT ID} \
--from-literal=SOAM_URL={SOAM BASE URL} \
--from-literal=SOAM_CLIENT_SECRET={SOAM CLIENT SECRET} \
```


## Reusable Templates
This repository contains multiple OpenShift templates that can be used to instantly spin up builds, deployments, and pipelines. These templates can be found in the [templates folder](https://github.com/bcgov/EDUC-PEN-REQUEST/tree/master/tools/templates).

## Documentation

* [Openshift Readme](openshift/README.md)
* [Education PEN Request Wiki](https://github.com/bcgov/EDUC-PEN-REQUEST/wiki)

## Getting Help or Reporting an Issue

To report bugs/issues/features requests, please file an [issue](https://github.com/bcgov/EDUC-PEN-REQUEST/issues).

## License

    Copyright 2019 Province of British Columbia

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
