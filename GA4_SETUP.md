# Google Analytics 4 (GA4) Setup Guide

This guide explains how to set up and use Google Analytics 4 tracking in your Sneaker Chronicles app.

## 🚀 Quick Setup

### 1. Get Your GA4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property or use an existing one
3. Go to **Admin** → **Data Streams** → **Web**
4. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### 2. Update Configuration

Replace `GA_MEASUREMENT_ID` in these files with your actual Measurement ID:

**File: `index.html`**
```html
<!-- Replace GA_MEASUREMENT_ID with your actual GA4 Measurement ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_MEASUREMENT_ID');
</script>
```

**File: `src/config/ga4.js`**
```javascript
export const GA4_CONFIG = {
  MEASUREMENT_ID: 'YOUR_MEASUREMENT_ID', // Replace this
  DEBUG_MODE: process.env.NODE_ENV === 'development',
};
```

## 📊 What's Being Tracked

### Automatic Tracking
- **Page Views**: Every route change in your React app
- **Sneaker Card Clicks**: When users click on sneaker cards on the homepage
- **External Link Clicks**: Instagram, YouTube, and eBay links

### Event Categories
- `engagement`: Sneaker card clicks
- `social_media`: Instagram and YouTube links
- `ecommerce`: eBay links
- `outbound`: General external links

## 🔧 Implementation Details

### Components Created

1. **`TrackableLink`** (`src/components/TrackableLink.jsx`)
   - Replaces regular `<a>` tags for external links
   - Automatically tracks clicks with GA4

2. **`useGA4` Hook** (`src/hooks/useGA4.js`)
   - Custom React hook for GA4 functionality
   - Handles page view tracking
   - Provides event tracking functions

3. **GA4 Config** (`src/config/ga4.js`)
   - Centralized configuration
   - Helper functions for GA4 availability

### Usage Examples

**Track a custom event:**
```javascript
import { useGA4 } from './hooks/useGA4';

function MyComponent() {
  const { trackEvent } = useGA4();

  const handleCustomAction = () => {
    trackEvent('custom_action', {
      event_category: 'user_interaction',
      event_label: 'button_clicked',
    });
  };
}
```

**Use TrackableLink for external links:**
```javascript
import TrackableLink from './components/TrackableLink';

<TrackableLink
  href="https://example.com"
  eventCategory="social_media"
  eventLabel="Instagram"
>
  Visit Instagram
</TrackableLink>
```

## 🎯 GA4 Dashboard

Once set up, you can view your data in the Google Analytics dashboard:

1. **Real-time Reports**: See live user activity
2. **Events**: View all tracked events
3. **Engagement**: Track user interactions
4. **Acquisition**: See how users find your site

### Key Metrics to Monitor
- **Page Views**: Most popular sneaker posts
- **Sneaker Clicks**: Which sneakers get the most interest
- **External Link Clicks**: Which platforms drive the most engagement
- **User Flow**: How users navigate through your site

## 🛠️ Development vs Production

- **Development**: GA4 is disabled by default in development mode
- **Production**: Full tracking is enabled

To test in development, temporarily set `DEBUG_MODE: true` in `src/config/ga4.js`.

## 🔍 Troubleshooting

### GA4 Not Working?
1. Check that your Measurement ID is correct
2. Verify the gtag script is loading in browser dev tools
3. Check the Network tab for GA4 requests
4. Use GA4 DebugView for real-time event testing

### Events Not Showing?
- Events may take 24-48 hours to appear in reports
- Use GA4 DebugView for immediate verification
- Check browser console for any JavaScript errors

## 📈 Advanced Features

### Custom Dimensions (Optional)
You can add custom dimensions to track additional data:

```javascript
// In your tracking calls
trackEvent('sneaker_click', {
  event_category: 'engagement',
  event_label: sneakerTitle,
  sneaker_id: sneakerId,
  sneaker_brand: 'Nike', // Custom dimension
  sneaker_price: '$150', // Custom dimension
});
```

### Enhanced Ecommerce (Optional)
For more detailed ecommerce tracking:

```javascript
// Track purchase intent
trackEvent('begin_checkout', {
  event_category: 'ecommerce',
  currency: 'USD',
  value: 150.00,
  items: [{
    item_id: sneakerId,
    item_name: sneakerTitle,
    category: 'Sneakers',
    quantity: 1,
    price: 150.00
  }]
});
```

## 🎉 You're All Set!

Your Sneaker Chronicles app now has comprehensive GA4 tracking. Monitor your analytics dashboard to understand user behavior and optimize your content accordingly!
