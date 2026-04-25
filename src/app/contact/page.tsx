import { Contact } from "@/components/contact";

export const metadata = {
  title: "Contact | Kredance",
  description: "Get in touch with Kredance. Tell us about your project and we'll get back to you within 24 hours.",
};

export default function ContactPage() {
  return (
    <div className="flex-1 bg-nebulosity">
      <Contact />
    </div>
  );
}
