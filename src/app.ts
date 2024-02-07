import 'dotenv/config';
import axios from 'axios';
import { readFileSync, promises as fsPromises } from 'fs';
import * as core from '@actions/core';

const sourcemap_directory = core.getInput('sourcemap_directory');
const es_kibana_host = core.getInput('es_kibana_host');
const es_api_key = core.getInput('es_api_key');
const service_version = core.getInput('service_version');

async function postSourceMap(sourceMapPath: string) {
  if (sourceMapPath) {
    const bundlePath = sourceMapPath.replace('.map', '');
    if (bundlePath) {
      core.info(`Uploading ${sourceMapPath}`);
      const sourcemapData = readFileSync(`${sourcemap_directory}/${sourceMapPath}`, 'utf8');
      const formData = new FormData(); 
      formData.append('sourcemap', sourcemapData);
      formData.append('service_version', service_version);
      formData.append('service_name', "patient-react");
      formData.append('bundle_filepath', bundlePath);
       await axios.post(`${es_kibana_host}/api/apm/sourcemaps`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'kbn-xsrf': 'true',
          'Authorization': `ApiKey ${es_api_key}`
        },
      })
      .then(() => {
        core.info(`${sourceMapPath} uploaded successfully`);
      })
      .catch(() => {
        core.info(`${sourceMapPath} upload failed`);
      });
    }
  }
      
}

async function loadFiles() {
  core.info('Uploading sourcemaps started.');
  const files = await fsPromises.opendir(sourcemap_directory);
  for await (const file of files) {
    const { name } = file;
    if (file.name.includes('.map')) {
      await postSourceMap(name);
    }
  }

  core.info('Uploading of sourcemaps completed.');
}


loadFiles();