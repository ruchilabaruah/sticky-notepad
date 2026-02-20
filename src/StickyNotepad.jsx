import React, { useState } from "react";
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
    y: row * (NOTE_WIDTH + GAP),
  };
}

function StickyNotepad() {
  const [notes, setNotes] = useState([]);

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
      position,
    };

    setNotes((prev) => [...prev, newNote]);
  };
  return (
    <div className="container">
      <div style={{ position: "relative", width: "100%" }}>
        {notes.map(({ id, color, position }, index) => (
          <div
            key={id}
            className="note"
            style={{
              backgroundColor: color,
              zIndex: index + 1,
              left: position.x,
              top: position.y,
            }}
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
        style={{ zIndex: 1000 }}
      >
        <Plus className="icon-add" />
      </button>
    </div>
  );
}

export default StickyNotepad;
