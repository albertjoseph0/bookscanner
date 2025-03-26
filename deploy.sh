#!/bin/bash
set -e  # Exit on any error

echo "===== BookScanner Deployment Script ====="

# 1. Update system and install dependencies
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

echo "Installing required system packages..."
sudo apt install -y curl nginx

# 2. Install Node.js
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version

# 3. Install PM2 globally
echo "Installing PM2..."
sudo npm install -g pm2

# 4. Configure NGINX to run as standard www-data user
echo "Configuring NGINX..."
sudo cat > /etc/nginx/sites-available/bookscanner << 'EOF'
server {
    listen 80;
    server_name _;

    # Serve frontend from standard web directory
    location / {
        root /var/www/bookscanner;
        try_files $uri $uri/ /index.html;
        index index.html index.htm;
    }

    # Proxy API requests to the backend
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Handle larger uploads
    client_max_body_size 10M;
}
EOF

# 5. Enable bookscanner site and disable default
sudo ln -sf /etc/nginx/sites-available/bookscanner /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 6. Create web directory with proper permissions
echo "Setting up web directory..."
sudo mkdir -p /var/www/bookscanner
sudo chown -R www-data:www-data /var/www
sudo chmod -R 755 /var/www

# 7. Create app directory with proper permissions
echo "Setting up app directory..."
sudo mkdir -p /opt/bookscanner
sudo chown -R $USER:$USER /opt/bookscanner

# 8. Install backend dependencies
echo "Setting up backend..."
cd /opt/bookscanner

# Clone or copy your backend files here
# git clone or copy commands...

# Important: Install all dependencies, including those in root
cd /opt/bookscanner
npm install

cd /opt/bookscanner/backend
npm install
npm install mssql  # Explicitly install mssql to avoid the module not found error

# 9. Create uploads directory with proper permissions
mkdir -p /opt/bookscanner/backend/uploads
chmod 755 /opt/bookscanner/backend/uploads

# 10. Set up backend environment
cat > /opt/bookscanner/backend/.env << EOF
PORT=3001
NODE_ENV=production
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
USE_AZURE_DB=false
EOF

# 11. Start backend with PM2
cd /opt/bookscanner/backend
pm2 start server.js --name bookscanner-backend
pm2 save
pm2 startup

# 12. Build frontend and copy to web directory
echo "Setting up frontend..."
cd /opt/bookscanner/frontend

# Create .env file for frontend
cat > .env << EOF
REACT_APP_API_URL=http://$(curl -s ifconfig.me)/api
EOF

# Install frontend dependencies and build
npm install
npm run build

# Copy build files to web directory
sudo cp -r build/* /var/www/bookscanner/
sudo chown -R www-data:www-data /var/www/bookscanner
sudo chmod -R 755 /var/www/bookscanner

# 13. Final permissions check
sudo nginx -t
sudo systemctl restart nginx

echo "===== Deployment Complete ====="
echo "BookScanner should now be available at http://$(curl -s ifconfig.me)"