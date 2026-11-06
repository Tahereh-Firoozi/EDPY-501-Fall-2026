# EDPY 501 presentation signup

The student page is hosted on GitHub Pages. The booking API stores names privately in Cloudflare D1, because a static GitHub Pages page cannot reserve a slot for one person at a time or accept anonymous submissions safely. No student names or admin credentials are stored in this public repository. The instructor's export page downloads a real `.xlsx` workbook with presenter name, date, order, and submission timestamp.

## Deployment (instructor)

The page displays **Signup is not open yet** until this setup is complete. Do not share it before testing the booking service.

1. In a local checkout of this repository, open `presentation-signup/worker`. Install Node.js and run `npm install`. Authenticate with your own Cloudflare account using `npx wrangler login`. Do not share Cloudflare credentials in chat or commit them to GitHub.
2. Run `npx wrangler d1 create edpy501-presentation-signup`. Copy `wrangler.jsonc.example` to `wrangler.jsonc` and replace `REPLACE_WITH_YOUR_D1_DATABASE_ID` with the database ID returned by Cloudflare. Commit the configuration file if desired; a database ID is not a credential.
3. Run `npm run db:remote` to create the database table. Generate a private random export token, for example `openssl rand -hex 32`, and run `npx wrangler secret put ADMIN_TOKEN`. Paste the token into the prompt; never put it in the repository, a URL, or `config.js`. Store the token in your password manager.
4. Run `npm run deploy`. Cloudflare will show the deployed `https://...workers.dev` URL. Copy only that URL into `presentation-signup/config.js` as `window.EDPY501_SIGNUP_API`. Commit the updated public config file.
5. Open the student page on the public course site and verify available slots load. Test one booking using your own name, then delete that test booking with the authenticated D1 console or CLI before sharing the link. A booking is final; there is no student-facing edit control.
6. Open `presentation-signup/admin.html`, enter the private token, and verify the downloaded workbook opens in Excel. Only then share the student page in Canvas.

The API checks a unique database constraint on both slot and normalized name. It accepts the first completed request for each slot, even when two students submit at nearly the same time. The page does not display presenter names or the private schedule publicly. Students enter their full Canvas name; this is not Canvas authentication, so the instructor should review bookings for spelling or identity mistakes. The API accepts browser requests from the course site's custom domain or its GitHub Pages origin. If the course domain changes, update `allowedOrigins` in `worker/src/index.js`.

The site has ten positions on November 20 and nine on November 27. Each position allows nine minutes to present, two for Q&A, and three for peer feedback. Clock times remain unspecified until the instructor confirms the actual class start time.

The existing Jotform signup must be closed once this service is tested and before the GitHub link is shared, so students do not book in two places.
