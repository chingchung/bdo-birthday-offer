import MainClient from "@/components/MainClient";
import { getOffers } from "@/lib/queries";

export default async function HomePage() {
  const offers = await getOffers();
  return <MainClient offers={offers} />;
}
