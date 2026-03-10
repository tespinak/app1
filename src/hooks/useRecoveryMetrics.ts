import { useMemo } from 'react';
import type { UserProfile } from '../types';

const CHILE_MIN_WAGE = 500000;
const DEFAULT_LOST_REFERENCE = 500000;
const HOURS_RECOVERED_PER_DAY = 4;

export function useRecoveryMetrics(profile: UserProfile | null) {
  return useMemo(() => {
    if (!profile) {
      return {
        cleanDays: 0,
        moneyRecovered: 0,
        timeRecoveredHours: 0,
        wagesEquivalent: 0,
        moviesEquivalent: 0,
        booksEquivalent: 0
      };
    }

    const registration = new Date(profile.registration_date).getTime();
    const cleanDays = Math.max(0, Math.floor((Date.now() - registration) / 86400000));

    const baseLostAmount = profile.estimated_lost_amount && profile.estimated_lost_amount > 0
      ? profile.estimated_lost_amount
      : DEFAULT_LOST_REFERENCE;

    const moneyRecovered = Math.max(0, baseLostAmount * (cleanDays / 365));
    const timeRecoveredHours = Math.max(0, cleanDays * HOURS_RECOVERED_PER_DAY);

    return {
      cleanDays,
      moneyRecovered,
      timeRecoveredHours,
      wagesEquivalent: moneyRecovered / CHILE_MIN_WAGE,
      moviesEquivalent: Math.floor(timeRecoveredHours / 2), // aprox 2h por película
      booksEquivalent: Math.floor(timeRecoveredHours / 6) // aprox 6h por libro
    };
  }, [profile]);
}
