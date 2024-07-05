import _find from 'lodash/find';
import _reduce from 'lodash/reduce';
import _includes from 'lodash/includes';
import { useCallback, useState, useEffect } from 'react';

const useFilterNodesToHide = ({ nodes, filteredNodes, hiddenNodes, updateHiddenNodes, updateMenuOpen }) => {
  const getSelectedNodes = useCallback(
    () =>
      _reduce(
        nodes,
        (result, node) => {
          // eslint-disable-next-line no-param-reassign
          result[node.id] = !_includes(hiddenNodes, node);
          return result;
        },
        {},
      ),
    [hiddenNodes, nodes],
  );

  const [selectedNodes, setSelectedNodes] = useState(getSelectedNodes);

  useEffect(() => {
    setSelectedNodes(getSelectedNodes());
  }, [getSelectedNodes]);

  const toggleCheckbox = useCallback(
    id => {
      setSelectedNodes({
        ...selectedNodes,
        [id]: !selectedNodes[id],
      });
    },
    [selectedNodes, setSelectedNodes],
  );

  const handleSubmit = useCallback(() => {
    const unselectedNodes = _reduce(
      selectedNodes,
      (result, value, key) => {
        if (!value) {
          const node = _find(nodes, { id: +key });
          result.push(node);
        }

        return result;
      },
      [],
    );

    updateHiddenNodes(unselectedNodes);
    updateMenuOpen(false);
  }, [selectedNodes, nodes, updateMenuOpen]);

  const handleSelectAll = useCallback(() => {
    const newSelectedNodes = _reduce(
      filteredNodes,
      (result, node) => {
        // eslint-disable-next-line no-param-reassign
        result[node.id] = true;
        return result;
      },
      {},
    );

    setSelectedNodes({
      ...selectedNodes,
      ...newSelectedNodes,
    });
  }, [nodes, setSelectedNodes, selectedNodes, filteredNodes]);

  return {
    toggleCheckbox,
    handleSubmit,
    handleSelectAll,
    selectedNodes,
  };
};

export default useFilterNodesToHide;
