import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: { type: String, required: true },
    content: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Note', noteSchema);