#!/bin/bash

# Railway build script to handle Rollup binary issues
echo "Installing dependencies..."
npm ci

echo "Installing Linux Rollup binary..."
npm install @rollup/rollup-linux-x64-gnu --platform=linux --arch=x64 --optional || echo "Rollup binary installation failed, continuing..."

echo "Building frontend..."
npm run build
