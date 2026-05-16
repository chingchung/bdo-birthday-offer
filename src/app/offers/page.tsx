// /offers is no longer used — single-page design on homepage.
// Redirect to home.
import { redirect } from "next/navigation";

export default function OffersPage() {
  redirect("/");
}
