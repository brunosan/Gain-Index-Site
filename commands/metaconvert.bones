var fs = require('fs'),
    csv = require('csv'),
    request = require('request');

command = Bones.Command.extend();
command.description = 'Generate JSON from /resoureces/meta/indicators-meta.csv';
command.prototype.initialize = function(options) {

    var filename = __dirname + '/../resources/meta/indicators-meta.csv',
        data = {};

    csv()
    .fromPath(filename, {columns: true})
    .on('data', function(v, i) {
        data[v.id] = v    
    })
    .on('end', function() {
        console.log(JSON.stringify(data, null, 4));
    })
    .on('error', function(err) {
        console.log(err);
    });
}

