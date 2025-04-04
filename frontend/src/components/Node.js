import React from 'react';
import ColdEmailNode from './nodes/ColdEmailNode';
import WaitNode from './nodes/WaitNode';
import LeadSourceNode from './nodes/LeadSourceNode';

const Node = ({
  node,
  isSelected,
  selectNode,
  startConnection,
  updateNodeData,
  deleteNode,
  canvasOffset
}) => {
  const nodeStyle = {
    position: 'absolute',
    left: `${node.position.x}px`,
    top: `${node.position.y}px`,
    width: '200px',
    cursor: 'move'
  };

  // Render node based on type
  switch (node.type) {
    case 'coldEmail':
      return (
        <ColdEmailNode
          node={node}
          isSelected={isSelected}
          style={nodeStyle}
          selectNode={selectNode}
          startConnection={startConnection}
          updateNodeData={updateNodeData}
          deleteNode={deleteNode}
        />
      );
      
    case 'wait':
      return (
        <WaitNode
          node={node}
          isSelected={isSelected}
          style={nodeStyle}
          selectNode={selectNode}
          startConnection={startConnection}
          updateNodeData={updateNodeData}
          deleteNode={deleteNode}
        />
      );
      
    case 'leadSource':
      return (
        <LeadSourceNode
          node={node}
          isSelected={isSelected}
          style={nodeStyle}
          selectNode={selectNode}
          startConnection={startConnection}
          updateNodeData={updateNodeData}
          deleteNode={deleteNode}
        />
      );
      
    default:
      return null;
  }
};

export default Node;