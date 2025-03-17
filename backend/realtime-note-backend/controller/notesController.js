const Note = require('../models/Note');
let io;

const setIoInstance = (socketIoInstance) => {
  io = socketIoInstance;
};

// Track active editors for each note
const activeEditors = new Map(); // { noteId: Set of user IDs }

// Create a new note
const createNote = async (req, res) => {
  const { title, content } = req.body;

  try {
    const newNote = new Note({
      title,
      content,
      author: req.userId,
    });
    await newNote.save();

    // Emit the new note to all clients
    io.emit('noteCreated', newNote);

    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create note' });
  }
};

// Fetch all notes for the logged-in user
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({});
    res.status(200).json(notes);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch notes' });
  }
};

// Update an existing note
const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const { title, content } = req.body;

  try {
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
   
    note.title = title;
    note.content = content;
    note.updatedAt = Date.now();
    await note.save();

    // Emit the updated note to all clients
    io.emit('noteUpdated', note);

    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update note' });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  try {
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
   

    await Note.deleteOne({ _id: noteId });

    // Emit the deleted note ID to all clients
    io.emit('noteDeleted', noteId);

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete note' });
  }
};

// Track users editing a note
const trackEditors = (socket) => {
  socket.on('startEditing', ({ noteId, userId }) => {
    if (!activeEditors.has(noteId)) {
      activeEditors.set(noteId, new Set());
    }
    activeEditors.get(noteId).add(userId);

    // Emit the list of active editors to all clients
    io.emit('activeEditors', { noteId, editors: Array.from(activeEditors.get(noteId)) });
  });

  socket.on('stopEditing', ({ noteId, userId }) => {
    if (activeEditors.has(noteId)) {
      activeEditors.get(noteId).delete(userId);

      // Emit the updated list of active editors to all clients
      io.emit('activeEditors', { noteId, editors: Array.from(activeEditors.get(noteId)) });
    }
  });
};

module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  setIoInstance,
  trackEditors,
};