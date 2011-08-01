var path = require('path'),
    fs = require('fs');


Bones.Command.options['files'] = {
    'title': 'files=[path]',
    'description': 'Path to files directory.',
    'default': function(options, config) {
        return path.join(process.cwd(), 'files');
    }
};


Bones.Command.options['couchHost'] = {
    'title': 'couchHost=[host]',
    'description': 'Couch DB Host.',
    'default': '127.0.0.1'
};

Bones.Command.options['couchPort'] = {
    'title': 'couchPort=[port]',
    'description': 'Couch DB port.',
    'default': '5984'
};

Bones.Command.options['couchPrefix'] = {
    'title': 'couchPrefix=[prefix]',
    'description': 'Couch DB database name prefix.',
    'default': 'gain'
};


Bones.Command.options['secret'] = {
    'title': 'secret=[path]',
    'description': 'Path to secret key file.',
    'default': function(options, config) {
        var files = config ? config.files : Bones.Command.options['files'].default();
        return path.join(files, 'secret.json');
    }
};


Bones.Command.options['databases'] = {
    'title': 'databases=[users:pages]',
    'description': 'Colon separated list of databases.',
    'default': 'users:data'
}

/**
 * Need to initialize all the servers for the user plugin commands to work.
 */
commands.user.augment({
    bootstrap: function(parent, plugin, callback) {
        parent.call(this, plugin, function() {
            this.servers = {};
            for (var server in plugin.servers) {
                this.servers[server] = new plugin.servers[server](plugin);
            }
            callback();
        });
    }
});

