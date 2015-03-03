# Kent Hack Enough *Staff*

This is the user interface for the hackathon management system. It's an AngularJS
app that connects to the `hacksu/kenthackenough` repository.

## Setup

### Prerequisites
1. Install `bower`
1. Clone repository
1. `bower install`
1. `cp config/config_example.js config/config.js`
1. Enter values into `config/config.js`

### Development
1. `vagrant up`

### Production
1. Install `nginx`
1. Configure `config/staff.khe.conf` (nginx virtual host file)
1. `mv config/staff.khe.conf /etc/nginx/sites-available`
1. `ln -s /etc/nginx/sites-available/staff.khe.conf /etc/nginx/sites-enabled/`
1. `service nginx reload`