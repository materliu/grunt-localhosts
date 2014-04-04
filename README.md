# grunt-localhosts v0.0.1 [![NPM Version](http://img.shields.io/npm/v/hostile.svg)](https://npmjs.org/package/hostile) [![NPM](http://img.shields.io/npm/dm/hostile.svg)](https://npmjs.org/package/hostile)

> Change your local machine hosts.



## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-localhosts --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-localhosts');
```




## change localhosts task
_Run this task with the `grunt localhosts` command._

This task was designed to be used in conjunction with another task `grunt server` which open local server binds on localhosts 127.0.0.1, but if your page requests some cgi server for example `cgi.qun.qq.com`, the Same-Origin Policy will not allow you do this by localhosts. At the time you can change your local hosts file `127.0.0.1 qun.qq.com`, then you can access the cgi server by CORS just simply open you local pages at "qun.qq.com/index.html", by the way, change the `grunt connect` open page url "qun.qq.com" not localhost !
### Options

#### rules
Type: `Array`
Default: `no default`

just statement which localhost you want to set or remove !

```js
rules: [{
    ip: '127.0.0.1',
    hostname: 'qun.qq.com',
    type: 'set'
}]
```



[project index]: localhosts.js
[project unit tests]: test/*

### Usage examples

#### Basic Use
In this example, `grunt localhosts` (or more verbosely, `grunt localhosts:set`) will change your localhosts as you wish, obviously you can use 'grunt localhosts:remove' too.

```javascript
// Project configuration.
grunt.initConfig({
    localhosts: {
        set : {
            options: {
                rules: [{
                    ip: '127.0.0.1',
                    hostname: 'qun.qq.com',
                    type: 'set'
                }]
            }
        },
        remove : {
            options: {
                rules: [{
                    ip: '127.0.0.1',
                    hostname: 'qun.qq.com',
                    type: 'remove'
                }]
            }
        }
    },
});


grunt.registerTask('serve', function (target) {
    grunt.task.run([
        'concurrent:server',
        "localhosts:set",
        'connect:livereload',
        'open:server',
        'watch'
    ]);
});

grunt.registerTask('build', [
        'localhosts:remove',    // clear previously set localhosts
        '.......'    // content removed for brevity
]);
```

## Release History

 * 2012-04-04   v0.0.1   Work in progress, not yet officially released.

---

Task submitted by [materliu](http://materliu.github.com)

*This file was generated on Fri Apr 4 2014 22:38:50.*

