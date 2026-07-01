'use client';

interface DevisButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function DevisButton({ className = 'btn', style, children = 'Demander un devis' }: DevisButtonProps) {
  return (
    <button
      className={className}
      style={style}
      onClick={() => window.dispatchEvent(new Event('open-devis-modal'))}
    >
      {children}
    </button>
  );
}
