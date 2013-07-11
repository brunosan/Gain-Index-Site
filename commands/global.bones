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

Bones.Command.options['mapHosts'] = {
    'title': 'mapHosts=[a,b,c]',
    'description': 'Comma-separated string of subdomain hostnames to use for serving map tiles',
    'default': ''
}

Bones.Command.options['maxAge'] = {
    'title': 'maxAge=[int]',
    'description': 'max-age setting for Cache-Control header',
    'default': 3600
}

Bones.Command.options['startYear'] = {
    'title': 'startYear=[int]',
    'description': 'Start year of the data',
    'default': 1995
}

Bones.Command.options['endYear'] = {
    'title': 'endYear=[int]',
    'description': 'End (or latest) year of the data',
    'default': 2012
}

/**
 * Callback used to initialize the server for certain commands.
 */
function bootstrapCommand(parent, plugin, callback) {
    parent.call(this, plugin, function() {
        this.servers = {};
        for (var server in plugin.servers) {
            this.servers[server] = new plugin.servers[server](plugin);
        }
        callback();
    });
}

/**
 * Need to initialize all the servers for the user plugin commands to work.
 */
commands.user.augment({
    bootstrap: bootstrapCommand
});

/**
 * Need to initialize all the servers for the import plugin commands to work.
 */
commands.import.augment({
    bootstrap: bootstrapCommand
});

