import React from 'react';
import { XCircle } from 'lucide-react';
import NodeHeader from './NodeHeader';

const ColdEmailNode = ({
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
      className={`bg-blue-100 p-4 rounded-md border shadow-md ${isSelected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-blue-300'}`}
      style={style}
      onMouseDown={(e) => selectNode(node, e)}
    >
      <NodeHeader 
        title="Cold Email"
        color="blue"
        nodeId={node.id}
        startConnection={startConnection}
        deleteNode={deleteNode}
      />
      
      <input 
        className="w-full p-2 border border-gray-300 rounded mb-2"
        placeholder="Subject"
        value={node.data.subject || ''}
        onChange={(e) => updateNodeData(node.id, { subject: e.target.value })}
        onClick={(e) => e.stopPropagation()}
      />
      <textarea
        className="w-full p-2 border border-gray-300 rounded h-16"
        placeholder="Email content..."
        value={node.data.content || ''}
        onChange={(e) => updateNodeData(node.id, { content: e.target.value })}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default ColdEmailNode;