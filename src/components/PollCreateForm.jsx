import React, { useState } from 'react';

export default function PollCreateForm({ onCreate }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);

  const addOption = () => setOptions((o) => [...o, '']);
  const updateOption = (i, v) => setOptions((o) => o.map((x, idx) => idx === i ? v : x));
  const removeOption = (i) => setOptions((o) => o.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    const trimmed = options.map(o => o.trim()).filter(Boolean);
    if (!question.trim() || trimmed.length < 2) return;
    setLoading(true);
    try {
      await onCreate({ question: question.trim(), options: trimmed });
      setQuestion('');
      setOptions(['', '']);
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
      <div className="actions">
        <button type="button" onClick={addOption}>Add option</button>
        <button type="submit" disabled={loading}>Create</button>
      </div>
    </form>
  );
}
