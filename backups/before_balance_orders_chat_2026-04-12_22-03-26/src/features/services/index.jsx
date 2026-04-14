/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SERVICES PAGE — Services & Checkout
 * Service cards, cart system, checkout flow
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { GlassCard } from '../../shared/components/atoms/GlassCard';

const Services = () => {
  return (
    <div style={{ padding: 'var(--space-4)', paddingTop: 'calc(var(--space-6) + var(--safe-area-top))' }}>
      <GlassCard variant="glass-strong" padding="lg">
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
          💎 Services
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Premium services with cart system and checkout flow coming soon...
        </p>
      </GlassCard>
    </div>
  );
};

export default Services;
