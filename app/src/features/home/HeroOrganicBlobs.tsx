import { HeroOrganicBlob } from "./HeroOrganicBlob";

export function HeroOrganicBlobs() {
  return (
    <div aria-hidden="true" className="hero-organic-blobs">
      <HeroOrganicBlob variant="top-left" />
      <HeroOrganicBlob variant="right-red" />
      <HeroOrganicBlob variant="mid-green" />
    </div>
  );
}

