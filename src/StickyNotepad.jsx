import React, { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import "./App.css";

const COLORS = [
  "#FFFA65",
  "#FF9AA2",
  "#FFB7B2",
  "#FFDAC1",
  "#E2F0CB",
  "#B5EAD7",
  "#C7CEEA",
];

const NOTE_WIDTH = 200;
const NOTE_HEIGHT = 150;
const GAP = 15;
const COLUMNS = 3;

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function getGridPosition(index) {
  const col = index % COLUMNS;
  const row = Math.floor(index / COLUMNS);

  return {
    x: col * (NOTE_WIDTH + GAP), // Number of columns before it * (One sticky note width + Gap)
    y: row * (NOTE_HEIGHT + GAP),
  };
}

function StickyNotepad() {
  const [notes, setNotes] = useState([]);
  const containerRef = useRef(null);

  const addNote = () => {
    const occupiedPositions = new Set(
      notes.map((note) => `${note.position.x}, ${note.position.y}`),
    );

    let index = 0;
    let position = null;

    while (true) {
      const pos = getGridPosition(index);
      const key = `${pos.x}, ${pos.y}`;
      if (!occupiedPositions.has(key)) {
        position = pos;
        break;
      }
      index++;
    }
    const newNote = {
      id: Date.now(),
      text: "",
      isDragging: false,
      color: getRandomColor(),
      offset: { x: 0, y: 0 }, // Mouse position with respect to note while dragging
      position,
    };

    setNotes((prev) => [...prev, newNote]);
  };

  // Helper to bring current dragged note to front
  const bringNoteToFront = (id) => {
    setNotes((prev) => {
      const noteToFront = prev.find((note) => note.id === id);
      if (!noteToFront) return prev;

      const filtered = prev.filter((note) => note.id !== id);
      return [...filtered, noteToFront];
    });
  };

  const onMouseDown = (e, id) => {
    e.preventDefault();
    const containerRect = containerRef.current.getBoundingClientRect();
    const note = notes.find((note) => note.id === id);
    if (!note) return;

    bringNoteToFront(id);

    // We want the click position inside the note
    const offsetX = e.clientX - containerRect.left - note.position.x;
    const offsetY = e.clientY - containerRect.top - note.position.y;

    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, isDragging: true, offset: { x: offsetX, y: offsetY } }
          : n,
      ),
    );
  };

  const onMouseMove = (e) => {
    const containerRect = containerRef.current.getBoundingClientRect();

    setNotes((prev) =>
      prev.map((note) => {
        if (!note.isDragging) return note;

        // The note positions should move along with the mouse position during drag
        let x = e.clientX - containerRect.left - note.offset.x;
        let y = e.clientY - containerRect.top - note.offset.y;

        const maxX = containerRect.width - NOTE_WIDTH;
        const maxY = containerRect.height - NOTE_HEIGHT;

        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        return { ...note, position: { x, y } };
      }),
    );
  };

  const onMouseUp = () => {
    setNotes((prev) =>
      prev.map((note) =>
        note.isDragging ? { ...note, isDragging: false } : note,
      ),
    );
  };

  return (
    <div
      className="container"
      ref={containerRef}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseUp}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height:
            notes.length === 0
              ? "100%"
              : Math.max(
                  ...notes.map((note) => note.position?.y + NOTE_HEIGHT),
                ) + 30,
        }}
      >
        {notes.map(({ id, color, position }, index) => (
          <div
            key={id}
            className="note"
            style={{
              backgroundColor: color,
              zIndex: index + 1,
              left: position.x,
              top: position.y,
              position: "absolute",
              cursor: "grab",
            }}
            onMouseDown={(e) => onMouseDown(e, id)}
          >
            <button className="close-btn">
              <X className="icon-close" />
            </button>
            <textarea className="note-textarea" />
          </div>
        ))}
      </div>

      <button
        className="add-note-btn"
        onClick={addNote}
        title="Add New Note"
        style={{ zIndex: 1000 }}
      >
        <Plus className="icon-add" />
      </button>
    </div>
  );
}

export default StickyNote;
