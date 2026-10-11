import { globby } from 'globby';

/** Every .ts file under a folder of src/, as absolute paths. */
const getFilesFrom = (relativePath: string) => globby([`src/${relativePath}/**/*.ts`], { absolute: true });

export const getEventFiles = () => getFilesFrom('events');
export const getCommandFiles = () => getFilesFrom('interactions/commands');
export const getButtonFiles = () => getFilesFrom('interactions/buttons');
export const getModalFiles = () => getFilesFrom('interactions/modals');
export const getSelectFiles = () => getFilesFrom('interactions/selects');
