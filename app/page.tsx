"use server";
import dynamic from "next/dynamic";
const MapComponent = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default async function Home() {
  return (
    <div className="flex flex-col items-center gap-4">
      <MapComponent />
    </div>
  );
}
