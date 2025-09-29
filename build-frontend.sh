#!/bin/bash
set -e

echo "Installing frontend dependencies with optional deps omitted..."
cd frontend
rm -rf node_modules package-lock.json || true
npm install --legacy-peer-deps --omit=optional --no-audit --no-fund
echo "Running Vite build..."
npm run build
echo "Frontend build completed successfully!"