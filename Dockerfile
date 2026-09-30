FROM php:8.2-fpm

# 1. Install system dependencies & libraries needed for DomPDF (GD, Fonts, Libxml)
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
    nginx

# Clear apt cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# 2. Configure and Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd xml dom

# 3. Increase PHP Memory Limit for PDF Generation
RUN echo "memory_limit=256M" > /usr/local/etc/php/conf.d/memory-limit.ini

# 4. Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# 5. Copy composer dependencies first (for layer caching)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader

# 6. COPY mradi wote (ikijumuisha resources/views/pdf/work-logs.blade.php)
COPY . .

# 7. Complete composer dump-autoload
RUN composer dump-autoload --optimize

# 8. Install Node dependencies & build frontend assets (Inertia/Vite)
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install \
    && npm run build

# 9. Clear Laravel build caches
RUN php artisan config:clear && php artisan view:clear && php artisan route:clear

# 10. Create necessary storage directories and fix Linux permissions
RUN mkdir -p /var/www/storage/fonts /var/www/storage/framework/views \
    && chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

EXPOSE 80

# 11. Run migrations, clear startup cache, and start PHP server
CMD php artisan migrate:fresh --force && php artisan view:clear && php artisan config:clear && php artisan serve --host=0.0.0.0 --port=80