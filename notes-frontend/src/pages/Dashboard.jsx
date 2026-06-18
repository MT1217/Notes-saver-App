import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, Edit3, Eye } from 'lucide-react';
import axios from 'axios';
import NoteModal from '../components/NoteModal';

const API_URL = 'http://localhost:5000/api/notes';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State Management
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [currentNote, setCurrentNote] = useState(null);

  // Setup Axios config with the user's JWT token
  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  // Fetch all notes when the dashboard loads
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(API_URL, config);
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) fetchNotes();
  }, [user]);

  // Handle Logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Create or Update Note API Submission
  const handleModalSubmit = async (noteData) => {
    try {
      if (modalMode === 'create') {
        const response = await axios.post(API_URL, noteData, config);
        setNotes([response.data, ...notes]); // Add new note to the top of the UI
      } else if (modalMode === 'edit') {
        const response = await axios.put(`${API_URL}/${currentNote._id}`, noteData, config);
        setNotes(notes.map((note) => (note._id === currentNote._id ? response.data : note))); // Update specific note in UI
      }
      closeModal();
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note. Please try again.");
    }
  };

  // Delete Note API Request
  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevents the card click event from firing
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await axios.delete(`${API_URL}/${id}`, config);
        setNotes(notes.filter((note) => note._id !== id)); // Remove from UI instantly
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  // Modal Helper Functions
  const openCreateModal = () => {
    setModalMode('create');
    setCurrentNote(null);
    setIsModalOpen(true);
  };

  const openEditModal = (note, e) => {
    e.stopPropagation();
    setModalMode('edit');
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  const openViewModal = (note) => {
    setModalMode('view');
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentNote(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-40 shadow-sm gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          My Notes
        </h1>
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-slate-600">Welcome, {user?.name}</span>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8 mt-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h2 className="text-3xl font-bold text-slate-800">Recent Notes</h2>
          <button 
            onClick={openCreateModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 active:translate-y-0 font-medium"
          >
            <Plus size={20} /> Create Note
          </button>
        </div>

        {/* Notes Grid Display */}
        {isLoading ? (
          <div className="text-center py-20 text-slate-500 animate-pulse">Loading your notes...</div>
        ) : notes.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-300">
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No notes yet</h3>
            <p className="text-slate-500">Click the 'Create Note' button to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div 
                key={note._id} 
                onClick={() => openViewModal(note)}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group cursor-pointer flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-800 line-clamp-1 pr-4">{note.title}</h3>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => openEditModal(note, e)}
                      className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Note"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(note._id, e)}
                      className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <p className="text-slate-600 line-clamp-4 leading-relaxed flex-1">
                  {note.content || "No content."}
                </p>
                
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 group-hover:text-indigo-500 transition-colors">
                    <Eye size={14} /> Click to view
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Render the Modal */}
      <NoteModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={modalMode}
        note={currentNote}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}