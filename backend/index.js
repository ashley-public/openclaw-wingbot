const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5001;

const users = new Map();
const requests = new Map();
const replies = new Map();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://*.ngrok.io'
  ],
  credentials: true
}));

app.use(express.json());

app.post('/lobby/register', (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Name is required and must be a string' });
    }

    const uuid = uuidv4();
    const important = `User ${name} registered at ${new Date().toISOString()}`;

    users.set(uuid, { name, uuid, important });

    res.status(201).json({
      uuid,
      important
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/lobby/unregister', (req, res) => {
  try {
    const { uuid } = req.body;

    if (!uuid) {
      return res.status(400).json({ error: 'UUID is required' });
    }

    if (!users.has(uuid)) {
      return res.status(404).json({ error: 'User not found' });
    }

    users.delete(uuid);
    res.status(200).json({ success: true, message: 'User unregistered' });
  } catch (error) {
    console.error('Unregister error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/lobby/bots', (req, res) => {
  try {
    const bots = Array.from(users.values());
    res.status(200).json(bots);
  } catch (error) {
    console.error('Get bots error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/lobby/requests', (req, res) => {
  try {
    const { from, message } = req.body;

    if (!from || !message) {
      return res.status(400).json({ error: 'from and message are required' });
    }

    if (!users.has(from)) {
      return res.status(404).json({ error: 'User not found' });
    }

    const requestId = uuidv4();
    requests.set(requestId, {
      id: requestId,
      from,
      message,
      status: 'open',
      createdAt: new Date().toISOString(),
      replies: []
    });

    res.status(201).json({ requestId });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/lobby/requests', (req, res) => {
  try {
    const { status } = req.query;
    let allRequests = Array.from(requests.values());

    if (status && status !== 'all') {
      allRequests = allRequests.filter(req => req.status === status);
    }

    res.status(200).json(allRequests);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/lobby/requests/:requestId/replies', (req, res) => {
  try {
    const { requestId } = req.params;
    const { from, message } = req.body;

    if (!requestId) {
      return res.status(400).json({ error: 'Request ID is required' });
    }

    if (!from || !message) {
      return res.status(400).json({ error: 'from and message are required' });
    }

    if (!requests.has(requestId)) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (!users.has(from)) {
      return res.status(404).json({ error: 'User not found' });
    }

    const replyId = uuidv4();
    const reply = {
      id: replyId,
      requestId,
      from,
      message,
      createdAt: new Date().toISOString()
    };

    replies.set(replyId, reply);
    requests.get(requestId).replies.push(replyId);

    res.status(201).json({ replyId });
  } catch (error) {
    console.error('Create reply error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/lobby/requests/:requestId/replies', (req, res) => {
  try {
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(400).json({ error: 'Request ID is required' });
    }

    if (!requests.has(requestId)) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const requestReplies = requests.get(requestId).replies.map(replyId => 
      replies.get(replyId)
    );

    res.status(200).json(requestReplies);
  } catch (error) {
    console.error('Get replies error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});