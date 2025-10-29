import React from 'react';

export default function PollCard({ poll, onVote, onLike, onDelete }) {
  const totalVotes = poll.options.reduce((s, o) => s + (o.votes || 0), 0);
  return (
    <div className="card">
      <div className="card-header">
        <h3>{poll.question}</h3>
      </div>
      <div className="card-body">
        {poll.options.map((opt, idx) => {
          const pct = totalVotes ? Math.round((opt.votes / totalVotes) * 100) : 0;
          return (
            <div key={idx} className="option">
              <button className="vote" onClick={() => onVote(poll._id, idx)}>{opt.text}</button>
              <div className="bar">
                <div className="fill" style={{ width: pct + '%' }}></div>
              </div>
              <span className="count">{opt.votes} votes ({pct}%)</span>
            </div>
          );
        })}
      </div>
      <div className="card-footer">
        <div className="actions">
          <button className="like" onClick={() => onLike(poll._id)}>❤ {poll.likes}</button>
          <button className="danger" onClick={() => onDelete?.(poll._id)}>Delete</button>
        </div>
        <span className="meta">{new Date(poll.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
}
