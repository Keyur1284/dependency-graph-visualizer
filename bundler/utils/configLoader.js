import { resolve } from 'path';
import { readFileSync } from 'fs';

const loadConfig = () => {
    const bundlerConfigPath = resolve(process.cwd(), 'bundler.config.json');
    return JSON.parse(readFileSync(bundlerConfigPath, 'utf-8'));
}

export default loadConfig;