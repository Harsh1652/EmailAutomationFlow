import React from 'react';
import NodeType from './NodeType';

const Sidebar = ({ nodeDragging, setNodeDragging, savedFlows }) => {
  const onSidebarDragStart = (e, type) => {
    e.dataTransfer.setData('application/nodetype', type);
    setNodeDragging(type);
  };

  return (
    <div className="w-64 bg-gray-100 p-4 flex flex-col gap-4">
      <h2 className="font-bold text-lg">Node Types</h2>
      
      <NodeType 
        type="coldEmail"
        label="Cold Email"
        color="blue"
        isDragging={nodeDragging === 'coldEmail'}
        onDragStart={onSidebarDragStart}
        onDragEnd={() => setNodeDragging(null)}
      />
      
      <NodeType 
        type="wait"
        label="Wait/Delay"
        color="yellow"
        isDragging={nodeDragging === 'wait'}
        onDragStart={onSidebarDragStart}
        onDragEnd={() => setNodeDragging(null)}
      />
      
      <NodeType 
        type="leadSource"
        label="Lead Source"
        color="green"
        isDragging={nodeDragging === 'leadSource'}
        onDragStart={onSidebarDragStart}
        onDragEnd={() => setNodeDragging(null)}
      />

      {savedFlows.length > 0 && (
        <>
          <h2 className="font-bold text-lg mt-6">Saved Flows</h2>
          <div className="overflow-y-auto">
            {savedFlows.map((flow, index) => (
              <div key={index} className="bg-white p-3 rounded shadow mb-2">
                <div className="font-bold">{flow.name}</div>
                <div className="text-xs text-gray-500">
                  Saved: {new Date(flow.savedAt).toLocaleString()}
                </div>
                <div className="text-xs text-gray-700 mt-1">
                  {flow.scheduledEmails.length} emails scheduled
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;