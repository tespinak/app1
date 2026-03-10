export type BetType = 'deportivas' | 'casino' | 'poker' | 'criptos' | 'otro';

export interface UserProfile {
  id: string;
  name: string;
  registration_date: string;
  estimated_lost_amount: number | null;
  bet_types: BetType[];
  trigger_teams: string[];
}

export interface ImpulseEntry {
  id: string;
  user_id: string;
  created_at: string;
  intensity: number;
  trigger: string;
  action_taken: string;
  emotional_state: string;
}

export interface AlertPreferences {
  id: string;
  user_id: string;
  team_alerts: boolean;
  payday_alerts: boolean;
  risk_hours_alerts: boolean;
  breathing_reminders: boolean;
  nightly_checkin: boolean;
  milestone_celebrations: boolean;
  risk_hours: string[];
}

export type GoalType = 'ahorro' | 'dias_limpio' | 'personalizada';

export interface RecoveryGoal {
  id: string;
  user_id: string;
  title: string;
  type: GoalType;
  target_value: number;
  current_value: number;
  due_date: string | null;
  created_at: string;
  notes: string | null;
}

export interface ImpulseLog {
  id: string;
  user_id: string;
  created_at: string;
  trigger: string;
  resisted: boolean;
  note: string | null;
}
