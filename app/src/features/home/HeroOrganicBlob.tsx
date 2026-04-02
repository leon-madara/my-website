export type HeroOrganicBlobVariant = "top-left" | "right-red" | "mid-green";

interface HeroOrganicBlobProps {
  variant: HeroOrganicBlobVariant;
}

export function HeroOrganicBlob({ variant }: HeroOrganicBlobProps) {
  return (
    <span
      aria-hidden="true"
      className={`hero-organic-blob hero-organic-blob--${variant}`}
    />
  );
}

