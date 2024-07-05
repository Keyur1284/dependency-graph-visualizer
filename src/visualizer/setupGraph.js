import { digraph } from 'ts-graphviz';

const setupGraph = () => {
  const graph = digraph('Graph', {
    ordering: 'out',
    rankdir: 'UD',
    splines: 'ortho',
    overlap: false,
    nodesep: 2,
    ranksep: 1,
    fontname: 'Proxima Nova',
    fontsize: 24,
    style: 'rounded,bold,filled',
  });

  graph.attributes.graph.apply({
    fillcolor: '#ffffff',
    pad: 3,
    penwidth: 2,
  });

  graph.attributes.node.apply({
    shape: 'polygon',
    style: 'rounded, filled',
    color: 'black',
    fillcolor: '#ffffff',
    penwidth: 2,
    margin: 0.5,
    fontcolor: 'black',
    fontname: 'Proxima Nova',
    fontsize: 18,
  });

  graph.attributes.edge.apply({
    arrowhead: 'normal',
    arrowsize: 0.8,
    penwidth: 1,
    color: '#000000',
    minlen: 2,
  });

  return graph;
};

export default setupGraph;
