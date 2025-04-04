import React, { useRef, useEffect } from 'react';
import Node from './Node';
import { renderEdge, renderConnectionLine } from '../utils/edgeRenderers';

const NodeCanvas = ({
  nodes,
  setNodes,
  edges,
  setEdges,
  selectedNode,
  setSelectedNode,
  dragging,
  setDragging,
  connecting,
  setConnecting,
  mousePos,
  setMousePos,
  canvasOffset,
  setCanvasOffset,
  nodeDragging,
  updateNodeData,
  deleteNode,
  addNode
}) => {
  const canvasRef = useRef(null);

  // Update canvas offset on mount and resize
  useEffect(() => {
    const updateOffset = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasOffset({ x: rect.left, y: rect.top });
      }
    };
    
    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, [setCanvasOffset]);

  // Track mouse position for drawing connections
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
    
    // Handle node dragging
    if (dragging !== null) {
      setNodes(nodes.map(node => 
        node.id === dragging.id 
          ? { 
              ...node, 
              position: { 
                x: e.clientX - canvasOffset.x - dragging.offsetX, 
                y: e.clientY - canvasOffset.y - dragging.offsetY 
              } 
            }
          : node
      ));
    }
  };

  // Handle node selection
  const selectNode = (node, e) => {
    e.stopPropagation();
    setSelectedNode(node.id);
    
    // Start dragging if not clicking an input
    if (!e.target.closest('input, textarea, select')) {
      setDragging({
        id: node.id,
        offsetX: e.clientX - canvasOffset.x - node.position.x,
        offsetY: e.clientY - canvasOffset.y - node.position.y
      });
    }
  };

  // Handle mouse up event (end dragging or connecting)
  const handleMouseUp = () => {
    setDragging(null);
    
    if (connecting) {
      // If we're over a valid target node, create an edge
      const targetNode = nodes.find(node => 
        mousePos.x >= node.position.x && 
        mousePos.x <= node.position.x + 200 && 
        mousePos.y >= node.position.y && 
        mousePos.y <= node.position.y + 120 &&
        node.id !== connecting.source
      );
      
      if (targetNode) {
        // Add new edge
        const newEdge = {
          id: `e-${connecting.source}-${targetNode.id}`,
          source: connecting.source,
          target: targetNode.id
        };
        
        // Check if this edge already exists
        const edgeExists = edges.some(edge => 
          edge.source === newEdge.source && edge.target === newEdge.target
        );
        
        if (!edgeExists) {
          setEdges([...edges, newEdge]);
        }
      }
    }
    
    setConnecting(null);
  };

  // Start creating a connection from a node
  const startConnection = (nodeId, e) => {
    e.stopPropagation();
    setConnecting({ source: nodeId });
  };

  // Handle dropping a node onto the canvas
  const onCanvasDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/nodetype');
    
    if (type) {
      const position = {
        x: e.clientX - canvasOffset.x,
        y: e.clientY - canvasOffset.y
      };
      
      addNode(type, position);
    }
  };

  // Handle drag over for the canvas
  const onCanvasDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div 
      ref={canvasRef}
      className="flex-1 bg-white relative overflow-auto border-l"
      onDrop={onCanvasDrop}
      onDragOver={onCanvasDragOver}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={() => setSelectedNode(null)}
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-gray-50" style={{
        backgroundSize: '20px 20px',
        backgroundImage: 'linear-gradient(to right, #eee 1px, transparent 1px), linear-gradient(to bottom, #eee 1px, transparent 1px)'
      }}></div>
      
      {/* Render SVG for edges */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none">
        {edges.map(edge => renderEdge(edge, nodes))}
        {renderConnectionLine(connecting, nodes, mousePos)}
      </svg>
      
      {/* Render nodes */}
      {nodes.map(node => (
        <Node 
          key={node.id}
          node={node}
          isSelected={selectedNode === node.id}
          selectNode={selectNode}
          startConnection={startConnection}
          updateNodeData={updateNodeData}
          deleteNode={deleteNode}
          canvasOffset={canvasOffset}
        />
      ))}
      
      {/* Help Panel */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded shadow z-10">
        <div className="text-sm">
          <p className="font-bold mb-1">How to use:</p>
          <p>1. Drag nodes from the sidebar to the canvas</p>
          <p>2. Click and drag the circle handle to connect nodes</p>
          <p>3. Click nodes to edit their properties</p>
          <p>4. Save your flow when complete</p>
        </div>
      </div>
    </div>
  );
};

export default NodeCanvas;