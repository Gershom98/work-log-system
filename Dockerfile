FROM php:8.2-fpm

# 1. Install system dependencies & libraries
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

# 3. Increase PHP Memory Limit
RUN echo "memory_limit=256M" > /usr/local/etc/php/conf.d/memory-limit.ini

# 4. Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# 5. Copy composer dependencies first
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader

# 6. Copy project files
COPY . .

# 7. Complete composer dump-autoload
RUN composer dump-autoload --optimize

# 8. Install Node dependencies & build frontend assets
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install \
    && npm run build

# 9. Create necessary storage directories and fix Linux permissions
RUN mkdir -p /var/www/storage/fonts /var/www/storage/framework/views /var/www/storage/framework/sessions /var/www/storage/framework/cache \
    && chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# 10. Copy startup script
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

EXPOSE 80

CMD ["/usr/local/bin/start.sh"]