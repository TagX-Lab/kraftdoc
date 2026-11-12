import React, { useEffect, useRef, useState } from "react";

/**
 * ScrollReveal Wrapper
 * Animates child elements smoothly with spring physics when they enter the viewport during scrolling.
 *
 * @param {string} animation - 'fade-up' | 'fade-down' | 'fade-in' | 'scale-up' | 'pop-in' | 'slide-left' | 'slide-right' | 'tilt-in'
 * @param {number} delay - delay in milliseconds for staggered grid cards (e.g. 0, 80, 160)
 * @param {number} duration - transition duration in milliseconds (default: 650)
 * @param {number} threshold - visibility threshold (0.05 to 1.0)
 * @param {boolean} once - whether to trigger only once (default: true)
 * @param {string} className - extra classes
 */
export default function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 650,
  threshold = 0.08,
  once = true,
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
            if (once && domRef.current) {
              observer.unobserve(domRef.current);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -30px 0px",
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
  }, [threshold, once]);

  const getAnimationStyles = () => {
    switch (animation) {
      case "pop-in":
      case "scale-up":
        return isVisible
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-[0.93] translate-y-5";
      case "tilt-in":
        return isVisible
          ? "opacity-100 rotate-0 translate-y-0"
          : "opacity-0 -rotate-2 translate-y-6";
      case "slide-left":
        return isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-8";
      case "slide-right":
        return isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-8";
      case "fade-down":
        return isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-6";
      case "fade-in":
        return isVisible ? "opacity-100" : "opacity-0";
      case "fade-up":
      default:
        return isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-7";
    }
  };

  return (
    <div
      ref={domRef}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`transition-all transform will-change-transform ${getAnimationStyles()} ${className}`}
    >
      {children}
    </div>
  );
}
