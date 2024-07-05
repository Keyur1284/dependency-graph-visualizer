import { existsSync } from 'fs';
import { join, dirname } from 'path';
import _reduce from 'lodash/reduce.js';
import _toArray from 'lodash/toArray.js';
import _forEach from 'lodash/forEach.js';
import _traverse from '@babel/traverse';

import { FILE_EXTENSIONS } from './constants.js';
import { endsWithAnyExtension, checkFileExistsWithGivenExtension } from './fileUtils.js';


const traverse = _traverse.default;


const findFilesWithExtension = ({absolutePath, result}) => {

    _forEach(FILE_EXTENSIONS, (extension) => {
                
        if (checkFileExistsWithGivenExtension({filePath: absolutePath, extension})) {
            result.push(absolutePath + extension);
            return;
        }

        if (checkFileExistsWithGivenExtension({filePath: absolutePath + '/index', extension})) {
            result.push(absolutePath + '/index' + extension);
        }
    });
};


const getFilteredDependencies = ({filename, dependencies}) => {

    const filteredDependencies = _reduce(dependencies, (result, dependency) => {
            
        const absolutePath = join(dirname(filename), dependency);

        if (endsWithAnyExtension(absolutePath)) {

            if (existsSync(absolutePath)) {
                result.push(absolutePath);
                return result;
            }
        }

        findFilesWithExtension({absolutePath, result});
        
        return result;

    }, []);

    return filteredDependencies;
}


export const getDependenciesFromAST = ({filename, ast}) => {

    const dependenciesSet = new Set();
    
    traverse(ast, {
        
        ImportDeclaration({node}) {
            
            dependenciesSet.add(node?.source?.value);
        },
        
        CallExpression({node}) {
            
            if (node?.callee?.name === 'require' || node?.callee?.type === 'Import') {
                dependenciesSet.add(node?.arguments[0]?.value);
            }
        }
    });

    const dependencies = _toArray(dependenciesSet);
    
    return getFilteredDependencies({filename, dependencies});
};


export const replaceDependenciesWithID = (graph) => {

    const { bundleNodes, nodeToIdMap } = graph;

    _forEach(bundleNodes, (node) => {

        node.dependencies = _reduce(node.dependencies, (result, dependency) => {

            result.push(nodeToIdMap[dependency]);
            return result;
        }, []);
    })
};