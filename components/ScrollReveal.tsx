'use client';
import { useInView } from 'react-intersection-observer';

export default function ScrollReveal({ children }: { children: React.ReactNode }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref} className={`reveal ${inView ? 'visible' : ''}`}>
      {children}
    </div>
  );
}
