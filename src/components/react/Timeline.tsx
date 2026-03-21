import { useState, useEffect, useRef } from 'react';

interface TimelineEntry {
  year: string;
  title: string;
  subtitle: string;
  details: string;
}

interface Props {
  entries: TimelineEntry[];
}

export default function Timeline({ entries }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 },
    );

    nodeRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const toggle = (i: number) => {
    setExpandedIndex(expandedIndex === i ? null : i);
  };

  return (
    <div className="timeline">
      <div className="timeline-line" />
      {entries.map((entry, i) => (
        <div
          key={i}
          ref={(el) => { nodeRefs.current[i] = el; }}
          className={`timeline-node scroll-reveal ${i % 2 === 0 ? 'left' : 'right'}`}
          onClick={() => toggle(i)}
          onKeyDown={(e) => { if (e.key === 'Enter') toggle(i); }}
          role="button"
          tabIndex={0}
          aria-expanded={expandedIndex === i}
        >
          <div className="timeline-dot" />
          <div className="timeline-content">
            <span className="timeline-year">{entry.year}</span>
            <h3 className="timeline-title">{entry.title}</h3>
            <p className="timeline-subtitle">{entry.subtitle}</p>
            {expandedIndex === i && (
              <p className="timeline-details">{entry.details}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
