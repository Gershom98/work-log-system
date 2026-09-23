# 1. Tumia official PHP FPM image na Node.js
FROM php:8.2-fpm

# Weka environment variables
ENV NODE_VERSION=20.x

# 2. Install system dependencies & PHP extensions zinazohitajika na Laravel + DomPDF
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
    supervisor \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Config na install PHP extensions (GD ni muhimu sana kwa DomPDF)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# 3. Install Node.js & NPM kwa ajili ya Inertia/Vite build
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# 4. Install Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy project files
COPY . .

# 5. Install PHP dependencies via Composer
RUN composer install --no-dev --optimize-autoloader --no-interaction

# 6. Install JS dependencies na build React/Inertia assets
RUN npm install
RUN npm run build

# Set permissions za Laravel storage na bootstrap/cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Expose port 80
EXPOSE 80

# 7. Command ya ku-run migrations na kuanzisha server
CMD php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan migrate --force && \
    php artisan serve --host=0.0.0.0 --port=80