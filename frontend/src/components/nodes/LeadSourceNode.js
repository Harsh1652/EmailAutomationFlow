import React from 'react';
import { XCircle } from 'lucide-react';
import NodeHeader from './NodeHeader';

const LeadSourceNode = ({
  node,
  isSelected,
  style,
  selectNode,
  startConnection,
  updateNodeData,
  deleteNode
}) => {
  return (
    <div 
      className={`bg-green-100 p-4 rounded-md border shadow-md ${isSelected ? 'border-green-500 ring-2 ring-green-300' : 'border-green-300'}`}
      style={style}
      onMouseDown={(e) => selectNode(node, e)}
    >
      <NodeHeader 
        title="Lead Source"
        color="green"
        nodeId={node.id}
        startConnection={startConnection}
        deleteNode={deleteNode}
      />
      
      <select
        className="w-full p-2 border border-gray-300 rounded"
        value={node.data.source || ''}
        onChange={(e) => updateNodeData(node.id, { source: e.target.value })}
        onClick={(e) => e.stopPropagation()}
      >
        <option value="">Select source...</option>
        <option value="website">Website</option>
        <option value="referral">Referral</option>
        <option value="social">Social Media</option>
        <option value="event">Event</option>
      </select>
    </div>
  );
};

export default LeadSourceNode;