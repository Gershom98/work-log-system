# ==========================================
# STAGE 1: Build Frontend Assets (Vite / React)
# ==========================================
FROM node:18-alpine AS node_builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ==========================================
# STAGE 2: PHP Application Setup
# ==========================================
FROM php:8.2-fpm

# Install system dependencies & nginx
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nginx \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd xml dom

# Increase PHP Memory Limit
RUN echo "memory_limit=256M" > /usr/local/etc/php/conf.d/memory-limit.ini

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy Composer files and install dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader

# Copy application source code
COPY . .

# Copy built frontend assets from Stage 1
COPY --from=node_builder /app/public/build ./public/build

# Optimize autoload
RUN composer dump-autoload --optimize

# Storage directory setup and permission fixes
RUN mkdir -p /var/var/www/storage/fonts \
    /var/www/storage/framework/views \
    /var/www/storage/framework/sessions \
    /var/www/storage/framework/cache \
    && chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Copy startup script
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

EXPOSE 8080

CMD ["/usr/local/bin/start.sh"]