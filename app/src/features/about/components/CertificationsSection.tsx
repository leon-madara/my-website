import type { CertificationItem } from "../about.types";
import { SectionTitle } from "./SectionTitle";
import { CertificationCard } from "./cards/CertificationCard";

export interface CertificationsSectionProps {
  title: string;
  items: CertificationItem[];
}

export function CertificationsSection({
  title,
  items
}: CertificationsSectionProps) {
  return (
    <section
      className="about-section certifications-section"
      data-reveal-section
      id="certifications-section"
    >
      <div className="section-content">
        <SectionTitle title={title} />
        <div className="certifications-grid">
          {items.map((item) => (
            <div
              className="certifications-grid__item"
              data-reveal-item
              key={item.title}
            >
              <CertificationCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
