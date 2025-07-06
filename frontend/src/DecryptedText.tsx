import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'hover' | 'view' | 'always';
  revealDirection?: 'left' | 'right' | 'center';
}

const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 50,
  maxIterations = 15,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  revealDirection = 'left'
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentText, setCurrentText] = useState(text);
  const [iteration, setIteration] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  const generateRandomText = () => {
    return text
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' ';
        if (iteration >= maxIterations) return text[index];
        return characters[Math.floor(Math.random() * characters.length)];
      })
      .join('');
  };

  const startAnimation = () => {
    if (isAnimating || (animateOn === 'view' && hasAnimated)) return;
    
    setIsAnimating(true);
    setIteration(0);
    
    const interval = setInterval(() => {
      setIteration(prev => {
        if (prev >= maxIterations) {
          setIsAnimating(false);
          if (animateOn === 'view') setHasAnimated(true);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'view' && isInView && !hasAnimated) {
      startAnimation();
    }
  }, [isInView, animateOn, hasAnimated]);

  useEffect(() => {
    if (isAnimating) {
      setCurrentText(generateRandomText());
    } else {
      setCurrentText(text);
    }
  }, [iteration, isAnimating, text]);

  const getRevealVariants = () => {
    const baseVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    };

    switch (revealDirection) {
      case 'left':
        return {
          hidden: { opacity: 0, x: -20 },
          visible: { opacity: 1, x: 0 }
        };
      case 'right':
        return {
          hidden: { opacity: 0, x: 20 },
          visible: { opacity: 1, x: 0 }
        };
      case 'center':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 }
        };
      default:
        return baseVariants;
    }
  };

  const handleMouseEnter = () => {
    if (animateOn === 'hover') {
      startAnimation();
    }
  };

  const handleClick = () => {
    if (animateOn === 'always') {
      startAnimation();
    }
  };

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${parentClassName}`}
      variants={getRevealVariants()}
      initial="hidden"
      animate={animateOn === 'view' ? (isInView ? 'visible' : 'hidden') : 'visible'}
      transition={{ duration: 0.3 }}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      style={{ cursor: animateOn === 'always' ? 'pointer' : 'default' }}
    >
      <span 
        className={`font-mono ${isAnimating ? encryptedClassName : className}`}
        style={{
          transition: isAnimating ? 'none' : 'all 0.3s ease',
          filter: isAnimating ? 'blur(0.5px)' : 'blur(0px)',
          textShadow: isAnimating ? '0 0 2px rgba(255,255,255,0.3)' : 'none'
        }}
      >
        {currentText}
      </span>
    </motion.span>
  );
};

export default DecryptedText; 