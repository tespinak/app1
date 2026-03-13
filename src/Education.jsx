import { useMemo, useState } from 'react'
import { ArrowLeft, BookOpen, Clock3, Flame, Quote, Sparkles, Star, TriangleAlert } from 'lucide-react'
import BottomNav from './BottomNav.jsx'
import { educationArticles, educationStories } from './educationContent.js'
import ThemeToggle from './ThemeToggle.jsx'
import { getTheme } from './theme.js'

function StoryCard({ story, onOpen, theme }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(story.slug)}
      style={{ width: '100%', border: `1px solid ${theme.border}`, background: theme.surface, borderRadius: 24, padding: 20, boxShadow: theme.shadow, textAlign: 'left', transition: theme.transition }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#b45309', fontSize: 12, fontWeight: 900 }}>
          <Quote size={14} />
          {story.label}
        </div>
        <div style={{ fontSize: 11, fontWeight: 900, color: story.status === 'Disponible' ? '#047857' : theme.subtle }}>{story.status.toUpperCase()}</div>
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.15, color: theme.text, marginBottom: 8 }}>{story.title}</div>
      <div style={{ color: theme.muted, lineHeight: 1.6, marginBottom: 12 }}>{story.subtitle}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, color: theme.subtle, fontSize: 12, fontWeight: 800 }}>
        <span>{story.author}</span>
        <span>{story.readingTime}</span>
      </div>
    </button>
  )
}

function TabButton({ active, label, onClick, theme }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: active ? `1px solid ${theme.mode === 'dark' ? 'rgba(147,197,253,0.18)' : 'rgba(59,130,246,0.14)'}` : '1px solid transparent',
        borderRadius: 18,
        padding: '12px 14px',
        background: active ? theme.segmentedActive : theme.segmentedIdle,
        color: active ? '#fff' : theme.text,
        fontWeight: 800,
        boxShadow: active ? (theme.mode === 'dark' ? '0 12px 28px rgba(14,165,233,0.16)' : '0 12px 28px rgba(37,99,235,0.12)') : 'none',
        transition: theme.transition,
      }}
    >
      {label}
    </button>
  )
}

