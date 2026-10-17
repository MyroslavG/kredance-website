import { createPageMetadata } from "@/lib/metadata";
import { Contact } from "@/components/contact";

export const metadata = createPageMetadata({
  path: "/contact",
  title: "Contact | Kredance",
  description: "Tell Kredance about your project or request a free website review. We'll reply within one business day.",
});

export default function ContactPage() {
  return (
    <div className="flex-1 bg-nebulosity">
      <Contact />
    </div>
  );
}
