/**
 * FLAGSHIP MOTION SYSTEM
 * Animation utilities and hooks for premium interactions
 */

import { useEffect, useRef, useState } from 'react';

// ═══════════════════════════════════════════════════════════════
// INTERSECTION OBSERVER HOOK
// ═══════════════════════════════════════════════════════════════

export function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasBeenInView(true);
        }
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return { ref, isInView, hasBeenInView };
}

// ═══════════════════════════════════════════════════════════════
// PARALLAX HOOK
// ═══════════════════════════════════════════════════════════════

export function useParallax(speed = 0.5) {
  const [offset, setOffset] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;
      setOffset(rate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { ref, offset };
}

// ═══════════════════════════════════════════════════════════════
// MOUSE POSITION HOOK
// ═══════════════════════════════════════════════════════════════

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}

// ═══════════════════════════════════════════════════════════════
// HOVER HOOK WITH DELAY
// ═══════════════════════════════════════════════════════════════

export function useHover(delay = 0) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => {
      if (delay > 0) {
        timeoutRef.current = setTimeout(() => setIsHovered(true), delay);
      } else {
        setIsHovered(true);
      }
    };

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsHovered(false);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay]);

  return { ref, isHovered };
}

// ═══════════════════════════════════════════════════════════════
// SPRING ANIMATION
// ═══════════════════════════════════════════════════════════════

export function useSpring(target, config = {}) {
  const { stiffness = 170, damping = 26, mass = 1 } = config;
  const [value, setValue] = useState(target);
  const velocity = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      const spring = -stiffness * (value - target);
      const damper = -damping * velocity.current;
      const acceleration = (spring + damper) / mass;

      velocity.current += acceleration * 0.016;
      const newValue = value + velocity.current * 0.016;

      setValue(newValue);

      if (Math.abs(velocity.current) > 0.01 || Math.abs(newValue - target) > 0.01) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, value, stiffness, damping, mass]);

  return value;
}

// ═══════════════════════════════════════════════════════════════
// STAGGER ANIMATION
// ═══════════════════════════════════════════════════════════════

export function staggerAnimation(elements, delay = 100) {
  elements.forEach((element, index) => {
    if (element) {
      element.style.animationDelay = `${index * delay}ms`;
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// SCROLL TO ELEMENT
// ═══════════════════════════════════════════════════════════════

export function scrollToElement(element, options = {}) {
  const {
    offset = 0,
    duration = 600,
    easing = 'easeInOutCubic',
  } = options;

  if (!element) return;

  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset + offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  const easings = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => --t * t * t + 1,
    easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  };

  const easingFunction = easings[easing] || easings.easeInOutCubic;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easingFunction(progress);

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// ═══════════════════════════════════════════════════════════════
// MAGNETIC CURSOR EFFECT
// ═══════════════════════════════════════════════════════════════

export function useMagnetic(strength = 0.3) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      setPosition({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return { ref, position };
}

// ═══════════════════════════════════════════════════════════════
// REDUCED MOTION CHECK
// ═══════════════════════════════════════════════════════════════

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// ═══════════════════════════════════════════════════════════════
// ANIMATION FRAME HOOK
// ═══════════════════════════════════════════════════════════════

export function useAnimationFrame(callback) {
  const requestRef = useRef();
  const previousTimeRef = useRef();

  useEffect(() => {
    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [callback]);
}

// ═══════════════════════════════════════════════════════════════
// GESTURE DETECTION
// ═══════════════════════════════════════════════════════════════

export function useSwipe(onSwipe) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onSwipe('left');
    } else if (isRightSwipe) {
      onSwipe('right');
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export default {
  useInView,
  useParallax,
  useMousePosition,
  useHover,
  useSpring,
  useMagnetic,
  usePrefersReducedMotion,
  useAnimationFrame,
  useSwipe,
  staggerAnimation,
  scrollToElement,
};