export default function Education({ profile, currentScreen = 'education', onNavigate, onBack, onOpenPremium, themeMode, onToggleTheme }) {
  const theme = getTheme(themeMode)
  const [selectedSlug, setSelectedSlug] = useState(null)
  const [selectedStorySlug, setSelectedStorySlug] = useState(null)
  const [activeTab, setActiveTab] = useState('articles')

  const featuredArticle = useMemo(() => educationArticles.find((article) => article.featured) ?? educationArticles[0], [])
  const selectedArticle = useMemo(() => educationArticles.find((article) => article.slug === selectedSlug) ?? null, [selectedSlug])
  const selectedStory = useMemo(() => educationStories.find((story) => story.slug === selectedStorySlug) ?? null, [selectedStorySlug])

  if (selectedArticle || selectedStory) {
    const content = selectedArticle ?? selectedStory
    const isStory = Boolean(selectedStory)

    return (
      <div style={{ minHeight: '100vh', padding: '28px 20px 112px', background: theme.canvas, transition: theme.transition }}>
        <div style={{ maxWidth: 460, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <button type="button" onClick={() => { setSelectedSlug(null); setSelectedStorySlug(null) }} style={{ border: `1px solid ${theme.border}`, background: theme.surface, color: theme.text, borderRadius: 999, padding: '10px 14px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 8, transition: theme.transition }}>
              <ArrowLeft size={14} />
              Volver a la biblioteca
            </button>
            <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
          </div>

          <article style={{ background: theme.surface, borderRadius: 32, padding: '26px 22px', boxShadow: theme.shadow, marginBottom: 18, border: `1px solid ${theme.border}`, transition: theme.transition }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 999, background: isStory ? '#fff7ed' : '#eff6ff', color: isStory ? '#b45309' : '#1d4ed8', fontSize: 12, fontWeight: 900, letterSpacing: 0.4 }}>
                {isStory ? <Quote size={14} /> : <BookOpen size={14} />}
                {isStory ? content.label : content.category}
              </div>
              {isStory && <div style={{ fontSize: 12, fontWeight: 800, color: theme.subtle }}>{content.author}</div>}
            </div>

            <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.05, color: theme.text }}>{content.title}</h1>
            <p style={{ margin: '12px 0 14px', color: theme.muted, lineHeight: 1.6, fontSize: 16 }}>{content.subtitle}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: theme.subtle, fontSize: 13, fontWeight: 800, marginBottom: 20 }}>
              <Clock3 size={14} />
              {content.readingTime} de lectura
            </div>

            <p style={{ margin: 0, color: theme.text, lineHeight: 1.8, fontSize: 16 }}>{content.intro}</p>

            <div style={{ display: 'grid', gap: 22, marginTop: 24 }}>
              {content.sections.map((section) => (
                <section key={section.heading}>
                  <h2 style={{ margin: '0 0 10px', fontSize: 22, lineHeight: 1.15, color: theme.text }}>{section.heading}</h2>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} style={{ margin: 0, color: theme.text, lineHeight: 1.8, fontSize: 16 }}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <section style={{ marginTop: 24, borderRadius: 24, background: isStory ? '#fff7ed' : '#eff6ff', padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isStory ? '#b45309' : '#1d4ed8', fontWeight: 900, marginBottom: 10 }}>
                <Flame size={18} />
                {content.actionTitle}
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {content.actions.map((action) => (
                  <div key={action} style={{ padding: '12px 14px', borderRadius: 18, background: 'rgba(255,255,255,0.78)', color: isStory ? '#9a3412' : '#1e3a8a', lineHeight: 1.55, fontSize: 14 }}>
                    {action}
                  </div>
                ))}
              </div>
            </section>
          </article>
        </div>

        <BottomNav current={currentScreen} onNavigate={onNavigate} theme={theme} />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '28px 20px 112px', background: theme.canvas, transition: theme.transition }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <button type="button" onClick={onBack} style={{ border: `1px solid ${theme.border}`, background: theme.surface, color: theme.text, borderRadius: 999, padding: '10px 14px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 8, transition: theme.transition }}>
            <ArrowLeft size={14} />
            Volver
          </button>
          <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.1, color: theme.subtle, marginBottom: 8 }}>EDUCACIÓN</div>
          <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.05, color: theme.text }}>Biblioteca anti-apuestas</h1>
          <p style={{ margin: '12px 0 0', color: theme.muted, lineHeight: 1.55 }}>Lecturas breves, historias reales y explicaciones claras para entender mejor el patrón antes de que vuelva a arrastrarte.</p>
        </div>

        <section style={{ background: theme.segmentedSurface, borderRadius: 24, padding: 10, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, marginBottom: 18, transition: theme.transition }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <TabButton active={activeTab === 'articles'} label="Artículos" onClick={() => setActiveTab('articles')} theme={theme} />
            <TabButton active={activeTab === 'stories'} label="Historias" onClick={() => setActiveTab('stories')} theme={theme} />
          </div>
        </section>

        {activeTab === 'articles' ? (
          <>
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 18 }}>
              <div style={{ background: theme.surface, borderRadius: 20, padding: 14, boxShadow: theme.shadow, border: `1px solid ${theme.border}`, transition: theme.transition }}><div style={{ fontSize: 24, fontWeight: 900, color: theme.text }}>{educationArticles.length}</div><div style={{ color: theme.subtle, fontSize: 12, fontWeight: 800 }}>lecturas base</div></div>
              <div style={{ background: theme.surface, borderRadius: 20, padding: 14, boxShadow: theme.shadow, border: `1px solid ${theme.border}`, transition: theme.transition }}><div style={{ fontSize: 24, fontWeight: 900, color: theme.text }}>{educationStories.length}</div><div style={{ color: theme.subtle, fontSize: 12, fontWeight: 800 }}>historias</div></div>
              <div style={{ background: theme.surface, borderRadius: 20, padding: 14, boxShadow: theme.shadow, border: `1px solid ${theme.border}`, transition: theme.transition }}><div style={{ fontSize: 24, fontWeight: 900, color: theme.text }}>1-5</div><div style={{ color: theme.subtle, fontSize: 12, fontWeight: 800 }}>min lectura</div></div>
            </section>

            <button type="button" onClick={() => setSelectedSlug(featuredArticle.slug)} style={{ width: '100%', border: 'none', background: theme.hero, color: '#fff', borderRadius: 28, padding: 22, boxShadow: theme.shadow, marginBottom: 18, textAlign: 'left', transition: theme.transition }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.10)', color: '#93c5fd', fontWeight: 800, fontSize: 12, marginBottom: 14 }}>
                <Star size={14} />
                Lectura destacada
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.1, marginBottom: 8 }}>{featuredArticle.title}</div>
              <div style={{ color: '#e2e8f0', lineHeight: 1.6, marginBottom: 16 }}>{featuredArticle.subtitle}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#cbd5e1', fontSize: 13, fontWeight: 800 }}><Clock3 size={14} />{featuredArticle.readingTime}</div>
                <div style={{ color: '#fff', fontWeight: 900, fontSize: 13 }}>Leer ahora</div>
              </div>
            </button>

            <section style={{ background: theme.surface, borderRadius: 24, padding: '16px 18px', boxShadow: theme.shadow, marginBottom: 18, border: `1px solid ${theme.border}`, transition: theme.transition }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><Sparkles size={18} color={theme.mode === 'dark' ? '#93c5fd' : '#1d4ed8'} /><div style={{ fontWeight: 800, color: theme.text }}>Tu foco actual</div></div>
              <div style={{ color: theme.muted, lineHeight: 1.6 }}>Hoy sabemos que tu riesgo se activa mucho con {profile.sportFocus} y con {profile.mainTrigger}. Por eso esta biblioteca mezcla claridad, recaída, costo real y momentos gatillo.</div>
            </section>

            <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
              {educationArticles.map((article, index) => (
                <button key={article.slug} type="button" onClick={() => setSelectedSlug(article.slug)} style={{ width: '100%', border: `1px solid ${theme.border}`, background: theme.surface, borderRadius: 24, padding: 20, boxShadow: theme.shadow, textAlign: 'left', transition: theme.transition }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#1d4ed8', fontSize: 12, fontWeight: 900 }}>{index === 0 ? <Star size={14} /> : <BookOpen size={14} />}{article.category}</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: theme.subtle, fontSize: 12, fontWeight: 800 }}><Clock3 size={13} />{article.readingTime}</div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.15, color: theme.text, marginBottom: 8 }}>{article.title}</div>
                  <div style={{ color: theme.muted, lineHeight: 1.6, marginBottom: 14 }}>{article.subtitle}</div>
                  <div style={{ color: theme.text, fontWeight: 800, fontSize: 13 }}>Leer artículo</div>
                </button>
              ))}
            </div>

            <section style={{ background: theme.info, borderRadius: 24, padding: 20, color: theme.infoText, lineHeight: 1.6, marginBottom: 18, transition: theme.transition }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontWeight: 800 }}><TriangleAlert size={18} />Traducción a tu caso</div>
              Si cada día se te iban {profile.hoursLostPerDay} horas en promedio y {profile.averageSpend} CLP, no era solo un mal rato. Era una fuga diaria de tiempo, energía y dinero que podía seguir creciendo sola.
            </section>
          </>
        ) : (
          <>
            <section style={{ background: theme.surface, borderRadius: 24, padding: '16px 18px', boxShadow: theme.shadow, marginBottom: 18, border: `1px solid ${theme.border}`, transition: theme.transition }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><Quote size={18} color={theme.mode === 'dark' ? '#fdba74' : '#b45309'} /><div style={{ fontWeight: 800, color: theme.text }}>Historias y testimonios</div></div>
              <div style={{ color: theme.muted, lineHeight: 1.6 }}>Leer historias reales puede ayudarte a ponerle nombre a cosas que todavía se sienten confusas o difíciles de contar.</div>
            </section>
            <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
              {educationStories.map((story) => <StoryCard key={story.slug} story={story} onOpen={setSelectedStorySlug} theme={theme} />)}
            </div>
          </>
        )}

        <button type="button" onClick={onOpenPremium} style={{ width: '100%', border: 'none', borderRadius: 22, padding: '16px 18px', background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)', color: '#fff', fontSize: 16, fontWeight: 800, boxShadow: '0 20px 45px rgba(29,78,216,0.25)', marginBottom: 12, transition: theme.transition }}>
          Ver cómo Premium profundiza esto
        </button>
        <button type="button" onClick={onBack} style={{ width: '100%', border: `1px solid ${theme.border}`, borderRadius: 22, padding: '15px 18px', background: theme.surface, color: theme.text, fontSize: 15, fontWeight: 800, transition: theme.transition }}>
          Volver a Home
        </button>
      </div>

      <BottomNav current={currentScreen} onNavigate={onNavigate} theme={theme} />
    </div>
  )
}
