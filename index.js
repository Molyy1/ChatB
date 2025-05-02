const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Supabase
const supabase = createClient(
  'https://xdfxnsrqphgwtjiwtzxg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZnhuc3JxcGhnd3RqaXd0enhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5OTYyMTksImV4cCI6MjA2MTU3MjIxOX0.5sQz9xklslwjFVNdMw1YFTzymMyWdtkgdKLEvp8g9iY'
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// GET endpoint
app.get('/messages', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('chatter')
      .select('id, content, username, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST endpoint
app.post('/messages', async (req, res) => {
  try {
    const { content, username } = req.body;

    if (!content || !username) {
      return res.status(400).json({ error: "Content and username required" });
    }

    const { data, error } = await supabase
      .from('chatter')
      .insert([{ content, username }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

// DELETE endpoint
app.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('chatter')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});