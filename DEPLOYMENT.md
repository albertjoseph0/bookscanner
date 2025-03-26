# BookScanner Deployment Guide

## Standard Deployment Process

### Prerequisites
- Ubuntu 22.04 LTS server
- Root or sudo access
- Node.js 18+
- NGINX

### Best Practices

1. **Standard Directory Structure**:
   - Web files: `/var/www/bookscanner/` (owned by www-data)
   - Application files: `/opt/bookscanner/` (owned by application user)

2. **Dependencies Management**:
   - Always install dependencies at all levels (root, backend, frontend)
   - Explicitly install `mssql` even when using SQLite to prevent import errors

3. **Environment Configuration**:
   - Always set `USE_AZURE_DB=false` when using SQLite

4. **Permissions**:
   - Web files: `chmod 755` for directories, `chmod 644` for files
   - Server files: `chmod 755` for script files, `chmod 644` for configuration
   - Uploads directory: Ensure it exists and has proper permissions

5. **NGINX Configuration**:
   - Always serve frontend from `/var/www` instead of user home directory
   - Use standard `www-data` user for NGINX

## Common Issues and Solutions

1. **Permission Denied Errors**:
   - Check NGINX logs: `sudo tail -f /var/log/nginx/error.log`
   - Ensure files in `/var/www/bookscanner` are owned by www-data
   - Use `sudo chmod -R 755 /var/www/bookscanner` to set proper permissions

2. **Module Not Found Errors**:
   - Check PM2 logs: `pm2 logs bookscanner-backend`
   - Ensure all dependencies are installed: `npm install mssql` in backend directory
   - Verify `.env` has correct configuration

3. **API Connection Issues**:
   - Ensure frontend uses correct API URL in `.env`
   - Check NGINX proxy configuration
   - Verify backend is running: `pm2 status`
   - Add VM IP to Server Firewall

## Deployment Script

See `deploy.sh` in the repository root for automated deployment.