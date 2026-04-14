/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DISCOVER PAGE — Premium Discovery Feed
 * Hero section, featured collections, trending works, personalized recommendations
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../core/state/store';
import { GlassCard } from '../../shared/components/atoms/GlassCard';
import { MagneticButton } from '../../shared/components/atoms/MagneticButton';
import { HolographicImage } from '../../shared/components/atoms/HolographicImage';
import { InfiniteScroll } from '../../shared/components/molecules/InfiniteScroll';

const Discover = () => {
  const settings = useAppStore((state) => state.settings);
  const favorites = useAppStore((state) => state.favorites);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [works, setWorks] = useState(generateMockWorks(20));
  const [loading, setLoading] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════
  // DATA
  // ═══════════════════════════════════════════════════════════════════════

  const categories = [
    { id: 'all', label: 'All', icon: '✨' },
    { id: 'avatars', label: 'Avatars', icon: '👤' },
    { id: 'previews', label: 'Previews', icon: '▶️' },
    { id: 'banners', label: 'Banners', icon: '🎨' },
    { id: 'logos', label: 'Logos', icon: '⭐' },
  ];

  const heroWork = {
    id: 'hero-1',
    title: 'Cyberpunk Avatar Collection',
    description: 'Neon-infused digital identities for the metaverse',
    image: 'https://picsum.photos/seed/hero1/1200/600',
    category: 'avatars',
    featured: true,
  };

  const collections = [
    {
      id: 'col-1',
      title: 'Neon Dreams',
      count: 12,
      thumbnail: 'https://picsum.photos/seed/col1/400/300',
      gradient: 'var(--gradient-cosmic)',
    },
    {
      id: 'col-2',
      title: 'Minimal Elegance',
      count: 8,
      thumbnail: 'https://picsum.photos/seed/col2/400/300',
      gradient: 'var(--gradient-cyan)',
    },
    {
      id: 'col-3',
      title: 'Dark Matter',
      count: 15,
      thumbnail: 'https://picsum.photos/seed/col3/400/300',
      gradient: 'var(--gradient-violet)',
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════════════

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setWorks((prev) => [...prev, ...generateMockWorks(10)]);
      setLoading(false);
    }, 1000);
  };

  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setWorks(generateMockWorks(20));
  };

  const filteredWorks = useMemo(() => {
    if (selectedCategory === 'all') return works;
    return works.filter((work) => work.category === selectedCategory);
  }, [works, selectedCategory]);

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-base)',
        paddingBottom: 'var(--bottom-nav-safe-height)',
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          padding: 'var(--space-4)',
          paddingTop: 'calc(var(--space-6) + var(--safe-area-top))',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <GlassCard
            variant="glass-strong"
            padding="none"
            hoverable
            glow
            parallax
            style={{ marginBottom: 'var(--space-6)' }}
          >
            <div
              style={{
                position: 'relative',
                height: '320px',
                overflow: 'hidden',
                borderRadius: 'var(--radius-2xl)',
              }}
            >
              {/* Background Image */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `url(${heroWork.image}) center/cover`,
                  filter: 'brightness(0.4)',
                }}
              />

              {/* Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'var(--gradient-cosmic)',
                  opacity: 0.6,
                  mixBlendMode: 'overlay',
                }}
              />

              {/* Content */}
              <div
                style={{
                  position: 'relative',
                  height: '100%',
                  padding: 'var(--space-6)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  zIndex: 1,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--weight-bold)',
                    color: 'var(--accent-200)',
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--tracking-wider)',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  ✨ Featured Work
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  style={{
                    fontSize: 'var(--text-4xl)',
                    fontWeight: 'var(--weight-black)',
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-2)',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: 'var(--tracking-tight)',
                    lineHeight: 'var(--leading-tight)',
                  }}
                >
                  {heroWork.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--space-4)',
                    maxWidth: '400px',
                  }}
                >
                  {heroWork.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <MagneticButton variant="primary" size="md" magnetic sound haptic>
                    View Project →
                  </MagneticButton>
                </motion.div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* Categories */}
      <section style={{ padding: '0 var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-2)',
            overflowX: 'auto',
            paddingBottom: 'var(--space-2)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-full)',
                border: `1px solid ${
                  selectedCategory === category.id ? 'var(--border-strong)' : 'var(--border-medium)'
                }`,
                background:
                  selectedCategory === category.id ? 'var(--glass-strong)' : 'var(--glass-light)',
                backdropFilter: 'blur(12px)',
                color:
                  selectedCategory === category.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--weight-semibold)',
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-out)',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1-5)',
                boxShadow:
                  selectedCategory === category.id ? 'var(--shadow-glow-sm)' : 'var(--shadow-sm)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section style={{ padding: '0 var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <h2
          style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-4)',
            fontFamily: 'var(--font-display)',
          }}
        >
          Curated Collections
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'var(--grid-columns-auto-md)',
            gap: 'var(--grid-gap-md)',
          }}
        >
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <GlassCard variant="glass" padding="none" hoverable clickable glow>
                <HolographicImage
                  src={collection.thumbnail}
                  alt={collection.title}
                  aspectRatio="4/3"
                  holographic
                  tilt
                  zoom
                />
                <div style={{ padding: 'var(--space-3)' }}>
                  <div
                    style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--weight-semibold)',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-1)',
                    }}
                  >
                    {collection.title}
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {collection.count} works
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Works Grid */}
      <section style={{ padding: '0 var(--space-4)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-4)',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Trending Works
          </h2>
          <div
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-tertiary)',
            }}
          >
            {filteredWorks.length} works
          </div>
        </div>

        <InfiniteScroll
          items={filteredWorks}
          renderItem={(work) => <WorkCard work={work} favorites={favorites} toggleFavorite={toggleFavorite} />}
          loadMore={handleLoadMore}
          hasMore={true}
          loading={loading}
          pullToRefresh
          onRefresh={handleRefresh}
          style={{ maxHeight: 'none' }}
        />
      </section>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// WORK CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const WorkCard = ({ work, favorites, toggleFavorite }) => {
  const isFavorite = favorites.includes(work.id);

  return (
    <GlassCard
      variant="glass"
      padding="none"
      hoverable
      clickable
      glow
      style={{ marginBottom: 'var(--space-3)' }}
    >
      <HolographicImage
        src={work.image}
        alt={work.title}
        aspectRatio="16/9"
        holographic
        tilt
        zoom
      />
      <div style={{ padding: 'var(--space-3)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-2)',
          }}
        >
          <div
            style={{
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--text-primary)',
            }}
          >
            {work.title}
          </div>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(work.id);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'var(--text-xl)',
            }}
          >
            {isFavorite ? '❤️' : '🤍'}
          </motion.button>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)',
          }}
        >
          <span>👁 {work.views}</span>
          <span>❤️ {work.likes}</span>
          <span
            style={{
              padding: 'var(--space-1) var(--space-2)',
              background: 'var(--glass-light)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {work.category}
          </span>
        </div>
      </div>
    </GlassCard>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

function generateMockWorks(count) {
  const categories = ['avatars', 'previews', 'banners', 'logos'];
  return Array.from({ length: count }, (_, i) => ({
    id: `work-${Date.now()}-${i}`,
    title: `Design Work ${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    views: Math.floor(Math.random() * 5000) + 100,
    likes: Math.floor(Math.random() * 500) + 10,
    image: `https://picsum.photos/seed/work${Date.now()}${i}/600/400`,
  }));
}

export default Discover;
