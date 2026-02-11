import { useState, useEffect } from 'react';

const STORAGE_KEY = 'job-search-progress';

export function useProgress() {
  const [completedDays, setCompletedDays] = useState<Set<number>>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return new Set(parsed);
      } catch {
        return new Set();
      }
    }
    return new Set();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completedDays)));
  }, [completedDays]);

  const toggleDay = (dayNumber: number) => {
    setCompletedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dayNumber)) {
        newSet.delete(dayNumber);
      } else {
        newSet.add(dayNumber);
      }
      return newSet;
    });
  };

  const isCompleted = (dayNumber: number) => completedDays.has(dayNumber);

  const resetProgress = () => {
    setCompletedDays(new Set());
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    completedDays,
    toggleDay,
    isCompleted,
    resetProgress,
    completionCount: completedDays.size,
  };
}
