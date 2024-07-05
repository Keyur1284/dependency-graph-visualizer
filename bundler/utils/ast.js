import { readFileSync } from 'fs';
import { transformSync } from '@babel/core';

import loadConfig from './configLoader.js';


const generateAST = (filename) => {

    const bundlerConfig = loadConfig();
    const fileContents = readFileSync(filename, 'utf-8');

    const { ast } = transformSync(fileContents, {
        filename,
        ast: true,
        configFile: bundlerConfig.babelConfigFile,
    });
   
    return ast;
};

export default generateAST;