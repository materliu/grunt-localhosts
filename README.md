# grunt-localhosts v0.0.9 [![NPM Version](http://img.shields.io/npm/v/hostile.svg)](https://npmjs.org/package/grunt-localhosts) [![NPM](http://img.shields.io/npm/dm/hostile.svg)](https://npmjs.org/package/grunt-localhosts)

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

This task was designed to be used in conjunction with another task `grunt server` which open local server binds on localhosts 127.0.0.1, but if your page requests some cgi server for example `cgi.qun.qq.com`, the Same-Origin Policy will not allow you do this by localhosts. At the time you can change your local hosts file `127.0.0.1 qun.qq.com`, then you can access the cgi server by CORS just simply open you local pages at "qun.qq.com/index.html", by the way, change the `grunt connect` open page to url "qun.qq.com" not localhost !
### Options

#### rules
Type: `Array`
Default: `empty array'

just statement which localhost you want to set or remove !

```js
rules: [{
    ip: '127.0.0.1',    // point domain "A" to address "B"
    hostname: 'qun.qq.com',
    type: 'set'
}]
rules: [{
    domain: 'baidu.com',    // point domain "A" to domain "B"
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
                }, {
                    ip: '127.0.0.1',
                    hostname: 'find.qq.com',
                    type: 'set'
                }, {
                    domain: 'baidu.com',    // point domain "A" to domain "B"
                    hostname: 'find.qq.com',
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
 * 2016-01-27   v0.0.9   Add dns lookup support. thx @Filip Spiridonov
 * 2014-10-24   v0.0.8   Add multiple rules support. thx @NameFILIP
 * 2012-04-10   v0.0.7   Add manufacturer info.
 * 2012-04-09   v0.0.5   Bug fix.
 * 2012-04-08   v0.0.3   Officially released.
 * 2012-04-08   v0.0.2   Work in progress, not yet officially released, just add some necessary node_modules !
 * 2012-04-04   v0.0.1   Work in progress, not yet officially released.


## About
grunt-localhosts is an open-source project by [Tencent](http://www.tencent.com/en-us/) which builds on top of [Node.js](https://nodejs.org).


## Used by people within <a href="https://github.com/materliu/grunt-localhosts/issues/">(JOIN US)</a>
![Tencent](http://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Tencent_Logo.svg/200px-Tencent_Logo.svg.png)
![Xiaomi](https://avatars2.githubusercontent.com/u/1309360?v=3&s=200)


---

Task submitted by [materliu](http://materliu.github.com)

*This file was generated on Fri Apr 4 2014 22:38:50.*

