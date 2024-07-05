import { existsSync } from 'fs';
import _some from 'lodash/some.js';
import _endsWith from 'lodash/endsWith.js';

import { FILE_EXTENSIONS } from './constants.js';

export const endsWithAnyExtension = (path) => _some(FILE_EXTENSIONS, (extension) => _endsWith(path, extension));

export const checkFileExistsWithGivenExtension = ({ filePath, extension }) => existsSync(filePath + extension);
