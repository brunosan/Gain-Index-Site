var couch = require('backbone-couch');

var register = models.Page.register;
models.Page.register = function(server) {
    var config = server.plugin.config;
    var options = {
        host: config.couchHost,
        port: config.couchPort,
        name: config.couchPrefix + '_documents'
    };

    // Give the model access to the CouchDB object.
    var db = couch(options);
    this.prototype.couchDb = db.db;
    this.prototype.sync = db.sync;
    return register.apply(this, arguments);
};
