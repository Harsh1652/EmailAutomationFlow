import React from 'react';

const NodeType = ({ type, label, color, isDragging, onDragStart, onDragEnd }) => {
  return (
    <div 
      className={`bg-${color}-100 p-3 rounded border-2 border-${color}-300 cursor-grab ${isDragging ? 'opacity-50' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      onDragEnd={onDragEnd}
    >
      {label}
    </div>
  );
};

export default NodeType;