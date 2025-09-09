# SPA Routing Configuration

This document explains how to configure your Sneaker Chronicles app for proper Single Page Application (SPA) routing so that refreshing pages works correctly.

## 🚨 The Problem

When you refresh a page like `/sneaker/welcome-to-sneaker-chronicles`, the browser makes a request to the server for that exact path. Since it's a client-side route, the server doesn't know about it and returns a 404.

## ✅ The Solution

Configure your development server and deployment platform to serve `index.html` for all routes, letting React Router handle the routing client-side.

## 🛠️ Configuration Files

### 1. **Vite Development Server** (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,  // ← This fixes dev server routing
  },
  preview: {
    historyApiFallback: true,  // ← This fixes preview server routing
  },
})
```

### 2. **Netlify Deployment** (`public/_redirects`)
```
# Netlify redirects for SPA routing
/*    /index.html   200
```

### 3. **Vercel Deployment** (`vercel.json`)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🚀 How It Works

1. **Development**: Vite's `historyApiFallback` tells the dev server to serve `index.html` for any route that doesn't match a file
2. **Production**: The redirect/rewrite rules tell the hosting platform to serve `index.html` for all routes
3. **Client-Side**: React Router takes over and renders the correct component based on the URL

## 📋 Testing

After making these changes:

1. **Restart your dev server**:
   ```bash
   npm run dev
   ```

2. **Test the routing**:
   - Navigate to `/sneaker/welcome-to-sneaker-chronicles`
   - Refresh the page (F5 or Ctrl+R)
   - The page should stay on the sneaker detail page instead of showing 404

3. **Test all routes**:
   - `/` (homepage)
   - `/sneaker/welcome-to-sneaker-chronicles`
   - `/sneaker/tom-sachs-mars-yard-overshoe-sole-swapped`
   - `/sneaker/nike-bionicle-sneaker-collaboration`

## 🌐 Deployment Platforms

### **Netlify**
- The `_redirects` file automatically handles SPA routing
- No additional configuration needed

### **Vercel**
- The `vercel.json` file handles SPA routing
- No additional configuration needed

### **GitHub Pages**
Add this to your `package.json` scripts:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### **Other Platforms**
Most hosting platforms support similar redirect/rewrite rules:
- **Firebase**: `firebase.json` with `"rewrites"` configuration
- **AWS S3**: CloudFront with custom error pages
- **Apache**: `.htaccess` with `RewriteRule`
- **Nginx**: `try_files` directive

## 🔧 Troubleshooting

### **Still getting 404s?**
1. Make sure you restarted the dev server after changing `vite.config.js`
2. Check that the redirect files are in the correct location
3. Verify your hosting platform supports the redirect configuration

### **Routes work in dev but not production?**
1. Check that your redirect files are being deployed
2. Verify the hosting platform configuration
3. Test with a simple route first

### **Performance concerns?**
- The redirect only happens on page refresh/direct navigation
- Normal client-side navigation is unaffected
- No performance impact on your app

## 📝 Notes

- This configuration is standard for all React Router applications
- The redirect rules are lightweight and don't affect performance
- Works with all React Router modes (BrowserRouter, HashRouter, etc.)
- Compatible with all the performance optimizations we implemented

Your Sneaker Chronicles app now has proper SPA routing that works in both development and production! 🎉
