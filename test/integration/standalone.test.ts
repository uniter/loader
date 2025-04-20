/*
 * Uniter-Loader - Webpack loader for requiring PHP files from JavaScript
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/uniter/loader/
 *
 * Released under the MIT license
 * https://github.com/uniter/loader/raw/master/MIT-LICENSE.txt
 */

import loader from '../..';
import { LoaderContext } from 'webpack';
import { normalize } from 'path';
import sinon from 'ts-sinon';

describe('Standalone loader integration', () => {
    let basePath: string;
    let callback: LoaderContext<object>['callback'];
    let loaderContext: LoaderContext<object>;

    beforeEach(() => {
        basePath = normalize(__dirname + '/../..');
        callback = sinon.spy();

        loaderContext = {
            callback,
            resource: '/path/to/my_module.php',
            rootContext: __dirname + '/fixtures', // Use our fixture uniter.config.js
        } as LoaderContext<object>;
    });

    it('should call back with the transformed result for a PHP module', () => {
        loader.call(loaderContext, '<?php print 21;');

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith(
            null,
            `require("${basePath}/node_modules/phpify/api")` +
                `.load("../../../../../../../../path/to/my_module.php", module, ` +
                `require('${basePath}/node_modules/phpruntime')` +
                `.compile(function (core) {` +
                `var createInteger = core.createInteger, print = core.print;` +
                `print(createInteger(21));})` +
                `);;`,
            {
                version: 3,
                sources: ['../../../../../../../../path/to/my_module.php'],
                names: [],
                mappings: '4RAAM,MAAM,iBAAN,E',
                sourcesContent: ['<?php print 21;'],
            },
        );
    });

    it('should call back with the transformed result for the initialiser stub, including any runtime config', () => {
        loaderContext.resource =
            basePath + '/node_modules/phpify/src/php/initialiser_stub.php';

        loader.call(loaderContext, '<?php print 21;');

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith(
            null,
            `module.exports = function (loader) {
    loader.installModules(function (path, checkExistence) {
        var exists = false;

        function handlePath(aPath) {
            if (!checkExistence) {
                return aPath;
            }

            if (aPath === path) {
                exists = true;
            }

            // Return something that should not match with the path variable,
            // so that the case itself is not executed and we eventually
            // reach the return after the end of the switch.
            return null;
        }

        switch (path) {
        case handlePath("fixture_module.php"): return require("./../../../../test/integration/fixtures/fixture_module.php");
        }

        return checkExistence ? exists : null;
    })
    .configure({"stdio":true}, [{"myOption":"my value"}]);
};`,
            null,
        );
    });
});
