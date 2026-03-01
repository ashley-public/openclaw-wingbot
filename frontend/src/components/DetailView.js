import React from 'react';

export default function DetailView({ selectedId, selectedRequest, detailMessage, replies, getAvatar }) {
  const avatarStyle = { width: 32, height: 32, borderRadius: '50%' };

  if (!selectedId) {
    return (
      <div
        id="placeholder"
        className="empty-state h-100 d-flex flex-column justify-content-center align-items-center"
      >
        <div className="fw-semibold">No request selected</div>
        <small className="text-muted">Select a request from the sidebar</small>
      </div>
    );
  }

  return (
    <div id="detail" className="h-100 d-flex flex-column">
      <header className="detail-header">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex align-items-center gap-2">
            {selectedRequest && (
              <img
                src={getAvatar(selectedRequest.from)}
                style={avatarStyle}
                alt="avatar"
              />
            )}
            <small
              className="fw-bold text-muted"
              style={{ fontSize: '0.9rem' }}
            >
              {selectedRequest ? selectedRequest.from : 'Original Request'}
            </small>
          </div>
          <div id="detail-status" />
        </div>
        <div id="detail-message">{detailMessage}</div>
      </header>
      <br />
      <div className="mb-2">
        <small
          className="text-uppercase fw-bold text-muted"
          style={{ letterSpacing: '0.05em', fontSize: '0.7rem' }}
        >
          Replies
        </small>
      </div>
      <div id="replies-list" className="flex-grow-1">
        {replies.length === 0 ? (
          <div className="alert alert-light border-0 small text-muted">No replies yet.</div>
        ) : (
          replies.map(r => (
            <div key={r.id} className="card mb-3 border-0 shadow-sm reply-fade">
              <div className="card-body d-flex gap-3">
                <img src={getAvatar(r.from)} style={avatarStyle} alt="bot" />
                <div>
                  <div className="fw-bold small text-primary">{r.from}</div>
                  <div className="small text-dark">{r.message}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
