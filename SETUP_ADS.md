# Ad Integration Setup Guide

This guide will help you set up ads in The Ultimate Bible Quizzing Game.

## 📋 Table of Contents
1. [Google AdSense Setup](#google-adsense-setup) ⭐ Recommended
2. [Google AdMob Setup](#google-admob-setup)
3. [Media.net Setup](#medianet-setup)
4. [Other Ad Networks](#other-ad-networks)
5. [Testing Ads](#testing-ads)

---

## 🎯 Google AdSense Setup (Recommended)

**Best for:** Web apps, PWAs, websites
**Revenue:** High
**Approval:** 1-2 weeks

### Step 1: Sign Up
1. Go to https://www.google.com/adsense
2. Click "Get Started"
3. Enter your website URL (your deployed Vercel URL)
4. Enter your email and submit

### Step 2: Add AdSense Code
1. After signing up, you'll get a code like:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"></script>
   ```
2. Copy the `ca-pub-XXXXXXXXXXXXXXXX` part
3. In Softgen, go to **Settings → Environment** tab
4. Add this environment variable:
   ```
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
   ```

### Step 3: Create Ad Units
1. In AdSense dashboard, go to "Ads" → "By ad unit"
2. Click "Display ads"
3. Name it "Bottom Banner" (or any name)
4. Choose ad size (Responsive recommended)
5. Click "Create"
6. Copy the **ad slot ID** (looks like: `1234567890`)
7. Add to environment variables:
   ```
   NEXT_PUBLIC_AD_SLOT_BOTTOM=1234567890
   ```

### Step 4: Deploy and Wait
1. Click "Publish" in Softgen to deploy
2. Go back to AdSense and verify your site
3. Wait 1-2 weeks for approval
4. Once approved, ads will automatically appear!

---

## 📱 Google AdMob Setup

**Best for:** Mobile apps, PWAs on mobile
**Revenue:** Very High for mobile
**Approval:** 1-3 days

### Step 1: Sign Up
1. Go to https://admob.google.com
2. Sign up with Google account
3. Click "Add App"
4. Select "App is listed on a supported app store" → No
5. Enter app name: "The Ultimate Bible Quizzing Game"
6. Select platform: "Android" or "iOS"

### Step 2: Create Ad Units
1. After creating app, click "Ad Units"
2. Select "Banner" for bottom ads
3. Name it and click "Create ad unit"
4. Copy the **App ID** and **Ad Unit ID**

### Step 3: Add to Environment
```
NEXT_PUBLIC_ADMOB_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_AD_SLOT_BOTTOM=ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
```

### Step 4: Deploy
1. Click "Publish" in Softgen
2. Ads will appear immediately (no waiting for approval)

---

## 💰 Media.net Setup

**Best for:** Alternative to AdSense
**Revenue:** Medium-High
**Approval:** 1-2 weeks

### Step 1: Sign Up
1. Go to https://www.media.net
2. Click "Sign Up"
3. Enter your details and website URL

### Step 2: Get Ad Code
1. After approval, go to "Setup" → "Ad Units"
2. Create a new ad unit
3. Copy the ad code (looks like):
   ```html
   <div id="123456789">
     <script>...</script>
   </div>
   ```

### Step 3: Add Custom Ad
In your pages, import and use:
```typescript
import { AdBanner } from "@/components/AdBanner";

<AdBanner 
  network="custom"
  customAdHtml='<div id="123456789">YOUR_AD_CODE_HERE</div>'
/>
```

---

## 🌐 Other Ad Networks

### PropellerAds
1. Sign up at https://propellerads.com
2. Get ad code
3. Use `customAdHtml` prop

### Ezoic
1. Sign up at https://www.ezoic.com
2. Add your site
3. Follow their integration guide

### Adsterra
1. Sign up at https://adsterra.com
2. Create ad zone
3. Use `customAdHtml` prop

---

## 🧪 Testing Ads

### Development Mode
- Ads show as **placeholders** in development
- This prevents invalid clicks during testing

### Production Testing
1. Deploy to Vercel (click "Publish")
2. Visit your live site
3. Ads should appear (if approved and configured)

### Troubleshooting
- **Ads not showing?** 
  - Check environment variables are set
  - Verify AdSense approval status
  - Check browser console for errors
  - Make sure you're on production URL (not localhost)

- **"Ad slot not found" error?**
  - Double-check your ad slot ID
  - Make sure environment variable name matches

- **Ads showing but not earning?**
  - Don't click your own ads (violates policy)
  - Wait 24-48 hours for data to appear
  - Check AdSense "Reports" section

---

## 💡 Best Practices

### 1. Don't Overdo It
- Current setup: 1 ad per page (bottom banner)
- This is optimal for user experience
- Too many ads = lower revenue

### 2. Ad Placement
The app already has ads in optimal positions:
- ✅ Bottom of each page (above navigation)
- ✅ Not covering content
- ✅ Not interfering with gameplay

### 3. Invalid Clicks
- ❌ Never click your own ads
- ❌ Don't ask friends/family to click
- ❌ Don't use bots or auto-clickers
- ⚠️ Violation = Account termination

### 4. Revenue Optimization
- Use responsive ad format (already configured)
- Enable auto ads in AdSense (optional)
- Monitor performance in AdSense dashboard
- Test different ad placements (A/B testing)

---

## 📊 Expected Revenue

### Factors That Affect Revenue:
- **Traffic:** More users = more revenue
- **Geography:** US/UK/Canada users pay more
- **Engagement:** Longer sessions = more ad views
- **Ad Format:** Video ads pay most, display ads less

### Rough Estimates (Google AdSense):
- **100 daily users:** $1-5/day
- **500 daily users:** $5-25/day
- **1,000 daily users:** $10-50/day
- **10,000 daily users:** $100-500/day

*Note: These are estimates. Actual revenue varies greatly.*

---

## 🚀 Quick Start (AdSense)

**Fastest way to start earning:**

1. **Sign up:** https://www.google.com/adsense
2. **Add environment variables in Softgen Settings:**
   ```
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
   NEXT_PUBLIC_AD_SLOT_BOTTOM=1234567890
   ```
3. **Deploy:** Click "Publish" button
4. **Verify:** Submit site for review in AdSense
5. **Wait:** 1-2 weeks for approval
6. **Earn:** Ads appear automatically after approval! 💰

---

## ❓ Need Help?

- **AdSense Help:** https://support.google.com/adsense
- **AdMob Help:** https://support.google.com/admob
- **Media.net Help:** https://www.media.net/support

Good luck with your monetization! 🎉