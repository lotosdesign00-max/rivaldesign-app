import React, { useState, useEffect } from "react";

const TypewriterText = ({ texts = ["Создаю стильные визуалы"], theme }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const currentFullText = texts[currentTextIndex];
    
    if (isTyping && !isDeleting) {
      // Typing animation
      if (displayedText.length < currentFullText.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        }, 80);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    }

    if (isDeleting) {
      if (opacity > 0) {
        const timeout = setTimeout(() => {
          setOpacity(prev => Math.max(0, prev - 0.05));
        }, 30);
        return () => clearTimeout(timeout);
      } else {
        setDisplayedText("");
        setIsTyping(true);
        setIsDeleting(false);
        setOpacity(1);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }
    }
  }, [displayedText, currentTextIndex, texts, isTyping, isDeleting, opacity]);

  return (
    <div style={{ position: 'relative', display: 'inline-block', minHeight: '1.5em' }}>
      <span style={{
        fontSize: 'clamp(24px, 5vw, 42px)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        color: 'transparent',
        backgroundImage: theme.grad,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: '-0.03em',
        opacity: opacity,
        transition: 'opacity 0.3s ease-out',
        display: 'inline-block',
        position: 'relative',
      }}>
        {displayedText || '\u00A0'}
        <span style={{
          display: 'inline-block',
          width: '3px',
          height: '0.9em',
          background: theme.accent,
          marginLeft: '4px',
          animation: 'blink 1s infinite',
          verticalAlign: 'middle',
          boxShadow: `0 0 12px ${theme.glow}`,
        }} />
      </span>
      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default TypewriterText;

