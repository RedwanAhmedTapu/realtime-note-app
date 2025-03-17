const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
