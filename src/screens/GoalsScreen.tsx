import { FormEvent, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { GoalType } from '../types';

function GoalsScreen() {
  const { goals, addGoal, updateGoalProgress } = useAuth();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<GoalType>('ahorro');
  const [targetValue, setTargetValue] = useState('100000');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const completion = useMemo(() => goals.filter((g) => g.current_value >= g.target_value).length, [goals]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const error = await addGoal({
      title,
      type,
      target_value: Number(targetValue),
      due_date: dueDate || null,
      notes: notes || null
    });
    setMessage(error ?? 'Meta creada.');
    if (!error) {
      setTitle('');
      setNotes('');
    }
  };

  return (
    <section className="screen-grid two-columns">
      <article className="card">
        <h2>Metas y Objetivos</h2>
        <p>Define metas de ahorro, días limpio o metas personales.</p>
        <form onSubmit={(e) => void onSubmit(e)}>
          <label>Título</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Tipo</label>
          <select value={type} onChange={(e) => setType(e.target.value as GoalType)}>
            <option value="ahorro">Ahorro</option>
            <option value="dias_limpio">Días limpio</option>
            <option value="personalizada">Personalizada</option>
          </select>

          <label>Valor objetivo</label>
          <input type="number" min="1" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} required />

          <label>Fecha límite (opcional)</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

          <label>Notas</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />

          <button type="submit">Crear meta</button>
        </form>
        {message && <p>{message}</p>}
      </article>

      <article className="card">
        <h3>Progreso</h3>
        <p>Metas completadas: {completion} / {goals.length}</p>
        <ul className="entry-list">
          {goals.length === 0 && <li>No tienes metas aún.</li>}
          {goals.map((goal) => {
            const percentage = Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
            return (
              <li key={goal.id}>
                <strong>{goal.title}</strong>
                <span>{goal.current_value} / {goal.target_value} ({percentage}%)</span>
                <input
                  type="number"
                  min="0"
                  value={goal.current_value}
                  onChange={(e) => void updateGoalProgress(goal.id, Number(e.target.value))}
                />
              </li>
            );
          })}
        </ul>
      </article>
    </section>
  );
}

export default GoalsScreen;
