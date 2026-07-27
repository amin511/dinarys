# WooCommerce API Setup Guide

## Adding Environment Variables to Your Vercel Project

To connect your LEILA e-commerce store to your WooCommerce API, you need to add three environment variables to your Vercel project.

### Step 1: Open Vercel Dashboard
1. Go to your Vercel project dashboard
2. Click on **Settings** in the top navigation
3. Select **Environment Variables** from the left sidebar

### Step 2: Add Each Variable

Click **Add New** for each variable and enter the following:

#### Variable 1: WOOCOMMERCE_STORE_URL
- **Name:** WOOCOMMERCE_STORE_URL
- **Value:** https://khaki-armadillo-621767.hostingersite.com
- **Environment:** Production, Preview, Development (select all)

#### Variable 2: WOOCOMMERCE_CONSUMER_KEY
- **Name:** WOOCOMMERCE_CONSUMER_KEY
- **Value:** ck_2257526fafa995a7d5d7fe02c46dbe1a42de245e
- **Environment:** Production, Preview, Development (select all)

#### Variable 3: WOOCOMMERCE_CONSUMER_SECRET
- **Name:** WOOCOMMERCE_CONSUMER_SECRET
- **Value:** cs_af4a042c6bfb24c5c162360e1edecb3a3730d3c9
- **Environment:** Production, Preview, Development (select all)

#### Variable 4: ECOTRACK_API_TOKEN
- **Name:** ECOTRACK_API_TOKEN
- **Value:** your Ecotrack / H24 Delivery API token
- **Environment:** Production, Preview, Development (select all)
- Delivery prices are read from this carrier. **Never** name it `NEXT_PUBLIC_*` — that
  would ship the token to every visitor's browser.

#### Variable 5: ECOTRACK_FEES_URL (optional)
- **Name:** ECOTRACK_FEES_URL
- **Value:** https://h24delivery.ecotrack.dz/api/v1/get/fees
- Defaults to the URL above if unset. Only set it if the carrier changes the endpoint.

#### Variable 6: SHIPPING_SYNC_SECRET
- **Name:** SHIPPING_SYNC_SECRET
- **Value:** a long random string — generate one with
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Protects the manual price-refresh URL. If it is unset the sync endpoint refuses to run
  at all, so it is never left open.

### Step 3: Redeploy
After adding the variables, click the **Redeploy** button on your Vercel dashboard to apply the changes.

### Step 4: Verify
Once redeployed, visit your site and the products from your WooCommerce store should load automatically on the homepage.

## Troubleshooting

If products still don't load after adding environment variables:
1. Check the browser console for any error messages
2. Verify the credentials are correct in your WooCommerce dashboard (WooCommerce → Settings → Advanced → REST API)
3. Ensure your WooCommerce store allows REST API access
4. Check that the products in your WooCommerce store are published and visible
