GAIN Index website
------------------

Requirements
------------

- Couch 1.0.x - `brew install couchdb`
- Node v0.8.9 - `nvm install v0.8.9`
- Mapnik 2.x - on OSX `brew install mapnik`
- libsqlite3 - Modern version of libsqlite3. Note: older versions such as on Ubuntu Lucid can result in slow map rendering. In such cases, the [mapnik sqlite plugin can be built standalone](https://github.com/springmeyer/sqlite3-mapnik).

Installation
------------

After cloning the repository / downloading the tarball:

0. Change into project directory, run `nvm use v0.8.9`
1. Install node modules `npm install`
2. Install database `./index.js install`
3. Import data `./index.js import`
4. Apply changes to data `./index.js changes`
5. Add a user `./index.js user add admin email@example.com secretpw`
6. Start site `./index.js`

The application will refuse to install if it detects existing databases. To
install anew, run `./index.js uninstall` first.

NOTE: When installing on OSX, you must close your terminal (or re-source .profile / .bash_profile) after you install Mapnik, then open a new terminal and run `npm install` as explained above.  The reason is that Mapnik contains the correct sqlite libraries, and otherwise the OSX libraries will be used when running npm install, which will result in a later error when you run ./index.js changes.

Updating libmapnik2 / libmapnik2-dev
------------------------------------

As a result of the issue dicussed in the requirements ("Modern version of libsqlite3") if you upgrade libmapnik2 you must [rebuild the sqlite plugin](https://github.com/springmeyer/sqlite3-mapnik) and then rebuild node_modules.  This is specific to Linux installations, particularly on Ubuntu Lucid LTS.

Uninstalling
------------

    ./index.js uninstall

Usage
-----

Change into project directory, run:
  `nvm use v0.8.9`

See usage options

    ./index.js --help

Start server (`couchdb` should be running as a daemon, or in another terminal window.)

    ./index.js

Start server with production configuration

    ./index.js --config=settings.json

NOTE:

If server should be accessible on a host other than the OS default, host needs
to be specified:

    ./index.js --host=[host]

When debugind data, this one liner might be handy:
    ./index.js uninstall; ./index.js install; ./index.js import ;
./index.js changes ;  ./index.js ; open http://localhost:3000/
