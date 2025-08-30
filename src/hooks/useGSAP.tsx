import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Enhanced fade animation with parallax effect
export const useGSAP = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const mm = gsap.matchMedia();

    // Desktop animations
    mm.add("(min-width: 768px)", () => {
      gsap.fromTo(
        element,
        { 
          opacity: 0, 
          y: 80, 
          rotationX: 15,
          transformPerspective: 1000 
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
            scrub: 0.5,
          },
        }
      );
    });

    // Mobile animations (lighter for performance)
    mm.add("(max-width: 767px)", () => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return ref;
};

// Enhanced scale animation with magnetic hover effect
export const useGSAPScale = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Initial animation
      gsap.fromTo(
        element,
        { 
          scale: 0.6, 
          opacity: 0, 
          rotationY: 25,
          transformPerspective: 1000
        },
        {
          scale: 1,
          opacity: 1,
          rotationY: 0,
          duration: 1,
          ease: "elastic.out(1, 0.8)",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Magnetic hover effect
      const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.1;
        const deltaY = (e.clientY - centerY) * 0.1;

        gsap.to(element, {
          x: deltaX,
          y: deltaY,
          rotationY: deltaX * 0.2,
          rotationX: -deltaY * 0.2,
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const handleMouseLeave = () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          rotationY: 0,
          rotationX: 0,
          scale: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.6)"
        });
      };

      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    });

    // Mobile version (simpler)
    mm.add("(max-width: 767px)", () => {
      gsap.fromTo(
        element,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return ref;
};

// Enhanced stagger animation with wave effect
export const useGSAPStagger = (delay: number = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const children = element.children;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      gsap.fromTo(
        children,
        { 
          opacity: 0, 
          y: 60, 
          scale: 0.8,
          rotationX: 30,
          transformPerspective: 1000
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.8,
          stagger: {
            amount: delay * children.length,
            from: "start",
            ease: "power2.out"
          },
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Add floating animation
      Array.from(children).forEach((child, index) => {
        gsap.to(child, {
          y: "random(-10, 10)",
          duration: "random(2, 4)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.2,
        });
      });
    });

    mm.add("(max-width: 767px)", () => {
      gsap.fromTo(
        children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: delay * 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [delay]);

  return ref;
};

// New: Hero text reveal animation
export const useGSAPTextReveal = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const lines = element.querySelectorAll('h1, h2, h3, p');
    
    lines.forEach((line) => {
      // Split text into spans for character animation
      const text = line.textContent || '';
      const chars = text.split('');
      line.innerHTML = chars.map(char => 
        char === ' ' ? ' ' : `<span class="char">${char}</span>`
      ).join('');
    });

    const chars = element.querySelectorAll('.char');

    gsap.fromTo(
      chars,
      { 
        opacity: 0, 
        y: 100,
        rotationX: -90,
        transformPerspective: 1000
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.02,
        ease: "back.out(1.7)",
        delay: 0.5,
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return ref;
};

// New: Morphing background animation
export const useGSAPMorphing = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Create morphing background effect
    gsap.to(element, {
      background: "linear-gradient(45deg, hsl(320, 99%, 51%), hsl(123, 92%, 21%), hsl(320, 99%, 51%))",
      backgroundSize: "400% 400%",
      duration: 0,
    });

    gsap.to(element, {
      backgroundPosition: "0% 50%",
      duration: 8,
      ease: "none",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return ref;
};

// New: Card flip animation
export const useGSAPFlip = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    gsap.fromTo(
      element,
      { 
        rotationY: -180,
        opacity: 0,
        transformPerspective: 1000
      },
      {
        rotationY: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return ref;
};

// New: Magnetic attraction effect for interactive elements
export const useGSAPMagnetic = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.3;
        const deltaY = (e.clientY - centerY) * 0.3;

        gsap.to(element, {
          x: deltaX,
          y: deltaY,
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const handleMouseLeave = () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "elastic.out(1, 0.3)"
        });
      };

      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return ref;
};
