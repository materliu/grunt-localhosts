/*
 * grunt-localhosts
 * https://github.com/materliu/grunt-localhosts
 *
 * Copyright (c) 2014 materliu & Tencent AlloyTeam
 */
module.exports = function (grunt) {
  var fs = require('fs');
  var split = require('split');
  var through = require('through');
  var dns = require('dns');

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

  var getIp = function (rule, cb) {
    if (rule) {
      if (rule.ip) {
        cb(null, rule.ip);
      } else if (rule.domain) {
        dns.lookup(rule.domain, function (err, address, family) {
          cb(err, address);
        });
      }
    } else {
      cb("Must specify Ip Address or Domain Name");
    }
  };

  /**
   * Add a rule to /etc/hosts. If the rule already exists, then this does nothing.
   *
   * @param  {string}   ip
   * @param  {string}   host
   * @param  {function(Error)} cb
   */
  var set = function (lines, ip, host) {
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
    return lines;
  };

  /**
   * Remove a rule from /etc/hosts. If the rule does not exist, then this does
   * nothing.
   *
   * @param  {string}   ip
   * @param  {string}   host
   * @param  {function(Error)} cb
   */
  var remove = function (lines, ip, host) {
    // Try to remove entry, if it exists
    lines = lines.filter(function (line) {
      return !(Array.isArray(line) && line[0] === ip && line[1] === host);
    });
    return lines;
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

  grunt.registerMultiTask('localhosts', 'Change your local machine hosts', function () {
    var done = this.async(),
      options = this.options();

    get(true, function (err, lines) {
      if (err) {
        grunt.log.writeln(err);
      }
      grunt.log.writeln('Ready to change localhost!\n');

      if (Array.isArray(options.rules)) {
        var total = 0;
        var checkComplete = function () {
          if (total >= options.rules.length) {
            writeFile(lines, function () {
              grunt.log.writeln(HOSTS + ' is refreshed');
              done();
            });
          }
        };
        options.rules.forEach(function (value) {
          getIp(value, function (err, ip) {
            if (err || !ip) {
              grunt.log.writeln(err || "Could not determine Ip Address!");
            }
            else {
              var hostname = value.hostname;
              var type = value.type || 'set';
              switch (type) {
                case "set":
                  lines = set(lines, ip, hostname);
                  grunt.log.writeln('Set localhost ' + hostname + ' -> ' + ip);
                  break;
                case "remove":
                  lines = remove(lines, ip, hostname);
                  grunt.log.writeln('Remove localhost ' + hostname + ' -> ' + ip);
                  break;
              }
            }
            total++;
            checkComplete();
          });
        });
        checkComplete();
      } else {
        done();
      }
    });
  });
};
