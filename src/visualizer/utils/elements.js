import _forEach from 'lodash/forEach';
import _toArray from 'lodash/toArray';

import { CLASS_NAMES, TITLE } from './constants';

export const getTitleText = graphElement => {
  const title = graphElement?.querySelector(TITLE);
  const titleText = title?.textContent?.trim();
  return titleText;
};

export const addHighlight = ({ element, type }) => {
  element?.classList?.add(type);
};

const removeHighlight = ({ element, type }) => {
  element?.classList?.remove(type);
};

export const resetNodesAndEdges = () => {
  const classNamesToRemove = [CLASS_NAMES.CURRENT, CLASS_NAMES.FROM, CLASS_NAMES.TO];

  _forEach(classNamesToRemove, className => {
    _forEach(_toArray(document.getElementsByClassName(className)), element =>
      removeHighlight({ element, type: className }),
    );
  });
};
