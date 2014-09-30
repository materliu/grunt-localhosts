/*
 * grunt-localhosts
 * https://github.com/materliu/grunt-localhosts
 *
 * Copyright (c) 2014 materliu & Tencent AlloyTeam
 */
module.exports = function (grunt) {
    // var url = require('url');
    var fs = require('fs');
    var split = require('split');
    var through = require('through');

    const WINDOWS = (process.platform === 'win32');
    const EOL = WINDOWS ? '\r\n' : '\n';
    const HOSTS = WINDOWS ? 'C:/Windows/System32/drivers/etc/hosts' : '/etc/hosts';


    /**
     * Get a list of the lines that make up the /etc/hosts file. If the
     * `preserveFormatting` parameter is true, then include comments, blank lines
     * and other non-host entries in the result.
     *
     * @param  {boolean}   preserveFormatting
     * @param  {function(err, lines)} cb
     */
    var get = function (preserveFormatting, cb) {
        var lines = [];
        fs.createReadStream(HOSTS, 'utf8')
            .pipe(split())
            .pipe(through(function (line) {
                var matches = /^\s*?([^#]+?)\s+([^#]+?)$/.exec(line);
                if (matches && matches.length === 3) {
                    // Found a hosts entry
                    var ip = matches[1];
                    var host = matches[2];
                    lines.push([ip, host]);
                } else {
                    // Found a comment, blank line, or something else
                    if (preserveFormatting) {
                        lines.push(line);
                    }
                }
            }))
            .on('close', function () {
                cb(null, lines);
            })
            .on('error', cb);
    };

    /**
     * Add a rule to /etc/hosts. If the rule already exists, then this does nothing.
     *
     * @param  {string}   ip
     * @param  {string}   host
     * @param  {function(Error)} cb
     */
    var set = function (ip, host, cb) {
        get(true, function (err, lines) {

            // Try to update entry, if host already exists in file
            var didUpdate = false;
            lines = lines.map(function (line) {
                if (Array.isArray(line) && line[1] === host) {
                    line[0] = ip;
                    didUpdate = true;
                }
                return line;
            });

            // If entry did not exist, let's add it
            if (!didUpdate) {
                lines.push([ip, host]);
            }

            writeFile(lines, cb);
        });
    };

    /**
     * Remove a rule from /etc/hosts. If the rule does not exist, then this does
     * nothing.
     *
     * @param  {string}   ip
     * @param  {string}   host
     * @param  {function(Error)} cb
     */
    var remove = function (ip, host, cb) {
        get(true, function (err, lines) {

            // Try to remove entry, if it exists
            lines = lines.filter(function (line) {
                return !(Array.isArray(line) && line[0] === ip && line[1] === host);
            });

            writeFile(lines, cb);
        });
    };

    /**
     * Write out an array of lines to the host file. Assumes that they're in the
     * format that `get` returns.
     *
     * @param  {Array.<string|Array.<string>>} lines
     * @param  {function(Error)} cb
     */
    var writeFile = function (lines, cb) {
        fs.stat(HOSTS, function (err, stat) {
            if (err) {
                cb(err);
            } else {
                var s = fs.createWriteStream(HOSTS, { mode: stat.mode });
                s.on('close', cb);
                s.on('error', cb);

                lines.forEach(function (line, lineNum) {
                    if (Array.isArray(line)) {
                        line = line[0] + ' ' + line[1];
                    }
                    s.write(line + (lineNum === lines.length - 1 ? '' : EOL));
                });
                s.end();
            }
        });
    };

    grunt.registerMultiTask('localhosts', "Change your local machine hosts",
        function () {
            var done = this.async(),
                options = this.options();

            grunt.log.writeln('ready to change localhost !');

            if (options.rules && options.rules[0]) {
                options.rules.forEach(function (value) {
                    var ip = value.ip;
                    var hostname = value.hostname;
                    var type = value.type || 'set';

                    switch (type) {
                        case "set":
                            set(ip, hostname, function () {
                                grunt.log.writeln('set localhost ' + hostname + ' -> ' + ip);
                                done();
                            });
                            break;

                        case "remove":
                            remove(ip, hostname, function () {
                                grunt.log.writeln('remove localhost ' + hostname + ' -> ' + ip);
                                done();
                            });
                            break;
                    }
                });
            } else {
                done();
            }
        }
    );

};
