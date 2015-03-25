# Kent Hack Enough *Staff*

This is the user interface for the hackathon management system. It's an AngularJS
app that connects to the `hacksu/kenthackenough` repository.

## ToDo
- Attendee statistics
    + Data visualization in 'Tools'
    + Basic stats on home page
- Use grunt

## Setup

### Development
1. Install [Vagrant](https://www.vagrantup.com/downloads.html)
2. Install [VirtualBox](https://www.virtualbox.org)
3. Clone this repository
4. `cp config/config_example.js config/config.js`
5. Open `config/config.js` and enter desired values
6. `vagrant up`
7. `bower install`

### Production
##### Install nginx and npm
1. `apt-get update`
2. `apt-get install -y nginx nodejs npm`
3. `npm install -g npm`

##### Set up repository
1. `npm install -g bower`
2. Clone this repository
3. `bower install`
4. `cp config/config_example.js config/config.js`
5. Open `config/config.js` and enter desired values

##### Configure nginx
1. `cp config/staff.khe.conf /etc/nginx/sites-available`
2. Open `/etc/nginx/sites-available/staff.khe.conf` and enter desired values
3. `ln -s /etc/nginx/sites-available/staff.khe.conf /etc/nginx/sites-enabled/`
4. `service nginx reload`