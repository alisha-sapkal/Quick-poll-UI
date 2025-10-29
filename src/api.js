// Prefer VITE_API_URL when provided (works for both local and deployed). Otherwise use same-origin.
export const API_BASE = (import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim()) || '';

async function fetchWithTimeout(resource, options = {}) {
  const { timeoutMs = 7000, ...rest } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(resource, { ...rest, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function health({ timeoutMs = 1500 } = {}) {
  const res = await fetchWithTimeout(`${API_BASE}/api/health`, { timeoutMs });
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchPolls() {
  const res = await fetch(`${API_BASE}/api/polls`);
  if (!res.ok) throw new Error('Failed to fetch polls');
  return res.json();
}

export async function createPoll({ question, options }) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, options })
    });
    if (!res.ok) {
      let message = 'Failed to create poll';
      try {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const data = await res.json();
          message = data?.error || data?.message || message;
        } else {
          const text = await res.text();
          message = text || message;
        }
      } catch {}
      throw new Error(message);
    }
    return res.json();
  } catch (err) {
    console.error('API createPoll error:', err);
    if (err?.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw err;
  }
}

export async function votePoll(id, optionIndex) {
  const res = await fetch(`${API_BASE}/api/polls/${id}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ optionIndex })
  });
  if (!res.ok) throw new Error('Failed to vote');
  return res.json();
}

export async function likePoll(id) {
  const res = await fetch(`${API_BASE}/api/polls/${id}/like`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to like');
  return res.json();
}
