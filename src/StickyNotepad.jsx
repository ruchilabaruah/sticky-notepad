import React from "react";
import { Plus, X } from "lucide-react";
import "./App.css";

function StickyNotepad() {
  return (
    <div className="container">
      <button className="add-note-btn">
        <Plus className="icon-add" />
      </button>
    </div>
  );
}

export default StickyNotepad;
