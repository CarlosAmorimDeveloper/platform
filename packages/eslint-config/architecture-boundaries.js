const OUTER_LAYERS = [
  '**/services/**',
  '**/screens/**',
  '**/hooks/**',
  '**/components/**',
  '**/context/**',
  '**/store/**',
  '**/navigation/**',
];

/**
 * Enforces the domain -> services -> screens/components layering documented
 * in the root CLAUDE.md ("Clean Architecture"): domain depends on nothing
 * app-specific, services is the only place touching external systems, and
 * screens/components/hooks/context/store/navigation compose both. Import
 * direction only flows inward (screens/hooks -> services -> domain), never
 * back out, so this only needs to restrict what domain/ and services/ can
 * import — everything else is already free to import both.
 *
 * @param {string} appSrcDir - path (relative to the consuming eslint.config.mjs) to the app's `src` directory, e.g. "src".
 * @returns {import("eslint").Linter.Config[]}
 */
export function domainServicesBoundaries(appSrcDir) {
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
            ],
          },
        ],
      },
    },
  ];
}
