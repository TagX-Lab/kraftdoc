import React, { useEffect, useRef, useState } from "react";

/**
 * ScrollReveal Wrapper
 * Animates child elements smoothly when they enter the viewport during scrolling.
 *
 * @param {string} animation - 'fade-up' | 'fade-in' | 'scale-up' | 'slide-left' | 'slide-right'
 * @param {number} delay - delay in milliseconds (e.g. 100, 200, 300 for staggered cards)
 * @param {number} threshold - visibility threshold (0.1 to 1.0)
 */
export default function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  threshold = 0.12,
  className = "",
}) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Once revealed, unobserve so it stays visible
            if (domRef.current) {
              observer.unobserve(domRef.current);
            }
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const getAnimationStyles = () => {
    switch (animation) {
      case "scale-up":
        return isVisible
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 translate-y-6";
      case "slide-left":
        return isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-10";
      case "slide-right":
        return isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-10";
      case "fade-in":
        return isVisible ? "opacity-100" : "opacity-0";
      case "fade-up":
      default:
        return isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8";
    }
  };

  return (
    <div
      ref={domRef}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: "650ms",
      }}
      className={`transition-all ease-out transform ${getAnimationStyles()} ${className}`}
    >
      {children}
    </div>
  );
}
