/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROFILE PAGE — User Profile
 * User info, dashboard, statistics, achievements, settings
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { GlassCard } from '../../shared/components/atoms/GlassCard';

const Profile = () => {
  return (
    <div style={{ padding: 'var(--space-4)', paddingTop: 'calc(var(--space-6) + var(--safe-area-top))' }}>
      <GlassCard variant="glass-strong" padding="lg">
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
          👤 Profile
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          User profile with dashboard, statistics, and achievements coming soon...
        </p>
      </GlassCard>
    </div>
  );
};

export default Profile;
