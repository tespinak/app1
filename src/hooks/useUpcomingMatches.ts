import { useEffect, useMemo, useState } from 'react';

interface UpcomingMatch {
  team: string;
  opponent: string;
  kickoff: string;
}

const MOCK_MATCHES: UpcomingMatch[] = [
  { team: 'Colo-Colo', opponent: 'U. de Chile', kickoff: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString() },
  { team: 'Liverpool', opponent: 'Arsenal', kickoff: new Date(Date.now() + 1000 * 60 * 60 * 30).toISOString() }
];

async function fetchRealMatches(teams: string[]) {
  const apiKey = import.meta.env.VITE_API_FOOTBALL_KEY;
  if (!apiKey || teams.length === 0) return [] as UpcomingMatch[];

  const all: UpcomingMatch[] = [];
  for (const team of teams) {
    const url = `https://v3.football.api-sports.io/fixtures?next=5&team=${encodeURIComponent(team)}`;
    const response = await fetch(url, { headers: { 'x-apisports-key': apiKey } });
    if (!response.ok) continue;
    const json = await response.json();
    const mapped = (json.response ?? []).map((fixture: any) => ({
      team,
      opponent: fixture?.teams?.home?.name === team ? fixture?.teams?.away?.name : fixture?.teams?.home?.name,
      kickoff: fixture?.fixture?.date
    }));
    all.push(...mapped);
  }
  return all;
}

export function useUpcomingMatches(triggerTeams: string[]) {
  const [matches, setMatches] = useState<UpcomingMatch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!triggerTeams.length) {
        setMatches([]);
        return;
      }

      setLoading(true);
      // MVP: primero mock local, luego intento real.
      let next = MOCK_MATCHES.filter((m) => triggerTeams.some((team) => team.toLowerCase() === m.team.toLowerCase()));
      try {
        const real = await fetchRealMatches(triggerTeams);
        if (real.length > 0) next = real;
      } catch {
        // fallback silencioso al mock
      }

      if (mounted) {
        setMatches(next);
        setLoading(false);
      }
    };

    void run();
    const interval = setInterval(() => void run(), 1000 * 60 * 60 * 24);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [triggerTeams]);

  const nextIn24h = useMemo(() => {
    const now = Date.now();
    return matches
      .map((match) => ({ ...match, hours: Math.round((new Date(match.kickoff).getTime() - now) / 3600000) }))
      .find((match) => match.hours >= 0 && match.hours <= 24);
  }, [matches]);

  return { loading, matches, nextIn24h };
}
