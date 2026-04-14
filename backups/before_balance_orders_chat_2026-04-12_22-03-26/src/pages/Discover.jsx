/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DISCOVER PAGE — Main Discovery Feed
 * Curated gallery, collections, hero works, AI-powered search
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo, useCallback } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const Discover = ({ user, settings, showToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid | list

  // Mock data (replace with real data)
  const categories = [
    { id: 'all', label: settings.language === 'en' ? 'All' : 'Все', icon: '✨' },
    { id: 'avatars', label: settings.language === 'en' ? 'Avatars' : 'Аватарки', icon: '👤' },
    { id: 'previews', label: settings.language === 'en' ? 'Previews' : 'Превью', icon: '▶️' },
    { id: 'banners', label: settings.language === 'en' ? 'Banners' : 'Баннеры', icon: '🎨' },
    { id: 'logos', label: settings.language === 'en' ? 'Logos' : 'Логотипы', icon: '⭐' },
  ];

  const heroWork = {
    id: 'hero-1',
    title: 'Cyberpunk Avatar Collection',
    description: 'Neon-infused digital identities',
    image: '/images/hero-work.jpg',
    category: 'avatars',
    featured: true,
  };

  const collections = [
    {
      id: 'col-1',
      title: settings.language === 'en' ? 'Neon Dreams' : 'Неоновые мечты',
      count: 12,
      thumbnail: '/images/collection-1.jpg',
    },
    {
      id: 'col-2',
      title: settings.language === 'en' ? 'Minimal Elegance' : 'Минимальная элегантность',
      count: 8,
      thumbnail: '/images/collection-2.jpg',
    },
  ];

  const works = useMemo(() => {
    // Mock works data
    return Array.from({ length: 20 }, (_, i) => ({
      id: `work-${i}`,
      title: `Design Work ${i + 1}`,
      category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id,
      views: Math.floor(Math.random() * 5000) + 100,
      likes: Math.floor(Math.random() * 500) + 10,
      image: `https://picsum.photos/seed/${i}/600/400`,
    }));
  }, []);

  const filteredWorks = useMemo(() => {
    return works.filter(work => {
      const matchesCategory = selectedCategory === 'all' || work.category === selectedCategory;
      const matchesSearch = !searchQuery || work.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [works, selectedCategory, searchQuery]);

  const handleCategoryChange = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
  }, []);

  return (
    <div style={{
      padding: 'var(--space-4)',
      paddingTop: 'calc(var(--space-4) + var(--safe-area-top))',
    }}>
      {/* Hero Section */}
      <Card
        variant="gradient"
        padding="none"
        hoverable
        glow
        style={{ marginBottom: 'var(--space-6)' }}
        className="animate-fade-in-up"
      >
        <div style={{
          position: 'relative',
          height: '280px',
          overflow: 'hidden',
          borderRadius: 'var(--radius-2xl)',
        }}>
          {/* Hero Image */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, var(--accent-900) 0%, var(--secondary-900) 100%)',
            opacity: 0.9,
          }} />

          {/* Hero Content */}
          <div style={{
            position: 'relative',
            height: '100%',
            padding: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            zIndex: 1,
          }}>
            <div style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--accent-200)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wider)',
              marginBottom: 'var(--space-2)',
            }}>
              {settings.language === 'en' ? 'Featured Work' : 'Избранная работа'}
            </div>
            <h1 style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--weight-black)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-2)',
              fontFamily: 'var(--font-display)',
              letterSpacing: 'var(--tracking-tight)',
            }}>
              {heroWork.title}
            </h1>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-4)',
            }}>
              {heroWork.description}
            </p>
            <Button variant="primary" size="md">
              {settings.language === 'en' ? 'View Project' : 'Смотреть проект'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Search */}
      <div style={{ marginBottom: 'var(--space-4)' }} className="animate-fade-in-up animate-delay-1">
        <Input
          type="search"
          placeholder={settings.language === 'en' ? 'Search works...' : 'Поиск работ...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          }
          fullWidth
        />
      </div>

      {/* Categories */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-2)',
        overflowX: 'auto',
        marginBottom: 'var(--space-6)',
        paddingBottom: 'var(--space-2)',
      }} className="animate-fade-in-up animate-delay-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${selectedCategory === category.id ? 'var(--border-strong)' : 'var(--border-medium)'}`,
              background: selectedCategory === category.id
                ? 'var(--glass-strong)'
                : 'var(--glass-light)',
              color: selectedCategory === category.id
                ? 'var(--text-primary)'
                : 'var(--text-secondary)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-semibold)',
              cursor: 'pointer',
              transition: 'all var(--duration-fast) var(--ease-out)',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1-5)',
            }}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Collections */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--weight-bold)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-4)',
          fontFamily: 'var(--font-display)',
        }}>
          {settings.language === 'en' ? 'Curated Collections' : 'Кураторские коллекции'}
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 'var(--space-3)',
        }}>
          {collections.map((collection, index) => (
            <Card
              key={collection.id}
              variant="glass"
              padding="none"
              hoverable
              clickable
              className={`animate-fade-in-up animate-delay-${index + 3}`}
            >
              <div style={{
                height: '120px',
                background: 'var(--glass-medium)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--space-2)',
              }} />
              <div style={{ padding: 'var(--space-3)' }}>
                <div style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--weight-semibold)',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-1)',
                }}>
                  {collection.title}
                </div>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-tertiary)',
                }}>
                  {collection.count} {settings.language === 'en' ? 'works' : 'работ'}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Works Grid */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-4)',
        }}>
          <h2 style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
          }}>
            {settings.language === 'en' ? 'All Works' : 'Все работы'}
          </h2>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-tertiary)',
          }}>
            {filteredWorks.length} {settings.language === 'en' ? 'works' : 'работ'}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: viewMode === 'grid'
            ? 'repeat(auto-fill, minmax(160px, 1fr))'
            : '1fr',
          gap: 'var(--space-3)',
        }}>
          {filteredWorks.map((work, index) => (
            <Card
              key={work.id}
              variant="glass"
              padding="none"
              hoverable
              clickable
              className={`animate-fade-in-up animate-delay-${Math.min(index, 8)}`}
            >
              <div style={{
                height: viewMode === 'grid' ? '120px' : '200px',
                background: 'var(--glass-medium)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--space-2)',
              }} />
              <div style={{ padding: 'var(--space-3)' }}>
                <div style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--weight-semibold)',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-1)',
                }}>
                  {work.title}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-tertiary)',
                }}>
                  <span>👁 {work.views}</span>
                  <span>❤️ {work.likes}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;
