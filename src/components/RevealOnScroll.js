"use client";

import { useRef, useEffect, useState } from 'react';

/**
 * Клиентский компонент для анимации появления при скролле.
 * Принимает children — они server-рендерятся (HTML попадает в SSR),
 * а анимация reveal применяется уже на клиенте через IntersectionObserver.
 */
export default function RevealOnScroll({ children, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
    >
      {children}
    </div>
  );
}
