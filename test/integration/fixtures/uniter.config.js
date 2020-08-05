/*
 * Uniter-Loader - Webpack loader for requiring PHP files from JavaScript
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/uniter/loader/
 *
 * Released under the MIT license
 * https://github.com/uniter/loader/raw/master/MIT-LICENSE.txt
 */

module.exports = {
    settings: {
        phpcore: {
            // Set an option to ensure it is compiled into the initialiser
            myOption: 'my value',
        },
        phpify: {
            include: ['fixture_module.php'],
        },
    },
};
