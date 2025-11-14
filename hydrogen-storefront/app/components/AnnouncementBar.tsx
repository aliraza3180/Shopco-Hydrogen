import {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router';
import {motion, AnimatePresence} from 'framer-motion';

interface Announcement {
  /**
   * The announcement message to display
   */
  message: string;
  /**
   * Optional link URL for the announcement
   */
  linkUrl?: string;
  /**
   * Optional link text
   */
  linkText?: string;
}

interface AnnouncementBarProps {
  /**
   * Array of announcements to display in the slider
   */
  announcements?: Announcement[];
  /**
   * Auto-rotate interval in milliseconds (default: 5000ms)
   */
  interval?: number;
  /**
   * Whether the announcement bar can be dismissed
   */
  dismissible?: boolean;
}

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    message: 'Sign up and get 20% off to your first order.',
    linkUrl: '/account/register',
    linkText: 'Sign Up Now',
  },
  {
    message: 'Free shipping on orders over $50!',
    linkUrl: '/collections/all',
    linkText: 'Shop Now',
  },
  {
    message: 'New arrivals just dropped. Check them out!',
    linkUrl: '/collections/all',
    linkText: 'Explore',
  },
];

export function AnnouncementBar({
  announcements = DEFAULT_ANNOUNCEMENTS,
  interval = 5000,
  dismissible = true,
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Auto-rotate announcements
  useEffect(() => {
    if (!isVisible || isPaused || isDragging || announcements.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible, isPaused, isDragging, interval, announcements.length]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Swipe handlers with momentum
  const handleStart = (clientX: number, clientY?: number) => {
    setIsPaused(true);
    setIsDragging(true);
    setStartX(clientX);
    setStartY(clientY || 0);
    setCurrentX(clientX);
    setVelocity(0);
    setLastMoveTime(Date.now());
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    
    const now = Date.now();
    const timeDelta = Math.max(1, now - lastMoveTime);
    const distanceDelta = clientX - currentX;
    
    // Calculate velocity (pixels per millisecond) with direction
    if (timeDelta > 0) {
      const newVelocity = distanceDelta / timeDelta;
      setVelocity(newVelocity);
    }
    
    setCurrentX(clientX);
    setLastMoveTime(now);
  };

  const handleEnd = () => {
    if (!isDragging) return;

    const diff = startX - currentX;
    const threshold = 30; // Reduced threshold for more responsive swipes
    const velocityThreshold = 0.3; // Velocity threshold for momentum-based swipes
    
    // Use velocity or distance to determine swipe direction
    const shouldSwipe = Math.abs(diff) > threshold || Math.abs(velocity) > velocityThreshold;

    if (shouldSwipe) {
      if (diff > 0 || velocity > velocityThreshold) {
        // Swiped left - next slide
        setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
      } else if (diff < 0 || velocity < -velocityThreshold) {
        // Swiped right - previous slide
        setCurrentIndex((prevIndex) => (prevIndex - 1 + announcements.length) % announcements.length);
      }
    }

    setIsDragging(false);
    setIsPaused(false);
    setStartX(0);
    setStartY(0);
    setCurrentX(0);
    setVelocity(0);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - startX);
    const deltaY = Math.abs(touch.clientY - startY);
    
    // Only prevent default if horizontal swipe is dominant (prevents page scroll)
    if (deltaX > deltaY && deltaX > 10) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    handleMove(touch.clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    handleEnd();
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };

  // Calculate drag offset for smooth visual feedback
  const dragOffset = isDragging ? startX - currentX : 0;
  const dragPercentage = sliderRef.current 
    ? Math.max(-100, Math.min(100, (dragOffset / sliderRef.current.offsetWidth) * 100))
    : 0;

  const announcementVariants = {
    hidden: {opacity: 0, y: -20},
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (!isVisible || announcements.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        key="announcement-bar"
        className="sticky top-0 z-[2] w-full bg-black text-white text-center py-3 px-4 text-sm md:text-base overflow-hidden"
        variants={announcementVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onMouseEnter={() => !isDragging && setIsPaused(true)}
        onMouseLeave={(e) => {
          if (!isDragging) {
            setIsPaused(false);
          }
          handleMouseLeave();
        }}
      >
      <div className="relative flex items-center justify-center max-w-full mx-auto px-8 md:px-12">
        {/* Slider container */}
        <div
          ref={sliderRef}
          className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{
            touchAction: 'pan-x',
            willChange: isDragging ? 'transform' : 'auto',
          }}
        >
          {/* Announcements */}
          <div className="relative w-full overflow-hidden">
            <div
              className="flex"
              style={{
                transform: `translateX(calc(-${currentIndex * 100}% + ${dragPercentage}%))`,
                transition: isDragging 
                  ? 'none' 
                  : 'transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                willChange: isDragging ? 'transform' : 'auto',
              }}
            >
              {announcements.map((announcement, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 flex items-center justify-center px-2"
                >
                  <p className="m-0 text-center pointer-events-none">
                    {announcement.message}{' '}
                    {announcement.linkUrl && (
            <Link
                        to={announcement.linkUrl}
                        className="underline underline-offset-2 text-primary hover:opacity-80 transition-opacity whitespace-nowrap pointer-events-auto cursor-pointer"
                        onClick={(e) => {
                          // Prevent link click during drag
                          if (isDragging) {
                            e.preventDefault();
                          }
                        }}
                      >
                        {announcement.linkText || 'Learn More'}
            </Link>
          )}
        </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Close button */}
        {dismissible && (
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent border-0 text-white cursor-pointer text-xl md:text-2xl leading-none p-1 opacity-80 hover:opacity-100 transition-opacity z-10"
            onClick={handleDismiss}
            aria-label="Close announcement"
            onMouseDown={(e) => e.stopPropagation()}
          >
            ×
          </button>
        )}
      </div>
    </motion.div>
    </AnimatePresence>
  );
}

