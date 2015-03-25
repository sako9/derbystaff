# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/trusty64"

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  config.vm.network "forwarded_port", guest: 80, host: 3000

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  config.vm.provision "shell", inline: <<-SHELL
    # install nginx, npm, and bower
    apt-get update
    apt-get install -y nginx nodejs npm
    npm install -g npm
    npm install -g bower
    # install dependencies
    cd /vagrant
    bower install
    # set up nginx
    if [ -f /etc/nginx/sites-enabled/default ]; then
      rm /etc/nginx/sites-enabled/default
      rm /etc/nginx/sites-available/default
    fi
    cp /vagrant/config/staff.khe.conf /etc/nginx/sites-available
    ln -s /etc/nginx/sites-available/staff.khe.conf /etc/nginx/sites-enabled
    service nginx reload
    echo "--------------------------------------------"
    echo "|  KHE Staff up at http://localhost:3000/  |"
    echo "--------------------------------------------"
  SHELL
end
