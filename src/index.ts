/*
 * Uniter-Loader - Webpack loader for requiring PHP files from JavaScript
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/uniter/loader/
 *
 * Released under the MIT license
 * https://github.com/uniter/loader/raw/master/MIT-LICENSE.txt
 */

import * as webpack from 'webpack';
import LoaderContext = webpack.loader.LoaderContext;
import transformerFactory = require('phpify');

export default function (this: LoaderContext, sourcePHP: string): void {
    let result;

    // The path to the folder webpack.config.js is in
    const rootContext = this.rootContext;
    const sourceModulePath = this.resource;
    const transformer = transformerFactory.create(rootContext);

    // TODO: Fetch effective config path from transformer and add as dependency

    try {
        result = transformer.transform(sourcePHP, sourceModulePath);
    } catch (error) {
        this.callback(error);
        return;
    }

    this.callback(null, result.code, result.map);
}
