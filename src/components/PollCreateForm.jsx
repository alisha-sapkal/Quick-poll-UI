import React, { useState } from 'react';
import { health } from '../api.js';
import { toast } from 'sonner';

export default function PollCreateForm({ onCreate, onNotify }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addOption = () => setOptions((o) => [...o, '']);
  const updateOption = (i, v) => setOptions((o) => o.map((x, idx) => idx === i ? v : x));
  const removeOption = (i) => setOptions((o) => o.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const trimmed = options.map(o => o.trim()).filter(Boolean);
    if (!question.trim() || trimmed.length < 2) {
      setError('Enter a question and at least two options');
      return;
    }
    // Quick preflight to avoid long waits when DB is down
    try {
      const status = await health({ timeoutMs: 1200 });
      if (status?.db !== 'up') {
        const msg = 'Database is unavailable. Please try again shortly.';
        toast.error(msg);
        setError(msg);
        return;
      }
    } catch (e) {
      const msg = 'Server is unreachable. Please try again shortly.';
      toast.error(msg);
      setError(msg);
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onCreate({ question: question.trim(), options: trimmed });
      setQuestion('');
      setOptions(['', '']);
      toast.success('Poll created successfully');
    } catch (e) {
      console.error('Create form submit error:', e);
      setError(e?.message || 'Something went wrong creating the poll');
      toast.error(e?.message || 'Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card">
      <label>
        <span>Question</span>
        <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What's your question?" />
      </label>
      <div className="options">
        {options.map((opt, i) => (
          <div key={i} className="option-row">
            <input value={opt} onChange={(e) => updateOption(i, e.target.value)} placeholder={`Option ${i+1}`} />
            <button type="button" onClick={() => removeOption(i)} disabled={options.length <= 2}>−</button>
          </div>
        ))}
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="actions">
        <button type="button" onClick={addOption}>Add option</button>
        <button type="submit" disabled={loading || !question.trim() || options.map(o => o.trim()).filter(Boolean).length < 2}>{loading ? 'Creating…' : 'Create'}</button>
      </div>
    </form>
  );
}
