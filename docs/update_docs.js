/* jshint node: true*/

"use strict";

var literate = require('ljs');
var fs = require('fs');
var tmp = require('tmp');
var files = require('../../../files.json');
var extractCSSCommentsRegex = /(\/\*\*(?:\*(?!\/)|[^*])*\*\/)/g;

files.docs.docs2generate.forEach(function (doc) {
    console.log(doc[0], '...');
    var documentation = literate(doc[1], {
      code: false
    });

    fs.writeFileSync(doc[0], documentation);
});

files.docs.docsCSS2generate.forEach(function (doc) {
    console.log(doc[0], '...');

    var str = fs.readFileSync(doc[1], 'utf8');
    var res_str = str.match(extractCSSCommentsRegex).join('\n');

    var tmpobj = tmp.fileSync();
    fs.writeFileSync(tmpobj.name, res_str);

    var documentation = literate(tmpobj.name, {
      code: false
    });
    fs.writeFileSync(doc[0], documentation);
});
