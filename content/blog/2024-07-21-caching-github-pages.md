+++
title = "Caching Github Pages"
+++

When hosting static websites with GitHub Pages, you might encounter performance issues due to the default caching policy. GitHub Pages sets `Cache-Control: max-age=600`, which means browsers will cache the site for 10 minutes. This can be problematic if your site is heavy or doesn’t update often. Fortunately, you can use Cloudflare DNS to improve caching and enhance your site's performance.

## Why Cache GitHub Pages?

Caching is crucial for optimizing the performance of your website. By extending the cache duration, you reduce the number of requests to your server (Github in this case), speeding up load times for returning visitors. This is particularly beneficial for static sites that don’t change frequently, as it allows users to access the cached content quickly without unnecessary re-fetching.

## Setting Up Cloudflare with GitHub Pages

I'll assume that you already have a GitHub Pages site set up with a custom domain using Cloudflare DNS.


###  Configure Caching Settings

1. **Access Caching Settings**: Go to the Caching tab in the Cloudflare dashboard.
2. **Custom Cache Rules**: Set up custom cache rules to extend the cache duration.
    - Navigate to the “Caching” section and select “Configuration.”
    - Under “Page Rules,” create a new rule.
    - Enter your GitHub Pages domain (e.g., `yourdomain.com/*`).
    - Set the cache level to “Cache Everything.”
    - Set the `Edge Cache TTL` (time to live) to your preferred duration. For static sites, you might set this to a month or longer.

### Step 4: Purge Cache When Needed

Whenever you make updates to your site, you’ll need to purge the Cloudflare cache to ensure visitors receive the latest content. This can be done manually from the Cloudflare dashboard under the “Caching” section by clicking “Purge Everything.”

## Conclusion

By leveraging Cloudflare’s caching capabilities, you can significantly improve the performance of your GitHub Pages site. Extending the cache duration reduces server load and provides a faster, smoother experience for your visitors. Remember to purge the cache when you update your site to ensure that the latest content is always served.
