#!/bin/bash

# Explicitly navigate to app directory
cd /var/www

# Clear and rebuild cache
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

echo "Running Migrations & Seeders..."
php artisan migrate:fresh --force
php artisan db:seed --force

# Cache settings for speed
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Dynamic PORT binding for Render
PORT="${PORT:-8000}"
echo "Starting Laravel server on port $PORT..."
exec php artisan serve --host=0.0.0.0 --port="$PORT"