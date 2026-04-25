export const metadata = {
  title: "Terms of Service | Kredance",
  description: "Kredance terms of service — the terms and conditions governing use of our website and services.",
};

export default function TermsPage() {
  return (
    <div className="flex-1 bg-white">
      <section className="pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-neon-navy mb-8">Terms of Service</h1>
          <p className="text-sm text-wild-dove mb-12">Last updated: April 25, 2026</p>

          <div className="space-y-8 text-nebulosity/80 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Kredance website and services, you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">2. Services</h2>
              <p>
                Kredance provides digital agency services including but not limited to AI automation,
                web development, mobile app development, ecommerce solutions, SEO, and digital marketing.
                The specific scope of services will be outlined in individual project agreements.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">3. Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos, and software, is the property
                of Kredance and is protected by intellectual property laws. Upon full payment, clients
                receive ownership rights to deliverables as specified in their project agreement.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">4. Client Responsibilities</h2>
              <p>Clients agree to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Provide accurate and complete information necessary for project completion</li>
                <li>Respond to requests for feedback and approvals in a timely manner</li>
                <li>Make payments according to agreed-upon schedules</li>
                <li>Not use our services for any unlawful purpose</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">5. Payment Terms</h2>
              <p>
                Payment terms are specified in individual project proposals and agreements. Unless otherwise
                stated, invoices are due within 14 days of issuance. Late payments may incur additional fees.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">6. Limitation of Liability</h2>
              <p>
                Kredance shall not be liable for any indirect, incidental, special, or consequential damages
                arising from the use of our services. Our total liability shall not exceed the amount paid
                by the client for the specific service in question.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">7. Termination</h2>
              <p>
                Either party may terminate a project agreement with written notice. Upon termination,
                the client is responsible for payment of all work completed up to the termination date.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective
                immediately upon posting to this page. Continued use of our services constitutes
                acceptance of the updated terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neon-navy mb-3">9. Contact Us</h2>
              <p>
                If you have any questions about these terms, please contact us through our{" "}
                <a href="/contact" className="text-neon-navy underline hover:no-underline">contact page</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
