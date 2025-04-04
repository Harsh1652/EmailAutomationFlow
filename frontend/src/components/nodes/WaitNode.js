import React from 'react';
import { XCircle } from 'lucide-react';
import NodeHeader from './NodeHeader';

const WaitNode = ({
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
      className={`bg-yellow-100 p-4 rounded-md border shadow-md ${isSelected ? 'border-yellow-500 ring-2 ring-yellow-300' : 'border-yellow-300'}`}
      style={style}
      onMouseDown={(e) => selectNode(node, e)}
    >
      <NodeHeader 
        title="Wait/Delay"
        color="yellow"
        nodeId={node.id}
        startConnection={startConnection}
        deleteNode={deleteNode}
      />
      
      <div className="flex items-center gap-2">
        <input 
          type="number" 
          min="1"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Delay time"
          value={node.data.delay || ''}
          onChange={(e) => updateNodeData(node.id, { delay: e.target.value })}
          onClick={(e) => e.stopPropagation()}
        />
        <select 
          className="p-2 border border-gray-300 rounded"
          value={node.data.timeUnit || 'days'}
          onChange={(e) => updateNodeData(node.id, { timeUnit: e.target.value })}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
          <option value="days">Days</option>
        </select>
      </div>
    </div>
  );
};

export default WaitNode;