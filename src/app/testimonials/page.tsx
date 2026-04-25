import { Testimonials } from "@/components/testimonials";

export const metadata = {
  title: "Testimonials | Kredance",
  description: "Hear what our clients have to say about working with Kredance on their digital transformation projects.",
};

export default function TestimonialsPage() {
  return (
    <div className="flex-1 bg-white">
      <Testimonials />
    </div>
  );
}
