import _reduce from 'lodash/reduce.js';
import _forEach from 'lodash/forEach.js';
import _startsWith from 'lodash/startsWith.js';


import { MAX_LEVEL } from './utils/constants.js';
import { isFileInsideFolder, getFileAndFolderNodes, addDependenciesToFolder } from './utils/nodeUtils.js';

export const fillDependenciesOfFolders = (graph) => {
    
    const { bundleNodes, nodeToLevelMap } = graph;
    const { folderNodes, fileNodes } = getFileAndFolderNodes(bundleNodes);

    _forEach(folderNodes, (folderNode) => {
       
        _forEach(fileNodes, (fileNode) => {
            
            if (isFileInsideFolder({ fileNode, folderNode })) {
                
                addDependenciesToFolder({ folderNode, fileNode, nodeToLevelMap });
            }
        });
    });
};

const addLevelWiseParentsToDependencies = ({ node, dependencyNode, dependenciesSet }) => {
    
    _forEach(dependencyNode.levelWiseParents, (parentID) => {

        if (parentID === node.id) {
            return;
        }

        dependenciesSet.add(parentID);
    });
};

export const addAllDependenciesToNodes = (graph) => {
    
    const { bundleNodes } = graph;

    _forEach(bundleNodes, (node) => {
        
        const dependenciesSet = new Set();

        _forEach(node.dependencies, (dependencyID) => {
            dependenciesSet.add(dependencyID);
            const dependencyNode = bundleNodes[dependencyID];
            addLevelWiseParentsToDependencies({ node, dependencyNode, dependenciesSet });
        })

        node.allDependencies = [...dependenciesSet];
    });
};

const cleanNodeToLevelMap = (nodeToLevelMap) => {
        
    _forEach(nodeToLevelMap, (level, nodeID) => {
        
        if (level === MAX_LEVEL) {
            delete nodeToLevelMap[nodeID];
        }
    });
}

const cleanNodeToIdMap = ({ nodeToIdMap, nodes }) => {

    _forEach(nodeToIdMap, (nodeID, name) => {
        
        if (nodes[nodeID] == null) {
            delete nodeToIdMap[name];
        }
    });
}

const filterDeletedNodes = ({ nodeIDs, nodes }) => _reduce(nodeIDs, (result, nodeID) => {
        
        if (nodes[nodeID] == null) {
            return result;
        }

        result.push(nodeID);
        return result;
    }, []);

const getObjectOfNodes = (bundleNodes) =>  _reduce(bundleNodes, (result, node) => {

        if (node.level === MAX_LEVEL)
            return result;

        result[node.id] = node;
        return result;
    }, {});

export const cleanseGraphNodes = (graph) => {
        
    const { bundleNodes, nodeToLevelMap, nodeToIdMap } = graph;

    const nodes = getObjectOfNodes(bundleNodes);

    _forEach(nodes, (node) => {
        node.dependencies = filterDeletedNodes({ nodeIDs: node.dependencies, nodes });
        node.levelWiseParents = filterDeletedNodes({ nodeIDs: node.levelWiseParents, nodes });
        node.allDependencies = filterDeletedNodes({ nodeIDs: node.allDependencies, nodes });
    });

    cleanNodeToLevelMap(nodeToLevelMap);
    cleanNodeToIdMap({ nodeToIdMap, nodes });
    graph.nodes = nodes;
}