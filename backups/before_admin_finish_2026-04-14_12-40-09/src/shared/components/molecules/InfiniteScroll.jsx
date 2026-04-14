/**
 * ═══════════════════════════════════════════════════════════════════════════
 * INFINITE SCROLL — Virtual Scrolling Component
 * Features: Virtual scrolling, skeleton states, pull-to-refresh, intersection observer
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const InfiniteScroll = ({
  items = [],
  renderItem,
  loadMore,
  hasMore = true,
  loading = false,
  threshold = 0.8,
  skeleton = null,
  skeletonCount = 3,
  emptyState = null,
  pullToRefresh = false,
  onRefresh,
  className = '',
  style = {},
  ...props
}) => {
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);

  // ═══════════════════════════════════════════════════════════════════════
  // INTERSECTION OBSERVER
  // ═══════════════════════════════════════════════════════════════════════

  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMore();
          }
        },
        { threshold }
      );

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, loadMore, threshold]
  );

  // ═══════════════════════════════════════════════════════════════════════
  // PULL TO REFRESH
  // ═══════════════════════════════════════════════════════════════════════

  const handleTouchStart = (e) => {
    if (!pullToRefresh || !onRefresh) return;
    const container = containerRef.current;
    if (container && container.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (!pullToRefresh || !onRefresh) return;
    const container = containerRef.current;
    if (container && container.scrollTop === 0 && touchStartY.current > 0) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - touchStartY.current;
      if (distance > 0) {
        setPullDistance(Math.min(distance, 100));
        setIsPulling(true);
      }
    }
  };

  const handleTouchEnd = async () => {
    if (!pullToRefresh || !onRefresh) return;
    if (pullDistance > 60) {
      await onRefresh();
    }
    setIsPulling(false);
    setPullDistance(0);
    touchStartY.current = 0;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // CLEANUP
  // ═══════════════════════════════════════════════════════════════════════

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <div
      ref={containerRef}
      className={`infinite-scroll ${className}`}
      style={{
        position: 'relative',
        overflowY: 'auto',
        ...style,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      {...props}
    >
      {/* Pull to refresh indicator */}
      {pullToRefresh && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: pullDistance,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--glass-medium)',
            backdropFilter: 'blur(12px)',
            zIndex: 10,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isPulling ? 1 : 0 }}
        >
          <motion.div
            animate={{ rotate: pullDistance > 60 ? 360 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              fontSize: 'var(--text-2xl)',
            }}
          >
            {pullDistance > 60 ? '🔄' : '⬇️'}
          </motion.div>
        </motion.div>
      )}

      {/* Empty state */}
      {items.length === 0 && !loading && emptyState}

      {/* Items */}
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <motion.div
              key={item.id || index}
              ref={isLast ? lastItemRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              {renderItem(item, index)}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Loading skeletons */}
      {loading && (
        <div>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={`skeleton-${index}`} style={{ marginBottom: 'var(--space-3)' }}>
              {skeleton || (
                <div
                  style={{
                    height: '120px',
                    background: 'var(--glass-light)',
                    borderRadius: 'var(--radius-xl)',
                    animation: 'shimmerSkeleton 2s infinite',
                    animationDelay: `${index * 0.1}s`,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* End message */}
      {!hasMore && items.length > 0 && (
        <div
          style={{
            padding: 'var(--space-6)',
            textAlign: 'center',
            color: 'var(--text-tertiary)',
            fontSize: 'var(--text-sm)',
          }}
        >
          No more items to load
        </div>
      )}
    </div>
  );
};
