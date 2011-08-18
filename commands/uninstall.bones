var fs = require('fs');

command = Bones.Command.extend();

command.description = 'uninstall databases';

command.prototype.initialize = function(plugin) {
    var command = this;
    plugin.config.databases.split(':').forEach(function(dbName) {
        command.uninstallDB(plugin, dbName);
    });
    fs.unlink('files/indicators.sqlite');
};

command.prototype.uninstallDB = function(plugin, dbName) {
    var config = plugin.config;
    var options = {
        host: config.couchHost,
        port: config.couchPort,
        name: config.couchPrefix + '_' + dbName,
        basename: dbName
    };
    var couch = require('backbone-couch')(options);

    couch.db.dbDel(function(err) {
        if (err) return console.warn('%s', err);
        console.log('Deleted ' + options.name);
    });
};

