# Navkar Blossom – Resident Registration (Phase 1)

Files: index.html, style.css, app.js, netlify.toml (no build step, no dependencies).

## Deploy
1. Naya GitHub repo banayein, in files ko repo ke root mein upload karein.
2. Netlify > Add new site > Import from GitHub > repo chunein. Build command khali, publish directory `.`
3. Deploy ke baad Site configuration > Forms: confirm karein "resident-registration" form detect hua hai.
4. Forms > Notifications: committee ke email par alert lagayein.
5. Site name set karein, phir us URL ka QR code banayein (QR sirf registration page kholta hai).
6. Pehle khud ek test submission karein aur Netlify > Forms > Submissions mein check karein.

## Limitations
- Netlify Forms free plan: 100 submissions/month, aur submissions Netlify dashboard mein rehti hain.
- Dashboard access sirf Netlify team members ko hai: sirf authorised committee members ko add karein.
- Spam: honeypot field laga hai; zarurat padi to Netlify ke reCAPTCHA option par jayein.
- Duplicate rokna: button disable hota hai aur same phone par dobara submit karne se pehle confirm poochta hai. Yeh server-side duplicate check nahi hai.
- Verification, search aur Excel export Phase 2 hain (Netlify se CSV download ho sakta hai).
- Local file (Notepad se open) par submission kaam nahi karegi; sirf Netlify par deploy hone ke baad.
