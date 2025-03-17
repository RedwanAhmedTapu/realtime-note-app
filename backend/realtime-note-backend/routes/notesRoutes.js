const express = require('express');
const verifyToken = require('../middleware/authMiddleWare');

const { createNote, getNotes, updateNote, deleteNote } = require('../controller/notesController');

const router = express.Router();

router.post('/', verifyToken, createNote);
router.get('/', verifyToken, getNotes);
router.put('/:noteId', verifyToken, updateNote);
router.delete('/:noteId', verifyToken, deleteNote);

module.exports = router;
