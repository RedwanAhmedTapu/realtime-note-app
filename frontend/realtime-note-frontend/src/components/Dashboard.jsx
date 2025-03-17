"use client";
import { useContext, useState, useEffect } from "react";
import { FileText } from "lucide-react";
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import AuthContext from "../context/AuthContext";
import useAxios from "../lib/api";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa"; 
import { Tooltip } from "react-tooltip"; 
const socket = io("http://localhost:5000"); 

const Dashboard = () => {
  const { logout, accessToken } = useContext(AuthContext);
  const axiosInstance = useAxios();

  // Decode the accessToken to get user information
  const decodedToken = accessToken ? jwtDecode(accessToken) : null;
  const userId = decodedToken?.id; 
  const username = decodedToken?.username; 

  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteTitle, setEditingNoteTitle] = useState("");
  const [editingNoteContent, setEditingNoteContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeEditors, setActiveEditors] = useState({});

  // Fetching the list of notes
  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/api/notes");
      setNotes(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch notes. Please try again.");
      console.error("Error fetching notes:", err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to create a new note
  const createNote = async () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      setError("Title and content cannot be empty.");
      return;
    }
    try {
      await axiosInstance.post("/api/notes", {
        title: newNoteTitle,
        content: newNoteContent,
        lastUpdatedBy: username,
      });
      setNewNoteTitle("");
      setNewNoteContent("");
      setError("");
    } catch (err) {
      setError("Failed to create note. Please try again.");
      console.error("Error creating note:", err.response?.data?.message);
    }
  };

  // Function to update an existing note
  const updateNote = async () => {
    if (!editingNoteTitle.trim() || !editingNoteContent.trim()) {
      setError("Title and content cannot be empty.");
      return;
    }
    try {
      const res = await axiosInstance.put(`/api/notes/${editingNoteId}`, {
        title: editingNoteTitle,
        content: editingNoteContent,
        lastUpdatedBy: username,
      });
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === editingNoteId ? { ...note, ...res.data } : note
        )
      );
      setEditingNoteId(null);
      setEditingNoteTitle("");
      setEditingNoteContent("");
      setError("");
    } catch (err) {
      setError("Failed to update note. Please try again.");
      console.error("Error updating note:", err.response?.data?.message);
    }
  };

  // Function to delete a note
  const deleteNote = async (id) => {
    try {
      await axiosInstance.delete(`/api/notes/${id}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      setError("");
    } catch (err) {
      setError("Failed to delete note. Please try again.");
      console.error("Error deleting note:", err.response?.data?.message);
    }
  };

  // UseEffect for real-time updates
  useEffect(() => {
    socket.on("noteUpdated", (updatedNote) => {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === updatedNote._id ? updatedNote : note
        )
      );
    });

    socket.on("noteCreated", (newNote) => {
      setNotes((prevNotes) => [newNote, ...prevNotes]);
    });

    socket.on("noteDeleted", (deletedNoteId) => {
      setNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== deletedNoteId)
      );
    });

    socket.on("activeEditors", ({ noteId, editors }) => {
      setActiveEditors((prev) => ({ ...prev, [noteId]: editors }));
    });

    return () => {
      socket.off("noteUpdated");
      socket.off("noteCreated");
      socket.off("noteDeleted");
      socket.off("activeEditors");
    };
  }, []);

  // Track when a user starts/stops editing a note
  useEffect(() => {
    if (editingNoteId && userId) {
      socket.emit("startEditing", { noteId: editingNoteId, userId, username });
    } else {
      socket.emit("stopEditing", { noteId: editingNoteId, userId });
    }
  }, [editingNoteId, userId]);

  // Fetch notes when the component mounts
  useEffect(() => {
    if (accessToken) {
      fetchNotes();
    }
  }, [accessToken]);

  // Function to split email and show only the name part
  const getDisplayName = (email) => {
    return email.split("@")[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto flex gap-6">
        {/* Create/Edit Note Form */}
        <div className="w-1/3 bg-slate-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-teal-500 mb-4">
            {editingNoteId ? "Edit Note" : "Create a New Note"}
          </h2>
          <input
            type="text"
            value={editingNoteId ? editingNoteTitle : newNoteTitle}
            onChange={(e) =>
              editingNoteId
                ? setEditingNoteTitle(e.target.value)
                : setNewNoteTitle(e.target.value)
            }
            placeholder="Enter note title"
            className="w-full p-2 border border-slate-500 rounded-lg mb-4 bg-slate-800 text-orange-50 placeholder-slate-400 focus:outline-none focus:border-slate-400 text-sm"
          />
          <textarea
            value={editingNoteId ? editingNoteContent : newNoteContent}
            onChange={(e) =>
              editingNoteId
                ? setEditingNoteContent(e.target.value)
                : setNewNoteContent(e.target.value)
            }
            placeholder="Enter note content"
            className="w-full p-2 border border-slate-500 rounded-lg mb-4 bg-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-slate-400 text-sm"
            rows="4"
          />
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <div className="flex gap-2">
            {editingNoteId ? (
              <>
                <button
                  onClick={updateNote}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition-colors flex items-center gap-2 text-sm"
                  data-tooltip-id="update-tooltip"
                  data-tooltip-content="Update Note"
                >
                  <FaSave />
                </button>
                <button
                  onClick={() => setEditingNoteId(null)}
                  className="bg-red-600 text-slate-200 px-4 py-2 rounded-lg hover:bg-red-500 transition-colors flex items-center gap-2 text-sm"
                  data-tooltip-id="cancel-tooltip"
                  data-tooltip-content="Cancel"
                >
                  <FaTimes />
                </button>
              </>
            ) : (
              <button
                onClick={createNote}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2 text-sm"
                data-tooltip-id="create-tooltip"
                data-tooltip-content="Create Note"
              >
                <FaPlus className="text-slate-50" />
              </button>
            )}
          </div>
          <Tooltip id="create-tooltip" />
          <Tooltip id="update-tooltip" />
          <Tooltip id="cancel-tooltip" />
        </div>

        {/*  Notes List */}
        <div className="w-2/3 bg-slate-900 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-teal-500">Your Notes</h2>
            <button
              onClick={logout}
              className="bg-slate-800 text-slate-200 border border-blue-500 px-4 py-2 rounded-lg hover:bg-slate-700 hover:border-blue-400 transition-all duration-200 text-sm shadow-sm"
            >
              Logout
            </button>
          </div>
          {isLoading ? (
            <p className="text-center text-slate-400 text-sm">
              Loading notes...
            </p>
          ) : notes.length === 0 ? (
            <p className="text-center text-teal-500 text-sm">No notes found.</p>
          ) : (
            <div className="max-h-[500px] overflow-y-auto pr-2">
              <ul className="space-y-4">
                {notes.map((note) => (
                  <li
                    key={note._id}
                    className="border border-slate-600 rounded-lg p-4 bg-slate-800"
                  >
                    <h3 className="text-lg font-semibold flex gap-x-2">
                      <span className="text-2xl text-blue-400">#</span>
                      <span className="text-slate-200">{note.title}</span>
                    </h3>

                    <p className="text-slate-400 text-sm mt-2 flex items-center gap-x-2">
                      <FileText className="w-4 h-4 text-green-500" />
                      {note.content}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingNoteId(note._id);
                          setEditingNoteTitle(note.title);
                          setEditingNoteContent(note.content);
                        }}
                        className="bg-slate-500 text-white px-3 py-1 rounded-lg hover:bg-slate-400 transition-colors flex items-center gap-2 text-sm"
                        data-tooltip-id="edit-tooltip"
                        data-tooltip-content="Edit Note"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteNote(note._id)}
                        className="bg-slate-600 text-slate-200 px-3 py-1 rounded-lg hover:bg-slate-500 transition-colors flex items-center gap-2 text-sm"
                        data-tooltip-id="delete-tooltip"
                        data-tooltip-content="Delete Note"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    {/*  active editors */}
                    <div className="mt-2">
                      {activeEditors[note._id]?.length > 0 && (
                        <p className="text-xs flex gap-x-1">
                          <span className="text-blue-400 font-medium">
                            Currently editing:
                          </span>
                          <span className="text-slate-400">
                            {activeEditors[note._id]
                              .map(getDisplayName)
                              .join(", ")}
                          </span>
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Tooltip id="edit-tooltip" />
          <Tooltip id="delete-tooltip" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
