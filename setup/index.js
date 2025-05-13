require('dotenv').config();
const fs = require('fs');

const api_key = process.env.API_KEY;
const api_path = process.env.API_PATH;

const filepath = 'tools/api-calls.js';
const filecontent = 
`class ApiCallsClass {
  #api_key = '${api_key}';
  #api_path = '${api_path}';

  get key(){
    return this.#api_key;
  }

  get path(){
    return this.#api_path;
  }
}
`;

fs.writeFile(filepath, filecontent, handleError);

function handleError(error) {
  if (error) {
    console.log('Writing error:', error);
  } else {
    console.log('File created or overwritten successfully');
  }
}
