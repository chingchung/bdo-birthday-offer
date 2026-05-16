// Offer detail is handled via modal on homepage.
// This route redirects back to home.
import { redirect } from "next/navigation";
import { MOCK_OFFERS } from "@/lib/mock-data";

export async function generateStaticParams() {
  return MOCK_OFFERS.map((o) => ({ id: o.id }));
}

export default function OfferDetailPage() {
  redirect("/");
}
