import _filter from 'lodash/filter';
import { instance } from '@viz-js/viz';
import _includes from 'lodash/includes';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import './App.css';
import useZoom from './hooks/useZoom';
import NavBar from './components/NavBar';
import GraphMenu from './components/GraphMenu';
import ZoomSwitcher from './components/ZoomSwitcher';
import initializeEventHandlers from './visualizer/event';
import generateDotSchema from './visualizer/generateDotSchema';
import useLevelGraphVisualization from './hooks/useLevelGraphVisualization';

// eslint-disable-next-line prefer-arrow-callback
const App = memo(function App() {
  const vizInstance = useMemo(() => instance(), []);
  const [currentInteractionIndex, setCurrentInteractionIndex] = useState(0);
  const [nodesHistory, setNodesHistory] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [hiddenNodes, setHiddenNodes] = useState([]);
  const { zoom, handleZoomIn, handleZoomOut, handleReset } = useZoom();
  const { visualizeLevelGraph } = useLevelGraphVisualization({
    nodesHistory,
    updateNodes: setNodes,
    updateHiddenNodes: setHiddenNodes,
    updateNodesHistory: setNodesHistory,
    updateCurrentInteractionIndex: setCurrentInteractionIndex,
  });

  const appendGraphToDOM = useCallback(
    dotSchema => {
      vizInstance.then(viz => {
        const svg = viz.renderSVGElement(dotSchema);
        const graphElement = document.getElementById('graph');
        graphElement.innerHTML = '';
        graphElement.appendChild(svg);
        initializeEventHandlers({
          nodes,
          nodesHistory,
          updateNodes: setNodes,
          updateNodesHistory: setNodesHistory,
          updateCurrentInteractionIndex: setCurrentInteractionIndex,
        });
      });
    },
    [vizInstance, nodes, nodesHistory, setNodes, setNodesHistory, setCurrentInteractionIndex],
  );

  useEffect(() => {
    visualizeLevelGraph(0);
    return () => {
      setNodes([]);
      setHiddenNodes([]);
      setNodesHistory([]);
      setCurrentInteractionIndex(0);
    };
  }, []);

  useEffect(() => {
    const filteredNodes = _filter(nodes, node => !_includes(hiddenNodes, node));
    const dotSchema = generateDotSchema(filteredNodes);
    appendGraphToDOM(dotSchema);
  }, [nodes, hiddenNodes, appendGraphToDOM]);

  return (
    <div className="App">
      <NavBar
        updateNodes={setNodes}
        nodesHistory={nodesHistory}
        visualizeLevelGraph={visualizeLevelGraph}
        currentInteractionIndex={currentInteractionIndex}
        updateCurrentInteractionIndex={setCurrentInteractionIndex}
      />
      <div id="graph" style={{ height: `${zoom}%`, width: `${zoom}%` }} />
      <div className="interaction-message">{nodesHistory[currentInteractionIndex]?.message}</div>
      <GraphMenu
        key={currentInteractionIndex}
        nodes={nodes}
        hiddenNodes={hiddenNodes}
        updateHiddenNodes={setHiddenNodes}
      />
      <ZoomSwitcher handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} handleReset={handleReset} />
    </div>
  );
});

export default App;
