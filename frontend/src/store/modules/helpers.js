export async function getData(apiMethod, queryParam) {
  try {
    const response = await apiMethod(queryParam);
    if(response.status !== 200){
      return false;
    }
    console.log(response.data);
    return response.data;
  } catch(e) {
    console.log(`Error while accessing ${apiMethod.name} API - ${e}`);
  }
}
  
export async function postData(apiMethod, _context, info){
  try {
    const response = await apiMethod(info);
    if(response.status !== 200){
      return false;
    }
    return response.data;
  } catch(e) {
    console.log(`Error while accessing ${apiMethod.name} API - ${e}`);
  }
}