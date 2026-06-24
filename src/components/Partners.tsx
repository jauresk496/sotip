import type { Partner } from '@/types';

export default function Partners({ partners }: { partners: Partner[] }) {
  if (!partners.length) return null;

  return (
    <div className="partners-carousel-wrap">
      <div className="partners-track">
        <div className="partners-slide">
          {[...partners, ...partners].map((p, i) => (
            <div key={i} className="partner-logo">
              <img src={p.image} alt={p.name} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
