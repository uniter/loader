# uniter-loader

[![Build Status](https://github.com/uniter/loader/workflows/CI/badge.svg)](https://github.com/uniter/loader/actions?query=workflow%3ACI)

Webpack loader for requiring PHP files from JavaScript using [Uniter][] via [PHPify][].

Usage
=====

```shell
npm install --save-dev webpack uniter-loader
```

Simple usage (requiring a single PHP module)
--------------------------------------------

Add to `webpack.config.js`:
```javascript
module.exports = {
    context: __dirname,
    entry: './js/src/index',
    module: {
        rules: [
            {
                test: /\.php$/,
                use: 'uniter-loader'
            }
        ]
    },
    output: {
        path: __dirname + '/dist/',
        filename: 'browser.js'
    }
};
```

Define an empty `uniter.config.js`:
```javascript
module.exports = {};
```

Create a PHP module `php/src/MyApp/doubleIt.php`:
```php
<?php

namespace MyApp;

$doubleIt = function ($num) {
    return $num * 2;
};

return $doubleIt; 
```

Call from JS module `js/src/index.js`:
```javascript
var doubleItModule = require('./php/src/MyApp/doubleIt.php')();

doubleItModule.execute().then(function (doubleIt) {
    console.log('Double 4 is ' + doubleIt(4));
});
```

Run Webpack:
```shell
mkdir dist
node_modules/.bin/webpack --devtool=source-map --mode=development --progress
```

Load the bundle on a webpage, `demo.html`:
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">

        <title>Uniter-Loader demo</title>
    </head>
    <body>
        <h1>Uniter-Loader demo</h1>

        <script src="dist/browser.js"></script>
    </body>
</html>
```

and open `demo.html` in a browser.

Complex usage (compiling a Composer app with the Symfony EventDispatcher component)
-----------------------------------------------------------------------------------

> To avoid lots of typing, you can check out the source for this section here: https://github.com/uniter/event-dispatcher-demo

Install the Symfony [`EventDispatcher` component](http://symfony.com/doc/current/components/event_dispatcher.html)
```shell
composer require symfony/event-dispatcher
```

Add to `webpack.config.js`:
```javascript
module.exports = {
    context: __dirname,
    entry: './js/src/index',
    module: {
        rules: [
            {
                test: /\.php$/,
                use: 'uniter-loader'
            }
        ]
    },
    output: {
        path: __dirname + '/dist/',
        filename: 'browser.js'
    }
};
```

Add to `uniter.config.js`:
> Note that unlike the example above, we have specified which PHP files to additionally
transpile along with those that were `require()`'d from JS-land, and include in the compiled bundle for the browser.

```javascript
module.exports = {
    phpify: {
        include: [
            "php/**/*.php",
            "vendor/autoload.php",
            "vendor/composer/**/*.php",
            "vendor/symfony/event-dispatcher/**/*.php"
        ]
    }
};
```

Create a PHP module `php/src/MyApp/dispatchIt.php`:
```php
<?php

namespace MyApp;

use Symfony\Component\EventDispatcher\EventDispatcher;

// Load Composer's autoloader
require_once __DIR__ . '/../../../vendor/autoload.php';

$eventDispatcher = new EventDispatcher();
$eventDispatcher->addListener('my.event', function () {
    print 'Listener called!';
});

$eventDispatcher->dispatch('my.event');
print 'and...';
$eventDispatcher->dispatch('my.event');
```

Call from JS module `js/src/index.js`:
```javascript
var dispatchItModule = require('./php/src/MyApp/dispatchIt.php')();

// Hook stdout and stderr up to the DOM
dispatchItModule.getStdout().on('data', function (data) {
    document.body.insertAdjacentHTML('beforeEnd', data + '<br>');
});
dispatchItModule.getStderr().on('data', function (data) {
    document.body.insertAdjacentHTML('beforeEnd', data + '<br>');
});

dispatchItModule.execute();
```

Run Webpack:
```shell
mkdir dist
node_modules/.bin/webpack --devtool=source-map --mode=development --progress
```

Load the bundle on a webpage, `demo.html`:
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">

        <title>Uniter-Loader demo</title>
    </head>
    <body>
        <h1>Uniter-Loader demo</h1>

        <script src="dist/browser.js"></script>
    </body>
</html>
```

and open `demo.html` in a browser.

You should then see the output on the page from running the PHP code browser-side:

```html
Listener called!
and...
Listener called!
```

Keeping up to date
------------------
- [Follow me on Twitter](https://twitter.com/@asmblah) for updates: [https://twitter.com/@asmblah](https://twitter.com/@asmblah)

[Uniter]: https://github.com/asmblah/uniter
[PHPify]: https://github.com/uniter/phpify
