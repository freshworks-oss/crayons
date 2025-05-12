import { Config } from '@stencil/core';
import { reactOutputTarget } from 'react-output-target';
import { sass } from '@stencil/sass';
import { postcss } from '@stencil/postcss';
import postcssRTLCSS from 'postcss-rtlcss';

import { generateJsonDocs } from './customElementDocGenerator';

const packageName = 'crayons';
export const config: Config = {
  autoprefixCss: true,
  namespace: packageName,
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'docs-readme',
      footer: 'Built with ❤ at Freshworks',
    },
    {
      /*
        Generate the readme.md files within the www directory
        at the root of the repo for Vuepress to generate the
        the website.
      */
      type: 'docs-readme',
      dir: '../../www/core',
      footer: 'Built with ❤ at Freshworks',
    },
    {
      type: 'dist-custom-elements',
      autoDefineCustomElements: true,
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'custom',
      generator: generateJsonDocs,
      name: 'custom-element-docs',
    },
    {
      type: 'www',
      copy: [
        { dest: 'dew/colors.css', src: '../../../styles/dew/colors.css' },
        { dest: 'dew/numbers.css', src: '../../../styles/dew/numbers.css' },
        { dest: 'dew/fonts.css', src: '../../../styles/dew/fonts.css' },
        { dest: 'dew/overrides.css', src: '../../../styles/dew/overrides.css' },
      ],
    },
    {
      type: 'www',
      dir: `../../www/.vuepress/public/scripts/${packageName}/`,
      copy: [
        {
          dest: '../../dew/colors.css',
          src: '../../../styles/dew/colors.css',
        },
        {
          dest: '../../dew/numbers.css',
          src: '../../../styles/dew/numbers.css',
        },
        {
          dest: '../../dew/fonts.css',
          src: '../../../styles/dew/fonts.css',
        },
        {
          dest: '../../dew/overrides.css',
          src: '../../../styles/dew/overrides.css',
        },
      ],
    },
    {
      type: 'docs-json',
      file: 'dist/docs.json',
    },
    // {
    //   type: 'dist-hydrate-script',
    // },
    reactOutputTarget({
      componentCorePackage: `@freshworks/${packageName}`, // name in the package.json should be used
      proxiesFile: './crayons-react/components.ts',

      // lazy load -> code splitting
      // includeDefineCustomElements: true,
      // includePolyfills: true,

      // tree shakable, need to use setassetpath
      customElementsDir: 'dist/components',
      includeImportCustomElements: true,
    }),
  ],
  plugins: [
    sass({
      injectGlobalPaths: ['src/styles/index.scss'],
    }),
    postcss({
      plugins: [
        postcssRTLCSS({
          ltrPrefix: [':host(:not([dir="rtl"]))', ':host([dir="ltr"])'],
          rtlPrefix: ':host([dir="rtl"])',
          processKeyFrames: true,
        }),
      ],
    }),
  ],
  testing: {
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    collectCoverageFrom: [
      '**/*.{ts,tsx}',
      '!**/node_modules/**',
      '!**/dist/**',
      '!**/www/**',
      '!**/loader/**',
      '!**/stencil.config.ts',
      '!**/*.d.ts',
      '!**/src/index.ts',
      '!**/customElementDocGenerator.ts',
    ],
    coverageReporters: ['json', 'lcov', 'text', 'clover', 'text-summary'],
  },
  buildEs5: false,
  extras: {
    appendChildSlotFix: true,
    cssVarsShim: true,
    dynamicImportShim: true,
    initializeNextTick: true,
    safari10: true,
    scriptDataOpts: true,
    shadowDomShim: true,
    cloneNodeFix: true,
    slotChildNodesFix: true,
    experimentalImportInjection: true,
  },
  enableCache: true,

  //globalScript: 'src/global/crayons.ts',
};
