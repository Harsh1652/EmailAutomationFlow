import React from 'react';
import { XCircle } from 'lucide-react';

const NodeHeader = ({ title, color, nodeId, startConnection, deleteNode }) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <div className={`font-bold text-${color}-800`}>{title}</div>
      <div className="flex items-center gap-2">
        <div 
          className={`w-4 h-4 bg-${color}-500 rounded-full cursor-pointer`}
          onMouseDown={(e) => startConnection(nodeId, e)}
        />
        <XCircle
          className="h-5 w-5 text-red-500 cursor-pointer" 
          onClick={() => deleteNode(nodeId)}
        />
      </div>
    </div>
  );
};

export default NodeHeader;