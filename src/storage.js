export const STORAGE_KEY = 'stop_profile_v1'

function getTodayLabel() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getDayDiff(fromDate, toDate) {
  const from = new Date(`${fromDate}T00:00:00`)
  const to = new Date(`${toDate}T00:00:00`)
  const diff = to.getTime() - from.getTime()
  return Math.round(diff / 86400000)
}

export const defaultProfile = {
  name: '',
  ageRange: '18-24',
  reason: '',
  averageSpend: 26000,
  hoursLostPerDay: 2,
  mainTrigger: 'partidos importantes',
  goal: 'recuperar tranquilidad mental',
  motivation: 'Estoy a tiempo de cambiar esta historia.',
  diagnosticScore: 0,
  diagnosticLevel: 'moderado',
  checkIn: 8,
  streakDays: 47,
  impulseWeek: [7, 6, 5, 6, 4, 3, 2],
  milestoneCount: 8,
  sportFocus: 'NBA y tenis',
  bettingType: 'Apuestas deportivas',
  teamFocus: '',
  incitement: [],
  lastCheckInDate: '',
  todayNote: '',
  checkInHistory: [],
}

export function loadProfile() {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return { ...defaultProfile, ...JSON.parse(raw) }
  } catch {
    return null
  }
}

export function saveProfile(profile) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export function clearProfile() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}

export function applyDailyCheckIn(profile, intensity, note) {
  const today = getTodayLabel()
  const nextWeek = [...profile.impulseWeek.slice(1), intensity]
  const improved = intensity <= profile.impulseWeek[profile.impulseWeek.length - 1]
  const alreadyCheckedToday = profile.lastCheckInDate === today
  const dayDiff = profile.lastCheckInDate ? getDayDiff(profile.lastCheckInDate, today) : null

  let nextStreak = profile.streakDays

  if (!alreadyCheckedToday) {
    if (dayDiff === 1 || profile.lastCheckInDate === '') {
      nextStreak += 1
    } else {
      nextStreak = 1
    }
  }

  const nextHistory = alreadyCheckedToday
    ? profile.checkInHistory.map((entry) => (entry.date === today ? { ...entry, intensity, note } : entry))
    : [...profile.checkInHistory, { date: today, intensity, note }].slice(-30)

  return {
    ...profile,
    checkIn: Math.max(1, 11 - intensity),
    impulseWeek: nextWeek,
    lastCheckInDate: today,
    todayNote: note,
    streakDays: nextStreak,
    checkInHistory: nextHistory,
    milestoneCount: improved && !alreadyCheckedToday ? profile.milestoneCount + 1 : profile.milestoneCount,
  }
}

export function hasCheckedInToday(profile) {
  return profile.lastCheckInDate === getTodayLabel()
}