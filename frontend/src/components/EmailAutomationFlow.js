import React, { useState, useRef, useEffect } from 'react';
import NodeCanvas from './NodeCanvas';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { calculateScheduledEmails } from '../utils/flowCalculations';

const EmailAutomationFlow = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const [savedFlows, setSavedFlows] = useState([]);
  const [currentFlowName, setCurrentFlowName] = useState('Untitled Flow');
  const [nodeDragging, setNodeDragging] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  
  // Add node function - pass to components that need it
  const addNode = (type, position) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: getDefaultDataForType(type)
    };
    
    setNodes([...nodes, newNode]);
    return newNode;
  };

  // Get default data for each node type
  const getDefaultDataForType = (type) => {
    switch (type) {
      case 'coldEmail':
        return { subject: '', content: '' };
      case 'wait':
        return { delay: '1', timeUnit: 'days' };
      case 'leadSource':
        return { source: '' };
      default:
        return {};
    }
  };

  // Update node data
  const updateNodeData = (nodeId, newData) => {
    setNodes(nodes.map(node => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, ...newData } }
        : node
    ));
  };

  // Delete a node and its connections
  const deleteNode = (nodeId) => {
    setNodes(nodes.filter(node => node.id !== nodeId));
    setEdges(edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
  };

  // Save the current flow
  const saveFlow = () => {
    if (!currentFlowName.trim()) {
      alert('Please enter a name for your flow');
      return;
    }

    const flow = {
      name: currentFlowName,
      nodes,
      edges,
      savedAt: new Date().toISOString(),
    };

    // Calculate scheduled times based on Wait nodes
    const scheduledEmails = calculateScheduledEmails(flow);
    
    setSavedFlows([...savedFlows, { ...flow, scheduledEmails }]);
    alert(`Flow "${currentFlowName}" saved successfully! ${scheduledEmails.length} emails scheduled.`);
  };

  // Clear the canvas - reset nodes and edges
  const clearCanvas = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to clear the canvas? All unsaved work will be lost."
    );
    if (userConfirmed) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <Navbar 
        currentFlowName={currentFlowName}
        setCurrentFlowName={setCurrentFlowName}
        saveFlow={saveFlow}
        clearCanvas={clearCanvas}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          nodeDragging={nodeDragging}
          setNodeDragging={setNodeDragging}
          savedFlows={savedFlows}
        />
        
        <NodeCanvas 
          nodes={nodes}
          setNodes={setNodes}
          edges={edges}
          setEdges={setEdges}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          dragging={dragging}
          setDragging={setDragging}
          connecting={connecting}
          setConnecting={setConnecting}
          mousePos={mousePos}
          setMousePos={setMousePos}
          canvasOffset={canvasOffset}
          setCanvasOffset={setCanvasOffset}
          nodeDragging={nodeDragging}
          updateNodeData={updateNodeData}
          deleteNode={deleteNode}
          addNode={addNode}
        />
      </div>
    </div>
  );
};

export default EmailAutomationFlow;