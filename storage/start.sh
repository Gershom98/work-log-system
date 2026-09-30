#!/bin/bash

# Clear & Cache configuration
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# Run database migrations na seeders
echo "Running Migrations & Seeders..."
php artisan migrate:fresh --force
php artisan db:seed --force

# Optimize Laravel for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start PHP-FPM & Nginx au Web Server
echo "Starting Application..."
php artisan serve --host=0.0.0.0 --port=80