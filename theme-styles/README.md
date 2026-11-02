# Selected-theme styles

`page-theme.js` loads only the selected theme's generated CSS bundle. Shared rules remain in their original order within each bundle. Small root/background rules stay in the script to avoid flashing the default palette; prepared theme CSS is cached in session storage when a theme is chosen.

Edit `source.css`, then run from the repository root:

```sh
node theme-styles/build.mjs
```

The build updates all 23 bundles and the generated early-colour block/version in `page-theme.js`. It also uses the compiler in `search-source-cards.js` to include matching search-card styles without reading CSSOM shorthands. Rebuild after changing that compiler or its class/context maps. Keep the generated files and script in the same deployment.

Palette assignment, theme selection and shared interactions remain in `page-theme.js`. The dynamic editor rules remain inline. Moon Clay also retains its existing theme-specific stylesheet.
