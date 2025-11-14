import {useEffect, useState, useRef} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {motion} from 'framer-motion';

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

function Counter({end, duration = 2000, suffix = '+'}: CounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCounter();
          }
        });
      },
      {threshold: 0.5},
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [hasAnimated]);

  const animateCounter = () => {
    const startTime = Date.now();
    const startValue = 0;

    const updateCounter = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (end - startValue) * easeOutQuart);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  return (
    <span ref={counterRef} className="font-bold">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function HeroBanner() {
  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {opacity: 0, x: -20},
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const headingVariants = {
    hidden: {opacity: 0, x: -30},
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  const imageVariants = {
    hidden: {opacity: 0, y: 50, scale: 0.9},
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  const starVariants = {
    hidden: {opacity: 0, scale: 0, rotate: -180},
    visible: {
      opacity: 0.8,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const buttonVariants = {
    hidden: {opacity: 0, scale: 0.8},
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
  };

  const statsVariants = {
    hidden: {opacity: 0, x: -20},
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section
      className="w-full"
      style={{backgroundColor: '#F2F0F1'}}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          style={{gridTemplateColumns: '52% 44%'}}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{once: true, amount: 0.2}}
        >
          {/* Left Side - Text Content */}
          <motion.div
            className="flex flex-col gap-6 md:gap-8"
            variants={containerVariants}
          >
            {/* Main Heading */}
            <motion.h1
              className="font-bold font-heading text-black uppercase"
              style={{
                fontSize: '64px',
                lineHeight: '64px',
                letterSpacing: '0',
              }}
              variants={headingVariants}
            >
              <motion.span
                className="block"
                variants={itemVariants}
              >
                FIND CLOTHES
              </motion.span>
              <motion.span
                className="block"
                variants={itemVariants}
              >
                THAT MATCHES
              </motion.span>
              <motion.span
                className="block"
                variants={itemVariants}
              >
                YOUR STYLE
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-gray-600 w-full text-[16px] leading-[22px] tracking-[0]"
              variants={itemVariants}
            >
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense of
              style.
            </motion.p>

            {/* Shop Now Button */}
            <motion.div variants={buttonVariants}>
              <Link to="/collections">
                <motion.button
                  className="px-[67px] py-[15px] bg-black text-white rounded-full font-medium text-base cursor-pointer border-0"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: '#333',
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: 'easeInOut',
                  }}
                >
                  Shop Now
                </motion.button>
              </Link>
            </motion.div>

            {/* Statistics */}
            <motion.div
              className="flex flex-wrap gap-6 md:gap-8 lg:gap-12 pt-4"
              variants={containerVariants}
            >
              <motion.div className="flex flex-col" variants={statsVariants}>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-1">
                  <Counter end={200} />
                </div>
                <div className="text-sm md:text-base text-gray-600">
                  International Brands
                </div>
              </motion.div>
              <motion.div className="flex flex-col" variants={statsVariants}>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-1">
                  <Counter end={2000} />
                </div>
                <div className="text-sm md:text-base text-gray-600">
                  High-Quality Products
                </div>
              </motion.div>
              <motion.div className="flex flex-col" variants={statsVariants}>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-1">
                  <Counter end={30000} />
                </div>
                <div className="text-sm md:text-base text-gray-600">
                  Happy Customers
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Side - Images */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Hero Image */}
            <motion.div
              className="relative z-[3]"
              variants={imageVariants}
            >
              <img
                src="/images/hero-img.png"
                alt="Fashion models"
                className="w-full max-w-lg md:max-w-xl lg:max-w-2xl h-auto object-contain"
              />
            </motion.div>

            {/* Decorative Star - Top Right */}
            <motion.div
              className="absolute top-0 right-0 md:right-4 lg:right-8 z-[3]"
              variants={starVariants}
            >
              <img
                src="/images/hero-star.svg"
                alt=""
                className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 opacity-80"
                style={{filter: 'brightness(0)'}}
                aria-hidden="true"
              />
            </motion.div>

            {/* Decorative Star - Middle Left */}
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 z-[3] hidden md:block"
              variants={starVariants}
            >
              <img
                src="/images/hero-star.svg"
                alt=""
                className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 opacity-80"
                style={{filter: 'brightness(0)'}}
                aria-hidden="true"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

