'use client';

import { useEffect, useRef, useState } from 'react';

export default function Stats() {
  const stats = [
    { count: 50, label: 'Collaborateurs' },
    { count: 15, label: "Années d'expérience" },
    { count: 50, label: 'Projets réalisés' },
    { count: 30, label: 'Clients satisfaits' },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, i) => (
        <StatItem key={i} count={stat.count} label={stat.label} />
      ))}
    </div>
  );
}

function StatItem({ count, label }: { count: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || animated.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animated.current = true;
            const duration = 2000;
            const start = performance.now();
            const animate = (now: number) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setDisplay(Math.floor(eased * count));
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [count]);

  return (
    <div className="stat-item" ref={ref}>
      <h3 className="stat-number">{display}</h3>
      <p>{label}</p>
    </div>
  );
}
