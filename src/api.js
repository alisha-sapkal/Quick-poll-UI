const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function fetchPolls() {
  const res = await fetch(`${API_URL}/api/polls`);
  if (!res.ok) throw new Error('Failed to fetch polls');
  return res.json();
}

export async function createPoll({ question, options }) {
  const res = await fetch(`${API_URL}/api/polls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, options })
  });
  if (!res.ok) throw new Error('Failed to create poll');
  return res.json();
}

export async function votePoll(id, optionIndex) {
  const res = await fetch(`${API_URL}/api/polls/${id}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ optionIndex })
  });
  if (!res.ok) throw new Error('Failed to vote');
  return res.json();
}

export async function likePoll(id) {
  const res = await fetch(`${API_URL}/api/polls/${id}/like`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to like');
  return res.json();
}
