/*
 * Uniter-Loader - Webpack loader for requiring PHP files from JavaScript
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/uniter/loader/
 *
 * Released under the MIT license
 * https://github.com/uniter/loader/raw/master/MIT-LICENSE.txt
 */

import buildbeltConfig from 'buildbelt/eslint.config.mjs';

export default [
    ...buildbeltConfig.map((config) =>
        Object.assign(config, {
            files: [
                '{src,test}/**/*.{js,jsx,mjs,mts,ts,tsx}',
                '*.{js,jsx,mjs,mts,ts,tsx}',
            ],
        }),
    ),
    {
        files: ['test/**/*.{js,jsx,mjs,mts,ts,tsx}'],
        rules: {
            // Allow assertion chains such as `.to.be.null`.
            '@typescript-eslint/no-unused-expressions': 'off',
        },
    },
];
