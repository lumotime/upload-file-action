const core = require('@actions/core');
const uploadFile = require('./uploadFile');

async function main() {
  try {
    // inputs from action
    const url = "https://www.pgyer.com/apiv2/app/upload";
    const forms = core.getInput('forms');
    const formsMap = jsonToMap(forms);
    const fileForms = core.getInput('fileForms');
    const fileFormsMap = jsonToMap(fileForms);

    console.log(forms);
    console.log(fileForms);

    // http request to external API
    const response = await uploadFile(url, formsMap, fileFormsMap);

    const statusCode = response.status;
    const respBody = response.data;

    if (statusCode >= 400) {
      core.setFailed(`HTTP request failed with status code: ${statusCode}`);
    } else {
      core.setOutput("uploadUrl", url);
      core.setOutput("respCode", respBody.core);
      core.setOutput("respMessage", respBody.message);
      core.setOutput("filename", respBody.data.buildFileKey);
      core.setOutput("fileSize", respBody.data.buildFileKey);
      core.setOutput("applicationId", respBody.data.buildIdentifier);
      core.setOutput("updatedTime", respBody.data.buildUpdated);
      core.setOutput("invitationQRCode", respBody.data.buildQRCodeURL);
    }
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
}


function objToStrMap(obj){
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k,obj[k]);
  }
  return strMap;
}
/**
 *json转换为map
 */
function jsonToMap(jsonStr){
  return objToStrMap(JSON.parse(jsonStr));
}


main();
