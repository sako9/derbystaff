# install nginx
apt-get update
apt-get install -y nginx

# set up nginx
if [ -f /etc/nginx/sites-enabled/default ]; then
  rm /etc/nginx/sites-enabled/default
  rm /etc/nginx/sites-available/default
fi
cp /var/www/kenthackenough-ui-staff/config/staff.khe.conf /etc/nginx/sites-available
ln -s /etc/nginx/sites-available/staff.khe.conf /etc/nginx/sites-enabled
service nginx reload

echo "--------------------------------------------"
echo "|  KHE Staff up at http://localhost:3000/  |"
echo "--------------------------------------------"