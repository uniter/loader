/*
 * Uniter-Loader - Webpack loader for requiring PHP files from JavaScript
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/uniter/loader/
 *
 * Released under the MIT license
 * https://github.com/uniter/loader/raw/master/MIT-LICENSE.txt
 */

module.exports = {
    preset: 'ts-jest',
    // Add support for Sinon assertions under Jest
    setupFilesAfterEnv: ['jest-sinon'],
    testEnvironment: 'node',
};
