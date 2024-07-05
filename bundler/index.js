import { resolve } from 'path';
import { writeFileSync } from 'fs';
import _reduce from 'lodash/reduce.js';
import _forEach from 'lodash/forEach.js';

import generateAST from './utils/ast.js';
import loadConfig from './utils/configLoader.js';
import NodeIDGenerator from './utils/NodeIDGenerator.js';
import { addLevelWiseParents } from './utils/nodeUtils.js';
import { endsWithAnyExtension } from './utils/fileUtils.js';
import { addFolderNodes, addLevelToNodes } from './processBundle.js';
import { fillDependenciesOfFolders, addAllDependenciesToNodes, cleanseGraphNodes } from './adaptBundle.js';
import { getDependenciesFromAST, replaceDependenciesWithID } from './utils/dependencyUtils.js';


const getDependencies = (filename) => {

    if (!endsWithAnyExtension(filename)) 
    {
        console.error('Filename:', filename, 'does not end with any of the specified extensions.');
        return null;
    }

    const ast = generateAST(filename); 
    const dependencies = getDependenciesFromAST({filename, ast});
    
    return {
        id: NodeIDGenerator.getNextID(),
        isFile: true,
        name: filename,
        dependencies,
        levelWiseParents: [],
        children: []
    };
};

const buildGraph = (entry) => {
    
    const root = getDependencies(entry);

    if (root == null) {
        return null;
    }

    const bundleNodes = [root];
    const nodesToProcess = [root];
    
    const visited = new Set();
    visited.add(root.name);
    
    while (nodesToProcess.length > 0) {
            
        const node = nodesToProcess.pop();
        
        _forEach(node.dependencies, (path) => {
            
            if (!visited.has(path)) {
                
                const child = getDependencies(path);
                bundleNodes.push(child);
                visited.add(path);
                nodesToProcess.push(child);
            }
        });
    }
    
    const nodeToIdMap = _reduce(bundleNodes, (result, node) => {
        
        result[node.name] = node.id;
        return result;

    }, {});

    return { bundleNodes, nodeToIdMap };
};

const preProcessGraph = (graph) => {
    replaceDependenciesWithID(graph);
    addLevelToNodes(graph);
};

const enrichGraph = (graph) => {
    addFolderNodes(graph);
    addLevelWiseParents(graph);
    fillDependenciesOfFolders(graph);
};

const finalizeGraph = (graph) => {
    addAllDependenciesToNodes(graph);
    cleanseGraphNodes(graph);
};

const processGraph = (graph) => {
    preProcessGraph(graph);
    enrichGraph(graph);
    finalizeGraph(graph);
};


const bundlerConfig = loadConfig();
const time = Date.now();

console.log('Building graph...');

const graph = buildGraph(bundlerConfig.entry);

if (graph == null) {
    console.error('Error while building graph.');
    process.exit(1);
}

processGraph(graph);

const { bundleNodes, ...rest } = graph;
const processedGraph = { ...rest };

console.log('Time taken: ', Date.now() - time, 'ms');
console.log('Graph built successfully!')

writeFileSync(resolve(process.cwd(), 'src/assets/dependencyGraph.json'), JSON.stringify(processedGraph, null, 2));
writeFileSync(resolve(process.cwd(), 'node_modules/dependency-graph-visualizer/src/visualizer/dependencyGraph.json'), JSON.stringify(processedGraph, null, 2));
writeFileSync(resolve(process.cwd(), 'node_modules/dependency-graph-visualizer/src/visualizer/bundler.config.json'), JSON.stringify(bundlerConfig, null, 2));