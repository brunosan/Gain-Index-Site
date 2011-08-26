Global Adaptation Index website
--------------------------

Requirements
------------

- Couch 1.0.x
- Node v0.4.9
- npm
- Review package.json for node version requirements
- Modern version of libsqlite3. Note: older versions such as on Ubuntu Lucid can result in slow map rendering. In such cases, the [mapnik sqlite plugin can be built standalone](https://github.com/springmeyer/sqlite3-mapnik), or you can use a newer version of libsqlite3

Installation
------------

After cloning the repository / downloading the tarball:

0. If on OSX without Mapnik, download http://cloud.github.com/downloads/mapnik/node-mapnik/node-mapnik-osx-universal-0.5.3-r3191.zip and unzip it in the node_modules/ directory.
1. Change into project directory, run `npm install`
2. Run `./index.js install`
3. Run `./index.js import`
4. Run `./index.js changes`
5. Add a user `./index.js user add admin email@example.com secretpw`
6. Run `./index.js`

The application will refuse to install if it detects existing databases. To
install anew, run `./index.js uninstall` first.


Uninstalling
------------

    ./index.js uninstall

Usage
-----

See usage options

    ./index.js --help

Start server

    ./index.js

Start server with production configuration

    ./index.js --config=settings.json

NOTE:

If server should be accessible on a host other than the OS default, host needs
to be specified:

    ./index.js --host=[host]

