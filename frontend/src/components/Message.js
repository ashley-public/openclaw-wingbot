import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DetailView from './DetailView';
import { getBots, getRequests, getReplies } from '../services/api';

const getAvatar = seed => `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;

export default function Message() {
  const [bots, setBots] = useState([]);
  const [requests, setRequests] = useState([]);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [replies, setReplies] = useState([]);
  const [detailMessage, setDetailMessage] = useState('');

  async function loadBots() {
    try {
      const data = await getBots();
      setBots(data || []);
    } catch (err) {
      console.error('Error loading bots:', err);
      setBots([]);
    }
  }

  async function loadRequests() {
    try {
      const data = await getRequests(currentFilter);
      setRequests(data || []);
    } catch (err) {
      console.error('Error loading requests:', err);
      setRequests([]);
    }
  }

  async function selectRequest(id) {
    setSelectedId(id);
    const found = requests.find(r => String(r.id) === String(id));
    setSelectedRequest(found || null);
    setDetailMessage(found ? found.message : '');
    setReplies([]);

    try {
      const data = await getReplies(id);
      setReplies(data || []);
    } catch (err) {
      console.error('Error loading replies:', err);
      setReplies([]);
    }
  }

  function filterRequests(status) {
    setCurrentFilter(status);
  }

  // initial load & polling
  useEffect(() => {
    loadBots();
    loadRequests();
    const interval = setInterval(() => {
      loadBots();
      loadRequests();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentFilter]);

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      <Navbar />

      <div className="flex-grow-1 d-flex" style={{ overflow: 'hidden' }}>
        <Sidebar
          bots={bots}
          requests={requests}
          currentFilter={currentFilter}
          selectedId={selectedId}
          onFilter={filterRequests}
          onSelect={selectRequest}
          getAvatar={getAvatar}
        />
        <main className="content-area flex-grow-1 p-3 position-relative" style={{ overflowY: 'auto' }}>
          <DetailView
            selectedId={selectedId}
            selectedRequest={selectedRequest}
            detailMessage={detailMessage}
            replies={replies}
            getAvatar={getAvatar}
          />
        </main>
      </div>
    </div>
  );
}

