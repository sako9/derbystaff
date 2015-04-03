# install nginx
apt-get update
apt-get upgrade -y
apt-get install -y nginx

# set up nginx
if [ -f /etc/nginx/sites-enabled/default ]; then
  rm /etc/nginx/sites-enabled/default
  rm /etc/nginx/sites-available/default
fi
if [ $1 == "dev" ]; then
  cp /var/www/kenthackenough-ui-staff/config/dev.conf /etc/nginx/sites-available
  ln -s /etc/nginx/sites-available/dev.conf /etc/nginx/sites-enabled
fi
service nginx reload

echo "--------------------------------------------"
echo "|  KHE Staff up at http://localhost:3001/  |"
echo "--------------------------------------------"