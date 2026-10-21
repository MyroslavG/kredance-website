import { createPageMetadata } from "@/lib/metadata";
export const metadata = createPageMetadata({
  path: "/privacy",
  title: "Privacy Policy | Kredance",
  description: "Kredance privacy policy — how we collect, use, and protect your personal information.",
});

export default function PrivacyPage() {
  return (
    <div className="flex-1 bg-white">
      <section className="pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-neon-navy mb-8">Privacy Policy</h1>
          <p className="text-sm text-wild-dove mb-12">Last updated: October 21, 2026</p>

          <div className="space-y-8 text-nebulosity/80 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you fill out a contact form,
                request a quote, or communicate with us via email. This may include your name, email address,
                phone number, company name, business website, and project details. For inquiries,
                we also record the entry page, referring website hostname, and campaign labels to understand
                how the inquiry reached us. We use a keyed hash of the network address to limit repeated submissions.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Respond to your inquiries and provide requested services</li>
                <li>Communicate with you about your inquiry or project; a website review request does not subscribe you to marketing emails</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">3. Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties.
                We may share information with trusted service providers who assist us in operating our
                website and conducting our business, provided they agree to keep this information confidential.
                Inquiries use Supabase for storage and EmailJS for notification
                emails. Optional call scheduling is handled by Calendly.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">4. Cookies and Tracking</h2>
              <p>
                Optional analytics and session recordings start only after you choose “Allow analytics”.
                Choose “Essential only” to decline, or change your choice using “Privacy settings” in the footer.
                Declining does not prevent you from sending an inquiry.
                We keep first-visit campaign information in session storage for the current browser tab.
                With your permission, Vercel Web Analytics and Speed Insights measure visits and performance,
                and our database records page views, service clicks, and form starts or errors. A random browser-tab
                session identifier expires after 30 minutes of inactivity and is stored as a keyed hash on the server.
                Our conversion events describe actions such as starting a form or completing a booking;
                they do not include your name, email address, website, or message. Query strings are removed
                from the URLs sent to Vercel Web Analytics.
              </p>
              <p className="mt-3">
                With your permission, Google Analytics measures visits, campaign sources, and completed
                inquiry submissions on our public production website. It uses analytics cookies to
                distinguish visits. We send only known public page paths, referring website origins,
                campaign labels, and fixed action or service labels; we do not send inquiry details,
                submission identifiers, URL query strings, or fragments. Advertising storage,
                advertising personalization, and Google Signals are disabled. The owner dashboard,
                preview sites, and visits labelled as internal or setup tests are excluded. See{" "}
                <a href="https://policies.google.com/privacy" className="underline" target="_blank" rel="noopener noreferrer">Google’s privacy policy</a>.
              </p>
              <p className="mt-3">With your permission, Microsoft Clarity provides heatmaps and masked session recordings to help us understand how visitors use the site. Inquiry forms are masked and the private dashboard is excluded. Clarity processes usage data for site analytics; advertising storage is disabled in our consent signal. See <a href="https://privacy.microsoft.com/privacystatement" className="underline" target="_blank" rel="noopener noreferrer">Microsoft’s privacy statement</a>. We record saved inquiries and their campaign source to handle your request even if you decline optional analytics.</p>
              <p className="mt-3">Owner sign-in uses an essential, secure session cookie lasting up to eight hours. Sign-in codes expire after ten minutes. We retain inquiry records to manage your request and client relationship; contact us to request deletion. The dashboard’s reporting period filters records and does not delete them.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">5. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction. However, no method of
                transmission over the internet is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">6. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information at any time.
                To exercise these rights, please contact us at the email address provided on our contact page.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">7. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. Any changes will be posted on this
                page with an updated revision date.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">8. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy, please contact us through our{" "}
                <a href="/contact" className="text-neon-navy underline hover:no-underline">contact page</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
