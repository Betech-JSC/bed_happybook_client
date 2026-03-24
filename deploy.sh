#!/bin/bash

###############################################
# Deploy script for HappyBook Client (Next.js)
###############################################

set -e

echo "=========================================="
echo "🚀 Deploying HappyBook Client..."
echo "=========================================="

# Chuyển đến thư mục project trên VPS
cd /var/www/bed_happybook_client

# Pull code mới nhất
echo "📥 Pulling latest code..."
git pull origin master

# Cài đặt dependencies
echo "📦 Installing dependencies..."
yarn install

# Build project
echo "🔨 Building Next.js application..."
yarn build

# Restart PM2 process
echo "🔄 Restarting PM2 process..."
pm2 restart happybook

echo "=========================================="
echo "✅ HappyBook Client deployed successfully!"
echo "=========================================="
