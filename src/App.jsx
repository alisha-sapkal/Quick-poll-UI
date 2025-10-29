import React, { useEffect, useState } from 'react';
import { createPoll, fetchPolls, likePoll, votePoll } from './api.js';
import PollCreateForm from './components/PollCreateForm.jsx';
import PollList from './components/PollList.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function App() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    fetchPolls().then(setPolls).catch(console.error);
  }, []);

  useEffect(() => {
    const es = new EventSource(`${API_URL}/api/stream`);
    const onCreated = (e) => {
      const poll = JSON.parse(e.data);
      setPolls((prev) => [poll, ...prev]);
    };
    const onUpdated = (e) => {
      const poll = JSON.parse(e.data);
      setPolls((prev) => prev.map((p) => (p._id === poll._id ? poll : p)));
    };
    const onLiked = (e) => {
      const poll = JSON.parse(e.data);
      setPolls((prev) => prev.map((p) => (p._id === poll._id ? poll : p)));
    };
    es.addEventListener('pollCreated', onCreated);
    es.addEventListener('pollUpdated', onUpdated);
    es.addEventListener('pollLiked', onLiked);
    es.onerror = () => {
      // Let browser retry automatically; optional logging
    };
    return () => {
      es.removeEventListener('pollCreated', onCreated);
      es.removeEventListener('pollUpdated', onUpdated);
      es.removeEventListener('pollLiked', onLiked);
      es.close();
    };
  }, []);

  const handleCreate = async (data) => {
    const created = await createPoll(data);
    if (!created?._id) throw new Error('Create failed');
  };

  const handleVote = async (id, optionIndex) => {
    await votePoll(id, optionIndex);
  };

  const handleLike = async (id) => {
    await likePoll(id);
  };

  return (
    <div className="container">
      <header>
        <h1>QuickPoll</h1>
        <p>Create polls, vote, like - live updates in real time.</p>
      </header>
      <main>
        <section>
          <h2>Create a Poll</h2>
          <PollCreateForm onCreate={handleCreate} />
        </section>
        <section>
          <h2>Latest Polls</h2>
          <PollList polls={polls} onVote={handleVote} onLike={handleLike} />
        </section>
      </main>
    </div>
  );
}
