import { useEffect, useState } from 'react'
import Assistant from './Assistant.jsx'
import CheckIn from './CheckIn.jsx'
import Diagnostic from './Diagnostic.jsx'
import Education from './Education.jsx'
import Home from './Home.jsx'
import Onboarding from './Onboarding.jsx'
import Premium from './Premium.jsx'
import { applyDailyCheckIn, defaultProfile, loadProfile, saveProfile } from './storage.js'
import { getTheme, loadThemeMode, saveThemeMode } from './theme.js'

function App() {
  const [profile, setProfile] = useState(defaultProfile)
  const [step, setStep] = useState('loading')
  const [screen, setScreen] = useState('home')
  const [themeMode, setThemeMode] = useState('light')

  useEffect(() => {
    const storedProfile = loadProfile()
    const storedTheme = loadThemeMode()
    setThemeMode(storedTheme)

    if (storedProfile) {
      setProfile(storedProfile)
      setStep('home')
      return
    }

    setStep('onboarding')
  }, [])

  useEffect(() => {
    const theme = getTheme(themeMode)
    document.body.style.background = theme.mode === 'dark' ? '#020617' : '#f4f8ff'
    document.body.style.color = theme.text
    document.body.style.transition = theme.transition
    document.documentElement.style.background = theme.mode === 'dark' ? '#020617' : '#f4f8ff'
    document.documentElement.style.color = theme.text
    document.documentElement.style.transition = theme.transition
  }, [themeMode])

  const toggleTheme = () => {
    const nextMode = themeMode === 'light' ? 'dark' : 'light'
    setThemeMode(nextMode)
    saveThemeMode(nextMode)
  }

  const handleOnboardingComplete = (partialProfile) => {
    const nextProfile = { ...profile, ...partialProfile }
    setProfile(nextProfile)
    saveProfile(nextProfile)
    setStep('diagnostic')
  }

  const handleDiagnosticComplete = (partialProfile) => {
    const nextProfile = { ...profile, ...partialProfile }
    setProfile(nextProfile)
    saveProfile(nextProfile)
    setStep('post-diagnostic-offer')
  }

  const handleEnterHome = () => {
    setStep('home')
    setScreen('home')
  }

  const handleDailyCheckIn = (intensity, note) => {
    const nextProfile = applyDailyCheckIn(profile, intensity, note)
    setProfile(nextProfile)
    saveProfile(nextProfile)
    setScreen('home')
  }

  if (step === 'loading') return null

  if (step === 'onboarding') {
    return <Onboarding initialProfile={profile} onContinue={handleOnboardingComplete} themeMode={themeMode} onToggleTheme={toggleTheme} />
  }

  if (step === 'diagnostic') {
    return <Diagnostic initialProfile={profile} onContinue={handleDiagnosticComplete} themeMode={themeMode} onToggleTheme={toggleTheme} />
  }

  if (step === 'post-diagnostic-offer') {
    return (
      <Premium
        profile={profile}
        currentScreen="premium"
        onNavigate={setScreen}
        onBack={handleEnterHome}
        onOpenEducation={() => setScreen('education')}
        onContinueCurrent={handleEnterHome}
        context="post-diagnostic"
        themeMode={themeMode}
        onToggleTheme={toggleTheme}
      />
    )
  }

  if (screen === 'education') {
    return <Education profile={profile} currentScreen={screen} onNavigate={setScreen} onBack={() => setScreen('home')} onOpenPremium={() => setScreen('premium')} themeMode={themeMode} onToggleTheme={toggleTheme} />
  }

  if (screen === 'premium') {
    return <Premium profile={profile} currentScreen={screen} onNavigate={setScreen} onBack={() => setScreen('home')} onOpenEducation={() => setScreen('education')} themeMode={themeMode} onToggleTheme={toggleTheme} />
  }

  if (screen === 'assistant') {
    return <Assistant profile={profile} currentScreen={screen} onNavigate={setScreen} onBack={() => setScreen('home')} onOpenCheckIn={() => setScreen('checkin')} themeMode={themeMode} onToggleTheme={toggleTheme} />
  }

  if (screen === 'checkin') {
    return <CheckIn profile={profile} currentScreen={screen} onNavigate={setScreen} onBack={() => setScreen('home')} onSubmit={handleDailyCheckIn} themeMode={themeMode} onToggleTheme={toggleTheme} />
  }

  return (
    <Home
      profile={profile}
      currentScreen={screen}
      onNavigate={setScreen}
      themeMode={themeMode}
      onToggleTheme={toggleTheme}
      onRestartOnboarding={() => setStep('onboarding')}
      onOpenEducation={() => setScreen('education')}
      onOpenPremium={() => setScreen('premium')}
      onOpenAssistant={() => setScreen('assistant')}
      onOpenCheckIn={() => setScreen('checkin')}
    />
  )
}

export default App
