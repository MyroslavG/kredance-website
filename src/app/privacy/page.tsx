export const metadata = {
  title: "Privacy Policy | Kredance",
  description: "Kredance privacy policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="flex-1 bg-white">
      <section className="pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-neon-navy mb-8">Privacy Policy</h1>
          <p className="text-sm text-wild-dove mb-12">Last updated: April 25, 2026</p>

          <div className="space-y-8 text-nebulosity/80 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you fill out a contact form,
                request a quote, or communicate with us via email. This may include your name, email address,
                phone number, company name, and project details.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Respond to your inquiries and provide requested services</li>
                <li>Communicate with you about projects, updates, and promotions</li>
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
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">4. Cookies and Tracking</h2>
              <p>
                Our website may use cookies and similar tracking technologies to enhance your browsing
                experience and analyze site traffic. You can control cookie preferences through your
                browser settings.
              </p>
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
