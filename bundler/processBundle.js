import _join from 'lodash/join.js';
import _split from 'lodash/split.js';
import _slice from 'lodash/slice.js';
import _range from 'lodash/range.js';
import _reduce from 'lodash/reduce.js';
import _forEach from 'lodash/forEach.js';
import _startsWith from 'lodash/startsWith.js';

import loadConfig from './utils/configLoader.js';
import { BACKSLASH, MAX_LEVEL } from './utils/constants.js';
import NodeIDGenerator from './utils/NodeIDGenerator.js';

const { rootModules } = loadConfig();


const addNodeToGraph = ({ currentModule, currentModuleLevel, nearestRootModule, children, bundleNodes, nodeToIdMap, nodeToLevelMap }) => {

    const ID = NodeIDGenerator.getNextID();

    bundleNodes.push({
        id: ID,
        isFile: false,
        name: currentModule,
        dependencies: [],
        level: currentModuleLevel,
        nearestRootModule,
        levelWiseParents: [],
        children
    });

    nodeToIdMap[currentModule] = ID;
    nodeToLevelMap[ID] = currentModuleLevel;
}


const checkAndAddNode = ({ currentModule, currentModuleLevel, nearestRootModule, bundleNodes, nodeToIdMap, nodeToLevelMap }) => {
    if (!nodeToIdMap[currentModule]) {
        addNodeToGraph({
            bundleNodes,
            nodeToIdMap,
            currentModule,
            children: [],
            nodeToLevelMap,
            currentModuleLevel,
            nearestRootModule
        });
    }
};


const addHierarchicalFolderNodes = ({ currentNode, currentLevel, nearestRootModule, bundleNodes, nodeToIdMap, nodeToLevelMap }) => {
    
    _reduce(_range(currentLevel, 0, -1), (acc, level) => {
          
        const currentModule = _join(_slice(_split(acc.currentNode, BACKSLASH), 0, -1), BACKSLASH);
        const currentModuleLevel = level - 1;
    
        checkAndAddNode({ currentModule, currentModuleLevel, nearestRootModule, bundleNodes, nodeToIdMap, nodeToLevelMap });

        if (!bundleNodes[nodeToIdMap[currentModule]].children.includes(nodeToIdMap[acc.currentNode])) {
            bundleNodes[nodeToIdMap[currentModule]].children.push(nodeToIdMap[acc.currentNode]);
        }
        
        return {
            currentNode: currentModule,
            currentLevel: currentModuleLevel
        };
    
    }, { currentNode, currentLevel });
}


export const addFolderNodes = (graph) => {

    const { bundleNodes, nodeToIdMap, nodeToLevelMap } = graph;

    _forEach(bundleNodes, (node) => {
      
        const { name: currentNode, level: currentLevel, nearestRootModule } = node;

        if (currentLevel === MAX_LEVEL) {
            return;
        }

        addHierarchicalFolderNodes({ currentNode, currentLevel, nearestRootModule, bundleNodes, nodeToIdMap, nodeToLevelMap });
    })
};


export const addLevelToNodes = (graph) => {

    const { bundleNodes } = graph;
    
    _forEach(bundleNodes, (node) => {
            
        const { minLevel, nearestRootModule } = _reduce(rootModules, (result, rootModule) => {
        
            if (_startsWith(node.name, rootModule.name)) {
                
                const level = _split(node.name, BACKSLASH).length - _split(rootModule.name, BACKSLASH).length;
                
                if (level < result.minLevel) {
                    return { minLevel: level, nearestRootModule: rootModule.name };
                }
            }
            
            return result;

        }, { minLevel: MAX_LEVEL, nearestRootModule: null });

        node.level = minLevel;
        node.nearestRootModule = nearestRootModule;
    })

    const nodeToLevelMap = _reduce(bundleNodes, (result, node) => {
        
        result[node.id] = node.level;
        return result;
    }, {});

    graph.nodeToLevelMap = nodeToLevelMap;
};