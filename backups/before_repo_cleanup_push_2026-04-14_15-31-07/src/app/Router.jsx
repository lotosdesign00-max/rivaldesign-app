/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ROUTER SYSTEM
 * Page navigation with animations
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { Suspense, lazy, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '../state/store';

// ═══════════════════════════════════════════════════════════════════════
// LAZY LOADED PAGES
// ═══════════════════════════════════════════════════════════════════════

const Discover = lazy(() => import('../features/discover'));
const Gallery = lazy(() => import('../features/gallery'));
const Studio = lazy(() => import('../features/studio'));
const Academy = lazy(() => import('../features/academy'));
const Services = lazy(() => import('../features/services'));
const Profile = lazy(() => import('../features/profile'));
const Balance = lazy(() => import('../features/balance'));
const Orders = lazy(() => import('../features/orders'));
const OrderChat = lazy(() => import('../features/chat/OrderChat'));
const Admin = lazy(() => import('../features/admin'));

// ═══════════════════════════════════════════════════════════════════════
// ROUTES CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════

const ROUTES = {
  discover: Discover,
  gallery: Gallery,
  studio: Studio,
  academy: Academy,
  services: Services,
  profile: Profile,
  balance: Balance,
  orders: Orders,
  admin: Admin,
};

// ═══════════════════════════════════════════════════════════════════════
// PAGE SKELETON LOADER
// ═══════════════════════════════════════════════════════════════════════

const PageSkeleton = () => (
  <div
    style={{
      padding: 'var(--space-4)',
      paddingTop: 'calc(var(--space-4) + var(--safe-area-top))',
    }}
  >
    {/* Hero skeleton */}
    <div
      style={{
        height: '280px',
        background: 'var(--glass-medium)',
        borderRadius: 'var(--radius-2xl)',
        marginBottom: 'var(--space-6)',
        animation: 'shimmerSkeleton 2s infinite',
      }}
    />

    {/* Content skeletons */}
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        style={{
          height: '120px',
          background: 'var(--glass-light)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: 'var(--space-3)',
          animation: 'shimmerSkeleton 2s infinite',
          animationDelay: `${i * 0.1}s`,
        }}
      />
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// PAGE TRANSITION VARIANTS
// ═══════════════════════════════════════════════════════════════════════

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// ROUTER COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export const Router = () => {
  const currentTab = useAppStore((state) => state.currentTab);
  const [chatOrder, setChatOrder] = useState(null);

  const handleOpenChat = (order) => {
    setChatOrder(order);
  };

  const handleCloseChat = () => {
    setChatOrder(null);
  };

  const handleOrderCreated = (order) => {
    // Switch to orders page after creating an order
    useAppStore.getState().setCurrentTab('orders');
  };

  const Component = ROUTES[currentTab] || ROUTES.discover;

  // Render Orders with chat callback
  const renderComponent = () => {
    if (currentTab === 'orders') {
      return <Component onOpenChat={handleOpenChat} />;
    }
    if (currentTab === 'services') {
      return <Component onOrderCreated={handleOrderCreated} />;
    }
    if (currentTab === 'admin') {
      return <Component onOpenChat={handleOpenChat} />;
    }
    return <Component />;
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{
            minHeight: 'calc(100vh - var(--bottom-nav-safe-height))',
            position: 'relative',
          }}
        >
          <Suspense fallback={<PageSkeleton />}>
            {renderComponent()}
          </Suspense>
        </motion.div>
      </AnimatePresence>

      {/* Order Chat Overlay */}
      <AnimatePresence>
        {chatOrder && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 2000,
            }}
          >
            <Suspense fallback={<PageSkeleton />}>
              <OrderChat order={chatOrder} onClose={handleCloseChat} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// NAVIGATION HELPER
// ═══════════════════════════════════════════════════════════════════════

export const useNavigation = () => {
  const setCurrentTab = useAppStore((state) => state.setCurrentTab);
  const pushNavigation = useAppStore((state) => state.pushNavigation);
  const popNavigation = useAppStore((state) => state.popNavigation);
  const navigationHistory = useAppStore((state) => state.navigationHistory);

  const navigate = (tab) => {
    pushNavigation(tab);
    setCurrentTab(tab);
  };

  const goBack = () => {
    if (navigationHistory.length > 0) {
      popNavigation();
      const previousTab = navigationHistory[navigationHistory.length - 2] || 'discover';
      setCurrentTab(previousTab);
    }
  };

  const canGoBack = navigationHistory.length > 1;

  return {
    navigate,
    goBack,
    canGoBack,
  };
};
