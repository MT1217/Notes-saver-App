import Note from '../models/Note.js';

// @desc    Get user notes
// @route   GET /api/notes
export const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.status(200).json(notes);
};

// @desc    Create new note
// @route   POST /api/notes
export const createNote = async (req, res) => {
  const { title, content } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Please add a text field' });
  }

  const note = await Note.create({
    title,
    content,
    user: req.user._id,
  });

  res.status(201).json(note);
};

// @desc    Update a note
// @route   PUT /api/notes/:id
export const updateNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) return res.status(404).json({ message: 'Note not found' });
  
  // Ensure the logged-in user matches the note creator
  if (note.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedNote);
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
export const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) return res.status(404).json({ message: 'Note not found' });

  if (note.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  await note.deleteOne();
  res.status(200).json({ id: req.params.id });
};