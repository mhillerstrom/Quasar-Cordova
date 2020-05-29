# QuasarCordovaApp (fullstack mobile first app)

> A Quasar Framework app with Vue 2 and FeathersJS 4 fullstack app with authentication and email support implemented with mobile first in mind.

## About

This project uses [Quasar](https://quasar.dev) as a UX platform abstraction layer with the ability to create an app for all desired platforms - the same source for desktop (Windows and MacOS), browser, Android, and iOS. When combined with the [FeathersJS 4](http://feathersjs.com) open source web framework for building modern real-time applications and VueJS 2 with mobile first technology (feathers-offline-owndata) then you are off to a good start! Here we use MongoDB as back-end server storage, but it can easily be substituted for another database (eg. MySQL, PostgreSQL, MariaDB, SQLite, MSSQL, Elasticsearch, Objection, Cassandra, ... ).

This project is not finished but it is a very good start.

Features
  - Mobile first ([offline-realtime-owndata](https://docs.feathersjs.com/guides/offline-first/readme.html))
  - Quasar (one source for all platforms) v1.11.2
  - VueJS 2.6.11
  - FeathersJS 4.5.3
  - Cordova 8.1.1
  - SASS
  - Pug
  - ES6, ES7, and ES8
  - Webpack
  - Vue Stash - For Redux Store (can easily be replaced with Vuex)
  - Lodash
  - Material Design, Fontawesome, Roboto-Font (and more)
  - Validate client side data with Mongoose schemas
  - Hot reload

Moreover, you can use Docker for server development and deployment.

## Help

For more information on all the things you can do with Quasar visit [quasar.dev](http://quasar.dev).

For more information on all the things you can do with VueJS visit [vuejs.org](http://vuejs.org).

For more information on all the things you can do with FeathersJS visit [docs.feathersjs.com](http://docs.feathersjs.com).

For more information on all the things you can do with Cordova visit [cordova.apache.org](http://cordova.apache.org).

For more information on all the things you can do with Docker visit [docs.docker.com](http://docs.docker.com).

## Install the dependencies
We presuppose that you already have [npm](https://npmjs.com) and [node](https://nodejs.org) installed. Optionally, you also have to have [MongoDB](https://www.mongodb.com) installed if you do not want to develop using `Docker.` If you do want to develop with `Docker` then this have to be installed too ([Docker](https://docker.com)).

First you have to get this source
```bash
cd <your-source-dir>
git clone https://github.com/mhillerstrom/Quasar-Cordova Quasar-Cordova
```

Then you
```bash
cd Quasar-Cordova
npm install
```

### Set environment
To be able to run, you first have to create a file named `environment-dev.env` in `Quasar-Cordova` with the following contents:

```env
# Development host - please insert your ip (not localhost)
HOST=<your-ip>
PORT=8081
CLIENTPORT=8080
PROTOCOL=http

# Database definitions (DEV and TEST)
DATABASE_URL=mongodb://db:27017/MyAppDevDB
DATABASE_TEST_URL=mongodb://db:27017/MyAppTestDB

# Should we suppress email-mania all together?
SUPPRESS_EMAIL=false
# Should we send a test message to COMPLAINT_EMAIL at startup?
SEND_TEST_EMAIL=false

# Allowed email address formats:  dd@disney.com   or the friendlier:  Donald Duck <dd@disney.com>
COMPLAINT_EMAIL=MyApp Complaints <your-gmail-account>
GMAIL=MyApp <your-gmail-account>
GMAIL_PASSWORD=<your-gmail-key>

COOKIE=myapp-jwt
ISSUER=myapp
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

#### Client
To develop the client alone use
```bash
quasar dev
```
To develop using a usb-connected device (here an Android device)
```bash
quasar dev -m cordova -T android
```
Very sleek with automatic refresh whenever you save changes to your code.

#### Server (and client)

##### With Docker
To develop the client and server together use
```bash
npm run dockerdev
```
This will start the process of initiating the client development process and start the Docker `docker-compose` process of building the images and containers for Mongo and the server. On my MacBook Pro 2017 this takes just shy of 5 min for the initial build.

To develop on a usb-connected device and server together use
```bash
npm run dockerdevice -T ios
```
(Should you forget to connect a device a simulator will be started instead).

##### Without Docker
This is a bit trickier. I suggest you open 3 terminal sessions in the `quasar-cordova` directory.

In the first window we start `MongoDB`(which have to be locally installed first)
```bash
mongod
```

In the second window you can start the server by
```bash
npm run quasar-serve
```

Finally, in the third window you start the `Quasar` development server by
```bash
npm run quasar-dev
```

#### Client in browser
To start the client in a browser use
```chrome
http://localhost:8080
```

### Lint the files
```bash
npm run lint
```

### Build the app for production
To build the client for all configured platforms (Android, iOS, and browser) use
```bash
quasar build
```
You can optionally produce a specific client by
```bash
quasar build android
```

To build the production images/containers for the server
```bash
npm run dockerbuild
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

## Structure
The application is structured in separate directories for the front-end (browser), the mobile apps (Cordova), and the back-end (FeathersJS). The main directory structure:
```
Quasar-Cordova
  + config        # Configuration files
  + dist          # The distribution files
  + server        # The Back-end (server) dir (FeathersJS)
  |  + email-templates
  |  + hooks      # System wide (generic) hooks
  |  + middleware # Not used (yet?)
  |  + models     # Database document models
  |  + patterns   # DB field validation
  |  + seed       # Initial DB instantiation
  |  + services   # All the implemented services (adhering to FeathersJS)
  |  + utils      # Generic and important utilities
  + srv           # The front-end main dir
  |  + assets     # Logos
  |  + boot       # Add-ins to Quasar (eg. routing and data store)
  |  + components # The Vue components
  |  + css        # The app wide styles
  |  + layouts    # The app page layouts
  |  + pages      # The content for the layouts
  |  + router     # The app routing
  |  + images     # The background decorations
  |  + services   # Bridging front-end with the back-end,
  |  |              authorisation, and sign-up (FeathersJS)
  |  |  + api     # Bridge implementation, FeathersJS inclusion
  |  |  + schemas # Validation schemas for services
  |  + statics    # Icons and backgrounds
  |  |  + icons   # Icons (platform specific)
  |  + store      # Defining the Vue Stash
  + src-cordova   # The Cordova specific code
  |                 (see https://cordova.apache.org)
  + www           # I'm not sure...
  + doc           # Misc documentation both of system and surrounding systems
  + node_modules  # Automatically populated by `npm`
  + test          # Server Mocha tests (maybe)
```

## Allowing trusted people to look at your work in progress
When developing it is often useful to get input from others in order to get the design just right. But how do you do this without going through the full hassle of establishing a site, generating the production versions, and publishing it all to the site? Well, there is very handy way by built-in functionality, `localhost.run`, of `ssh`.

You can allow people outside your local area network to access your app on your machine by opening a shell and type
````bash
ssh -R 80:localhost:8080 ssh.localhost.run
````
The output wil be something like
```text
... a number of lines skipped ...
**If you see a message below telling you that your hostname is already in use**
** try a different username like this:**
**`ssh -R localhost:80:localhost:8080 random-string@ssh.localhost.run`**
===============================================================================

Connect to http://somestring.localhost.run or https://somestring.localhost.run
```
Now you only have to let your trusted friends to direc their browser to the address given on the line starting with `Connect to` *et voilá* they are accessing the app in realtime. If you make changes they are available to your friends too. Very neat and useful.

> **NOTE:** remember to close the connection when your session ends due to possible security problems.


## License

Copyright (c) 2020 by Michael Hillerström

