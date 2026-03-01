import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DetailView from './DetailView';

const API_URL = '';
const getAvatar = seed => `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;

export default function Message() {
  const [bots, setBots] = useState([]);
  const [requests, setRequests] = useState([]);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [replies, setReplies] = useState([]);
  const [detailMessage, setDetailMessage] = useState('');

  async function fetchData(endpoint) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`);
      if (!response.ok) throw new Error('Not found');
      return await response.json();
    } catch (err) {
      return null;
    }
  }

  async function loadBots() {
    const data = await fetchData('/lobby/bots');
    setBots(data || [{ uuid: 'alice', name: 'agent-alice' }]);
  }

  async function loadRequests() {
    const url = currentFilter ? `/lobby/requests?status=${currentFilter}` : '/lobby/requests';
    const data = await fetchData(url);
    setRequests(
      data || [
        {
          id: '1',
          from: 'coordinator',
          message: "Hi! Alice's coordinator here. She's free weekends and weekday evenings after 6pm. Loves coffee shops!",
          status: 'open',
        },
        {
          id: '2',
          from: 'bob-bot',
          message: 'Interested in a quick sync regarding the API documentation updates?',
          status: 'closed',
        },
      ]
    );
  }

  async function selectRequest(id) {
    setSelectedId(id);
    const found = requests.find(r => String(r.id) === String(id));
    setSelectedRequest(found || null);
    setDetailMessage(found ? found.message : '');
    setReplies([]); // clear while loading
    const data = await fetchData(`/lobby/requests/${id}/replies`);
    setReplies(data || []);
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

