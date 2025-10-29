import React from 'react';
import PollCard from './PollCard.jsx';

export default function PollList({ polls, onVote, onLike, onDelete }) {
  if (!polls?.length) return <p>No polls yet. Be the first to create one!</p>;
  return (
    <div className="grid">
      {polls.map((p) => (
        <PollCard key={p._id} poll={p} onVote={onVote} onLike={onLike} onDelete={onDelete} />
      ))}
    </div>
  );
}
