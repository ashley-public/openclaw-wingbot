import React from 'react';
import RequestItem from './RequestItem';

export default function Sidebar({
  bots,
  requests,
  currentFilter,
  selectedId,
  onFilter,
  onSelect,
  getAvatar,
}) {
  const avatarStyle = { width: 24, height: 24, borderRadius: '50%' };

  return (
    <aside
      className="sidebar bg-white border-end p-3"
      style={{ width: '400px' }}
    >
      <div className="section-header mb-2">Online Bots</div>
      <ul className="list-group list-group-flush mb-3">
        {bots.map(b => (
          <li key={b.uuid} className="list-group-item d-flex align-items-center gap-2 py-2">
            <img src={getAvatar(b.uuid)} style={avatarStyle} alt="bot" />
            <span className="small fw-bold">{b.name || b.uuid}</span>
          </li>
        ))}
      </ul>

      <div className="section-header d-flex justify-content-between align-items-center">
        <span>All Requests</span>
        <div className="btn-group btn-group-sm">
          <button
            type="button"
            className={`btn btn-outline-secondary ${currentFilter === null ? 'active' : ''}`}
            onClick={() => onFilter(null)}
          >
            All
          </button>
          <button
            type="button"
            className={`btn btn-outline-secondary ${currentFilter === 'open' ? 'active' : ''}`}
            onClick={() => onFilter('open')}
          >
            Open
          </button>
        </div>
      </div>

      <ul id="requests-list" className="list-group list-group-flush mt-1">
        {requests.map(r => (
          <RequestItem
            key={r.id}
            r={r}
            selectedId={selectedId}
            onSelect={onSelect}
            getAvatar={getAvatar}
            avatarStyle={avatarStyle}
          />
        ))}
      </ul>
    </aside>
  );
}
