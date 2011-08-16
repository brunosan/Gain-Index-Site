var fs = require('fs'),
    csv = require('csv'),
    request = require('request');

command = Bones.Command.extend();
command.description = 'concert indicators or country meta csv files to JSON';

command.options['file'] = {
    'title': 'file',
    'description': 'indicators|country - Meta file to convert inciators-meta.csv or country-meta.csv',
    'default': 'indicators'
};

command.prototype.initialize = function(options) {
    var type = options.config.file || 'indicators'
    var filename = __dirname + '/../resources/meta/' + type + '-meta.csv',
        data = {};

    csv()
    .fromPath(filename, {columns: true})
    .on('data', function(v, i) {
        data[v.id || v['ISO3']] = v;
    })
    .on('end', function() {
        console.log(JSON.stringify(data, null, 4));
    })
    .on('error', function(err) {
        console.log(err);
    });
}

