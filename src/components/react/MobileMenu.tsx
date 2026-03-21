import { useState } from 'react';

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  links: NavLink[];
  currentPath: string;
}

export default function MobileMenu({ links, currentPath }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={handleOpen}
        aria-label="Open navigation menu"
        aria-expanded={open}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div
        className={`mobile-menu-overlay${open ? ' open' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <nav className={`mobile-menu${open ? ' open' : ''}`} aria-label="Mobile navigation">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button
            onClick={handleClose}
            aria-label="Close navigation menu"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text)',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {links.map((link) => {
          const isActive =
            link.href === '/' ? currentPath === '/' : currentPath.startsWith(link.href);
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={handleClose}
              style={{
                display: 'block',
                padding: '0.75rem 0',
                fontSize: '1.1rem',
                fontWeight: isActive ? '600' : '400',
                color: isActive ? 'var(--accent)' : 'var(--text)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--border)',
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              {link.label}
            </a>
          );
        })}
      </nav>
    </>
  );
}
