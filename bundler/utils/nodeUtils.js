import _join from 'lodash/join.js';
import _split from 'lodash/split.js';
import _slice from 'lodash/slice.js';
import _range from 'lodash/range.js';
import _reduce from 'lodash/reduce.js';
import _forEach from 'lodash/forEach.js';
import _includes from 'lodash/includes.js';
import _startsWith from 'lodash/startsWith.js';

import { MAX_LEVEL, BACKSLASH } from './constants.js';


export const isFileInsideFolder = ({ fileNode, folderNode }) => _startsWith(fileNode.name, folderNode.name + BACKSLASH);


export const getFileAndFolderNodes = (bundleNodes) => _reduce(bundleNodes, (result, node) => {
        
        if (node.isFile) {
            result.fileNodes.push(node);
            return result;
        }

        result.folderNodes.push(node);
        return result;
    
    },{ folderNodes: [], fileNodes: [] });


export const addLevelWiseParents = (graph) => {

    const { bundleNodes, nodeToIdMap } = graph;

    _forEach(bundleNodes, (node) => {

        const currentNode = node.name;
        const currentLevel = node.level;

        // To filter out the nodes that are outside the rootModules
        if (currentLevel === MAX_LEVEL) {
            return;
        }

        _reduce(_range(currentLevel, 0, -1), (acc, level) => {
            
            const currentModule = _join(_slice(_split(acc.currentNode, BACKSLASH), 0, -1), BACKSLASH);
            const currentModuleLevel = level - 1;
        
            node.levelWiseParents.push(nodeToIdMap[currentModule]);
            
            return {
                currentNode: currentModule,
                currentLevel: currentModuleLevel
            };
            
        }, { currentNode, currentLevel });
    });
};


const addDependency = ({ folderNode, dependencyID }) => {

    if (!_includes(folderNode.dependencies, dependencyID) && dependencyID !== folderNode.id)
    {
        folderNode.dependencies.push(dependencyID);
    }
};

export const addDependenciesToFolder = ({ folderNode, fileNode, nodeToLevelMap }) => {

    const { dependencies } = fileNode;

    _forEach(dependencies, (dependencyID) => {

        if (nodeToLevelMap[dependencyID] === MAX_LEVEL) {
            return;
        }

        addDependency({ folderNode, dependencyID });
    });
};