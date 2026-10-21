// Keep the public guide catalog small: analytics imports its known route list.
export const guides = [
  {
    slug: "website-enquiry-checklist",
    path: "/guides/website-enquiry-checklist",
    title: "Plan a website that turns visitors into enquiries",
    description: "A practical website planning guide: clarify your offer, choose useful proof, simplify the enquiry form, and test the journey before launch.",
    category: "Websites",
    summary: "Turn a loose website brief into a clear offer, useful proof, and a next step your visitors can actually take.",
    outcome: "Leave with a one-page website brief.",
    published: "2026-10-21",
  },
  {
    slug: "facebook-lead-handoff-checklist",
    path: "/guides/facebook-lead-handoff-checklist",
    title: "From Facebook ad to enquiry: a handoff checklist",
    description: "Plan the journey from Facebook creative to a useful enquiry and a clear team handoff, with a checklist based on our Prime Metal Roofing project.",
    category: "Campaigns & automation",
    summary: "Connect the promise in your ad to the questions in your form and the person who will follow up.",
    outcome: "Leave with a campaign handoff checklist.",
    published: "2026-10-21",
  },
] as const;

export type Guide = (typeof guides)[number];
