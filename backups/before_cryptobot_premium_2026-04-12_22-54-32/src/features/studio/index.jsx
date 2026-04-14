/**
 * ═══════════════════════════════════════════════════════════════════════════
 * STUDIO PAGE — AI Studio
 * Real AI integration, chat interface, idea generator
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { GlassCard } from '../../shared/components/atoms/GlassCard';

const Studio = () => {
  return (
    <div style={{ padding: 'var(--space-4)', paddingTop: 'calc(var(--space-6) + var(--safe-area-top))' }}>
      <GlassCard variant="glass-strong" padding="lg">
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
          ✨ AI Studio
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          AI-powered design assistant with chat interface and idea generation coming soon...
        </p>
      </GlassCard>
    </div>
  );
};

export default Studio;
