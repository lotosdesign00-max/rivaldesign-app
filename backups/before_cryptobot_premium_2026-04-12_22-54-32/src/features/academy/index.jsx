/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ACADEMY PAGE — Learning Platform
 * Course catalog, video player, progress tracking, quiz system
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { GlassCard } from '../../shared/components/atoms/GlassCard';

const Academy = () => {
  return (
    <div style={{ padding: 'var(--space-4)', paddingTop: 'calc(var(--space-6) + var(--safe-area-top))' }}>
      <GlassCard variant="glass-strong" padding="lg">
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
          📚 Academy
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Complete learning platform with courses, video player, and progress tracking coming soon...
        </p>
      </GlassCard>
    </div>
  );
};

export default Academy;
