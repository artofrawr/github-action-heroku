const core = require('@actions/core');
const { promisify } = require('util');

const exec = promisify(require('child_process').exec);

async function loginHeroku() {
  const login = core.getInput('email');
  const password = core.getInput('api_key');

  try {
    await exec(`cat >~/.netrc <<EOF
    machine api.heroku.com
        login ${login}
        password ${password}
    EOF`);
    console.log('.netrc file create ✅');

    await exec(`echo ${password} | docker login --username=${login} registry.heroku.com --password-stdin`);
    console.log('Logged in succefully ✅');
  } catch (error) {
    core.setFailed(`Authentication process faild. Error: ${error.message}`);
  }
}

async function buildPushAndDeploy() {
  const appName = core.getInput('app_name');
  const dockerfilePath = core.getInput('dockerfile');
  const processType = core.getInput('process');

  const pathArr = dockerfilePath.split('/');
  const pathDir = pathArr.length > 1
    ? pathArr.slice(0, -1).join('/')
    : '.'; 
  const pathFile = pathArr[pathArr.length - 1];
  
  try {
    await exec(`(cd ${pathDir}; docker build . --file ${pathFile} --tag registry.heroku.com/${appName}/${processType})`);
    console.log('Image built ✅');

    await exec(`(cd ${pathDir}; docker push registry.heroku.com/${appName}/${processType})`);
    console.log('Container pushed to Heroku Container Registry ✅');

    await exec(`(cd ${pathDir}; heroku container:release ${processType} --app ${appName})`);
    console.log('App Deployed successfully ✅');
  } catch (error) {
    core.setFailed(`Somthing went wrong building your image. Error: ${error.message}`);
  } 
}

try {
  loginHeroku();
  buildPushAndDeploy();
} catch (error) {
  console.log({ message: error.message });
  core.setFailed(error.message);
}
