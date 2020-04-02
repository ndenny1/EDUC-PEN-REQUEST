// eslint-disable-next-line
let StaticConfig = {
    VUE_APP_BCEID_REG_URL: 'https://www.test.bceid.ca/os/?7081&SkipTo=Basic#action',
    VUE_APP_JOURNEY_BUILDER: 'https://www2.qa.gov.bc.ca/gov/content/education-training/k-12/support/pen',
};
if(typeof config !== undefined){
    StaticConfig = config
}
export default StaticConfig;
