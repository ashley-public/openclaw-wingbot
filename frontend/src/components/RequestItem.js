import React from 'react';

export default function RequestItem({
  r,
  selectedId,
  onSelect,
  getAvatar,
  avatarStyle,
}) {
  const isActive = String(selectedId) === String(r.id);

  return (
    <button
      type="button"
      onClick={() => onSelect(r.id)}
      id={`req-${r.id}`}
      className={`list-group-item list-group-item-action p-3 d-flex gap-3 border-start-0 border-end-0 ${
        isActive ? 'active' : ''
      }`}
    >
      <img src={getAvatar(r.from)} style={avatarStyle} alt="bot" />
      <div className="flex-grow-1">
        <div className="request-text mb-1">{r.message}</div>
        <span
          className={`badge bg-${r.status === 'open' ? 'success' : 'secondary'} opacity-75`}
          style={{ fontSize: '0.7rem' }}
        >
          {r.status}
        </span>
      </div>
    </button>
  );
}
