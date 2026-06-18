import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function NoteModal({ isOpen, onClose, mode, note, onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Populate fields when editing or viewing an existing note
  useEffect(() => {
    if (note && (mode === 'edit' || mode === 'view')) {
      setTitle(note.title);
      setContent(note.content || '');
    } else {
      setTitle('');
      setContent('');
    }
  }, [note, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm transition-all">
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full flex flex-col transition-all duration-300 ${
          mode === 'view' ? 'max-w-5xl h-[85vh]' : 'max-w-2xl h-[70vh] sm:h-auto'
        }`}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'create' && 'Create New Note'}
            {mode === 'edit' && 'Edit Note'}
            {mode === 'view' && title}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {mode === 'view' ? (
            <div className="whitespace-pre-wrap text-gray-700 text-lg leading-relaxed font-serif">
              {content || <span className="text-gray-400 italic">No content provided.</span>}
            </div>
          ) : (
            <form id="note-form" onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-lg font-medium"
                  placeholder="What is this note about?"
                />
              </div>
              <div className="flex-1 min-h-[250px] flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full flex-1 p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition-all"
                  placeholder="Start typing your thoughts here..."
                ></textarea>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer (Hidden in View mode) */}
        {mode !== 'view' && (
          <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
            <button 
              type="button"
              onClick={onClose} 
              className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              form="note-form" 
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95"
            >
              {mode === 'create' ? 'Save Note' : 'Update Note'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}