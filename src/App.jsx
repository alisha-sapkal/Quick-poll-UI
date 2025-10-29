import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { API_BASE, createPoll, fetchPolls, likePoll, votePoll, deletePoll } from './api.js';
import PollCreateForm from './components/PollCreateForm.jsx';
import PollList from './components/PollList.jsx';

const STREAM_BASE = API_BASE || '';

export default function App() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    fetchPolls().then(setPolls).catch(console.error);
  }, []);

  useEffect(() => {
    const es = new EventSource(`${STREAM_BASE}/api/stream`);
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
    const onDeleted = (e) => {
      const data = JSON.parse(e.data);
      setPolls((prev) => prev.filter((p) => p._id !== data._id));
    };
    es.addEventListener('pollCreated', onCreated);
    es.addEventListener('pollUpdated', onUpdated);
    es.addEventListener('pollLiked', onLiked);
    es.addEventListener('pollDeleted', onDeleted);
    es.onerror = () => {
      // Let browser retry automatically; optional logging
    };
    return () => {
      es.removeEventListener('pollCreated', onCreated);
      es.removeEventListener('pollUpdated', onUpdated);
      es.removeEventListener('pollLiked', onLiked);
      es.removeEventListener('pollDeleted', onDeleted);
      es.close();
    };
  }, []);

  const handleCreate = async (data) => {
    try {
      const created = await createPoll(data);
      if (!created?._id) throw new Error('Create failed');
      setPolls((prev) => prev.some((p) => p._id === created._id) ? prev : [created, ...prev]);
      toast.success('Poll created successfully');
    } catch (e) {
      console.error('Create poll failed:', e);
      toast.error(e?.message || 'Failed to create poll');
      throw e;
    }
  };

  const handleVote = async (id, optionIndex) => {
    await votePoll(id, optionIndex);
  };

  const handleLike = async (id) => {
    await likePoll(id);
  };

  const handleDelete = async (id) => {
    try {
      await deletePoll(id);
      setPolls((prev) => prev.filter((p) => p._id !== id));
      toast.success('Poll deleted');
    } catch (e) {
      console.error('Delete poll failed:', e);
      toast.error(e?.message || 'Failed to delete poll');
    }
  };

  return (
    <div className="container">
      <header>
        <h1>QuickPoll</h1>
        <p>Create polls, vote, like - live updates in real time.</p>
      </header>
      <Toaster position="top-center" richColors closeButton />
      <main>
        <section>
          <h2>Create a Poll</h2>
          <PollCreateForm onCreate={handleCreate} />
        </section>
        <section>
          <h2>Latest Polls</h2>
          <PollList polls={polls} onVote={handleVote} onLike={handleLike} onDelete={handleDelete} />
        </section>
      </main>
    </div>
  );
}
