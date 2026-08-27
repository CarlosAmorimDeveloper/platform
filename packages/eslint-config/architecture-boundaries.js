const OUTER_LAYERS = [
  '**/services/**',
  '**/screens/**',
  '**/hooks/**',
  '**/components/**',
  '**/context/**',
  '**/store/**',
  '**/navigation/**',
];

function crossGenerationPattern(forbiddenScope) {
  return {
    group: [`${forbiddenScope}/*`],
    message: `Do not import from ${forbiddenScope}/* — it's a separate design-system generation. Depend on your own generation's package instead.`,
  };
}

/**
 * Enforces the domain -> services -> screens/components layering documented
 * in the root CLAUDE.md ("Clean Architecture"): domain depends on nothing
 * app-specific, services is the only place touching external systems, and
 * screens/components/hooks/context/store/navigation compose both. Import
 * direction only flows inward (screens/hooks -> services -> domain), never
 * back out, so this only needs to restrict what domain/ and services/ can
 * import — everything else is already free to import both.
 *
 * IMPORTANT: this also folds in the cross-generation restriction (see
 * `noCrossGenerationImports` below) for domain/services files specifically,
 * rather than relying on a separate config block for it — ESLint flat
 * config doesn't merge `no-restricted-imports` patterns across config
 * objects that match the same file, the last one wins outright. Passing
 * `forbiddenGenerationScope` here (and NOT also matching these same files
 * with a bare `noCrossGenerationImports(...)` block) is what keeps both
 * restrictions actually active for domain/ and services/ files.
 *
 * @param {string} appSrcDir - path (relative to the consuming eslint.config.mjs) to the app's `src` directory, e.g. "src".
 * @param {string} [forbiddenGenerationScope] - npm scope to also forbid importing, e.g. "@industry".
 * @returns {import("eslint").Linter.Config[]}
 */
export function domainServicesBoundaries(appSrcDir, forbiddenGenerationScope) {
  const extraPatterns = forbiddenGenerationScope
    ? [crossGenerationPattern(forbiddenGenerationScope)]
    : [];

  return [
    {
      files: [`${appSrcDir}/domain/**/*.{ts,tsx}`],
      rules: {
        'no-restricted-imports': [
          'warn',
          {
            patterns: [
              {
                group: OUTER_LAYERS,
                message:
                  'domain/ must not import from services/, screens/, hooks/, components/, context/, store/, or navigation/ — it should be testable with zero mocks (see CLAUDE.md "Clean Architecture").',
              },
              ...extraPatterns,
            ],
          },
        ],
      },
    },
    {
      files: [`${appSrcDir}/services/**/*.{ts,tsx}`],
      rules: {
        'no-restricted-imports': [
          'warn',
          {
            patterns: [
              {
                group: OUTER_LAYERS.filter((p) => p !== '**/services/**'),
                message:
                  'services/ must not import from screens/, hooks/, components/, context/, store/, or navigation/ — data access belongs here, composition/presentation does not (see CLAUDE.md "Clean Architecture").',
              },
              ...extraPatterns,
            ],
          },
        ],
      },
    },
  ];
}

/**
 * Prevents importing from a sibling design-system generation (e.g. blocks
 * `@industry/*` imports inside `@vuotto/*` packages, and vice versa) so the
 * two generations stay independently swappable and never silently depend on
 * each other's internals while both are actively developed in parallel.
 *
 * Do not also apply `domainServicesBoundaries(dir, scope)` and this
 * function unscoped to the same files — see the note on
 * `domainServicesBoundaries` above about why that silently drops one of
 * the two restrictions instead of merging them.
 *
 * @param {string} forbiddenScope - the npm scope to forbid, e.g. "@industry" when applied to a @vuotto/* package.
 * @returns {import("eslint").Linter.Config[]}
 */
export function noCrossGenerationImports(forbiddenScope) {
  return [
    {
      rules: {
        'no-restricted-imports': ['warn', { patterns: [crossGenerationPattern(forbiddenScope)] }],
      },
    },
  ];
}
