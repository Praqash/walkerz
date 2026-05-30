# Walkerz payment setup

The website uses Razorpay Checkout for room booking payments.

## Environment variables

Local `.env.local` and Vercel Production need:

```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

`NEXT_PUBLIC_RAZORPAY_KEY_ID` is visible in the browser, which is expected for Razorpay Checkout. `RAZORPAY_KEY_SECRET` must stay server-side only.

## Test mode

The current integration works with Razorpay test keys. Use Razorpay test payment details from the Razorpay dashboard documentation to complete test transactions.

## How it works

1. The booking form sends room and stay details to `/api/razorpay/order`.
2. The API route calculates the total on the server and creates a Razorpay order.
3. Razorpay Checkout opens in the browser.
4. After payment, `/api/razorpay/verify` verifies the payment signature on the server.
5. The transaction summary appears only after successful verification.

## Going live

Before accepting real payments:

1. Complete Razorpay KYC.
2. Replace test keys with live keys in Vercel.
3. Redeploy the production site.
4. Make sure cancellation, refund, and booking confirmation policies are clearly documented for guests.
