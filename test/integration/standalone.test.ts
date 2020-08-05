/*
 * PHPConfig - Loads Uniter's PHP configuration
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/uniter/phpconfig/
 *
 * Released under the MIT license
 * https://github.com/uniter/phpconfig/raw/master/MIT-LICENSE.txt
 */

import loader from '../..';
import * as webpack from 'webpack';
import LoaderContext = webpack.loader.LoaderContext;
import loaderCallback = webpack.loader.loaderCallback;
import path = require('path');
import sinon from 'ts-sinon';

describe('Standalone loader integration', () => {
    let basePath: string;
    let callback: loaderCallback;
    let loaderContext: LoaderContext;

    beforeEach(() => {
        basePath = path.normalize(__dirname + '/../..');
        callback = sinon.spy();

        loaderContext = {
            callback,
            resource: '/path/to/my_module.php',
            rootContext: __dirname + '/fixtures', // Use our fixture uniter.config.js
        } as LoaderContext;
    });

    it('should call back with the transformed result for a PHP module', () => {
        loader.call(loaderContext, '<?php print 21;');

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith(
            null,
            `require("${basePath}/node_modules/phpify/src/php/initialiser_stub.php");
module.exports = require("${basePath}/node_modules/phpify/api")` +
                `.load("../../../../../../../../path/to/my_module.php", ` +
                `require('${basePath}/node_modules/phpruntime')` +
                `.compile(function (stdin, stdout, stderr, tools, namespace) {` +
                `var namespaceScope = tools.topLevelNamespaceScope, namespaceResult, scope = tools.topLevelScope, currentClass = null;` +
                `(stdout.write(tools.valueFactory.createInteger(21).coerceToString().getNative()), tools.valueFactory.createInteger(1));` +
                `return tools.valueFactory.createNull();}));;`
        );
    });

    it('should call back with the transformed result for the initialiser stub, including any runtime config', () => {
        loaderContext.resource =
            basePath + '/node_modules/phpify/src/php/initialiser_stub.php';

        loader.call(loaderContext, '<?php print 21;');

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith(
            null,
            `require("${basePath}/node_modules/phpify/api").installModules(function (path, checkExistence) {
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
        // reach the return after the end of the switch
        return null;
    }

    switch (path) {
    case handlePath("fixture_module.php"): return require("./../../../../test/integration/fixtures/fixture_module.php");
    }

    return checkExistence ? exists : null;
})
.configure({"stdio":true}, [{"myOption":"my value"}]);`
        );
    });
});
