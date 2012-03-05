Global Adaptation Index website
--------------------------

Requirements
------------

- Couch 1.0.x
`brew install couchdb`
- Node v0.4.9
`brew install node` for dependencies
I used [nvm](https://github.com/creationix/nvm) to install the specific version
`nvm install v0.4.9`
- npm
`curl http://npmjs.org/install.sh | sh`
- Mapnik 2.x.  
 If using OSX, get it here http://dbsgeo.com/downloads/
`brew install mapnik`
- Review package.json for node version requirements
- Modern version of libsqlite3. Note: older versions such as on Ubuntu Lucid can result in slow map rendering. In such cases, the [mapnik sqlite plugin can be built standalone](https://github.com/springmeyer/sqlite3-mapnik), or you can use a newer version of libsqlite3

Installation
------------

After cloning the repository / downloading the tarball:

0. Change into project directory, run `npm install`
1. If on OSX without Mapnik, download http://cloud.github.com/downloads/mapnik/node-mapnik/node-mapnik-osx-universal-0.5.3-r3191.zip and unzip it in the node_modules/ directory.
2. Run `./index.js install`
3. Run `./index.js import`
4. Run `./index.js changes`
5. Add a user `./index.js user add admin email@example.com secretpw`
6. Run `./index.js`

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


Staging server
--------------

* App is located in /var/www/nodeapp
* To roll out, `sudo -i`, then `su nodeapp`, then from /var/www/nodeapp do `git pull`.  You'll need the passphrase.