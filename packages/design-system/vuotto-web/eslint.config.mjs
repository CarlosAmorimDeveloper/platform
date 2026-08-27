import { config } from '@repo/eslint-config/react-internal';
import { noCrossGenerationImports } from '@repo/eslint-config/architecture-boundaries';

/** @type {import("eslint").Linter.Config[]} */
export default [...config, ...noCrossGenerationImports('@industry')];
