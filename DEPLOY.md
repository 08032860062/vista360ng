# Deploy & Hosting Notes

These notes collect quick, low-cost deployment options for a pilot Vista360 service (500–1000 tours). Use the free stack for prototyping and scale into low-cost paid services as you need storage and bandwidth.

## Free Tools (Core Stack)
- **Cloudflare** — global CDN, DDoS protection, caching; useful to accelerate tour assets shared over WhatsApp and reduce bandwidth costs.
- **GitHub Pages** or **Netlify** — host static sites and frontend quickly. Netlify also supports serverless functions (Lambda) for authenticated uploads.
- **Firebase** — free tier supports Auth (agent logins) and Firestore for metadata (tour title, price, city, FCDA references, kuula link).
- **Marzipano** — open-source 360 viewer you can self-host; embeddable tours without licensing costs.
- **A-Frame** — WebVR framework for interactive tours and hotspots.

## Paid Essentials (Minimal Costs)
- **Backblaze B2** — cheap object storage (~$6/TB/mo). Good for 5–10TB of panoramas for 1000 tours.
- **Vercel / Netlify Pro** — $15–20/mo for production functions and increased bandwidth; auto-scales for agent uploads and site previews.
- **Domain (Namecheap)** — ~$10–15/year for a branded domain like `yourname.com`.

## Quickstart Workflow
1. Clone a Marzipano or A-Frame starter template.
2. Add Firebase Auth + Firestore to store tour metadata.
3. Compress panoramas with TinyPNG or Squoosh.
4. Upload images to Backblaze B2 (CLI or web UI) and store public URLs in Firestore.
5. Deploy the frontend to Netlify/Vercel with automatic builds on push.

## Scaling Tips
- Use Cloudflare to cache panorama requests and offload bandwidth to the CDN.
- Use resumable uploads (Tus or multipart) for larger panoramas to handle flaky networks.
- Monitor bandwidth and move hot assets to Cloudflare R2 or B2 with Cloudflare Workers when throughput grows.

## References
- Marzipano: https://www.marzipano.net/
- A-Frame: https://aframe.io/
- Backblaze B2: https://www.backblaze.com/b2/
- Netlify: https://www.netlify.com/
- Cloudflare: https://www.cloudflare.com/
