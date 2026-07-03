'use client';

/**
 * STC Ultimate - Achievement Notification
 * Toast-style notifications for unlocked achievements
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import type { Achievement } from '@/lib/achievement-system';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export function AchievementNotification({
  achievement,
  onDismiss
}: AchievementNotificationProps): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss]);

  if (!achievement) return <></>;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]"
        >
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md border-2 border-yellow-500 rounded-lg p-4 shadow-2xl">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl"
              >
                {achievement.icon}
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">
                    Achievement Unlocked!
                  </h3>
                </div>
                <h4 className="text-white font-semibold text-lg mb-1">
                  {achievement.name}
                </h4>
                <p className="text-gray-300 text-sm mb-2">
                  {achievement.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-xs font-bold">
                    +{achievement.points} Points
                  </span>
                  <span className="text-gray-400 text-xs">
                    • {achievement.category}
                  </span>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onDismiss, 300);
                }}
                className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Progress bar animation */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 5, ease: 'linear' }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Achievement Progress Bar - Shows progress for multi-step achievements
 */
interface AchievementProgressProps {
  achievement: Achievement;
  currentProgress: number;
}

export function AchievementProgress({
  achievement,
  currentProgress
}: AchievementProgressProps): JSX.Element {
  const progress = achievement.maxProgress
    ? Math.min(100, (currentProgress / achievement.maxProgress) * 100)
    : 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">{achievement.name}</span>
        <span className="text-purple-400 font-medium">
          {currentProgress}/{achievement.maxProgress || 1}
        </span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
        />
      </div>
    </div>
  );
}
