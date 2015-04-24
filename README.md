# Kent Hack Enough *Staff*

This is the user interface for the hackathon management system. It's an AngularJS app that connects to the `hacksu/kenthackenough` repository.

## Setup

### Development
1. Install [Vagrant](https://www.vagrantup.com/downloads.html)
2. Install [VirtualBox](https://www.virtualbox.org)
3. Clone this repository
4. `cp config/config_example.js config/config.js`
5. Open `config/config.js` and enter desired values
6. `vagrant up`
7. `bower install`
8. `npm install`
9. Run `gulp watch` while developing

### Production
1. Clone this repository
2. `cp config/config_example.js config/config.js`
3. Open `config/config.js` and enter desired values
4. `./provision.sh`
5. `bower install`
6. `npm install`
7. `gulp build`