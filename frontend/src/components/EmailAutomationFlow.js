import React, { useState, useRef, useEffect } from 'react';
import { XCircle, ArrowRight } from 'lucide-react';

// Custom implementation of a flow chart without ReactFlow
const EmailAutomationFlow = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const [savedFlows, setSavedFlows] = useState([]);
  const [currentFlowName, setCurrentFlowName] = useState('Untitled Flow');
  const [nodeDragging, setNodeDragging] = useState(null);
  const canvasRef = useRef(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
  }, []);

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

  // Add a new node to the canvas
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

  // Handle starting node drag from sidebar
  const onSidebarDragStart = (e, type) => {
    e.dataTransfer.setData('application/nodetype', type);
    setNodeDragging(type);
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
    
    setNodeDragging(null);
  };

  // Handle drag over for the canvas
  const onCanvasDragOver = (e) => {
    e.preventDefault();
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

  // Render node based on type
  const renderNode = (node) => {
    const nodeStyle = {
      position: 'absolute',
      left: `${node.position.x}px`,
      top: `${node.position.y}px`,
      width: '200px',
      cursor: 'move'
    };
    
    const isSelected = selectedNode === node.id;
    
    // Different node types
    switch (node.type) {
      case 'coldEmail':
        return (
          <div 
            key={node.id}
            className={`bg-blue-100 p-4 rounded-md border shadow-md ${isSelected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-blue-300'}`}
            style={nodeStyle}
            onMouseDown={(e) => selectNode(node, e)}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold text-blue-800">Cold Email</div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 bg-blue-500 rounded-full cursor-pointer" 
                  onMouseDown={(e) => startConnection(node.id, e)}
                />
                <XCircle
                  className="h-5 w-5 text-red-500 cursor-pointer" 
                  onClick={() => deleteNode(node.id)}
                />
              </div>
            </div>
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
        
      case 'wait':
        return (
          <div 
            key={node.id}
            className={`bg-yellow-100 p-4 rounded-md border shadow-md ${isSelected ? 'border-yellow-500 ring-2 ring-yellow-300' : 'border-yellow-300'}`}
            style={nodeStyle}
            onMouseDown={(e) => selectNode(node, e)}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold text-yellow-800">Wait/Delay</div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 bg-yellow-500 rounded-full cursor-pointer" 
                  onMouseDown={(e) => startConnection(node.id, e)}
                />
                <XCircle
                  className="h-5 w-5 text-red-500 cursor-pointer" 
                  onClick={() => deleteNode(node.id)}
                />
              </div>
            </div>
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
        
      case 'leadSource':
        return (
          <div 
            key={node.id}
            className={`bg-green-100 p-4 rounded-md border shadow-md ${isSelected ? 'border-green-500 ring-2 ring-green-300' : 'border-green-300'}`}
            style={nodeStyle}
            onMouseDown={(e) => selectNode(node, e)}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold text-green-800">Lead Source</div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 bg-green-500 rounded-full cursor-pointer" 
                  onMouseDown={(e) => startConnection(node.id, e)}
                />
                <XCircle
                  className="h-5 w-5 text-red-500 cursor-pointer" 
                  onClick={() => deleteNode(node.id)}
                />
              </div>
            </div>
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
        
      default:
        return null;
    }
  };

  // Render edge/connection between nodes
  const renderEdge = (edge) => {
    const sourceNode = nodes.find(node => node.id === edge.source);
    const targetNode = nodes.find(node => node.id === edge.target);
    
    if (!sourceNode || !targetNode) return null;
    
    // Calculate edge points
    const start = {
      x: sourceNode.position.x + 180, // Right side of source node
      y: sourceNode.position.y + 40  // Middle of source node
    };
    
    const end = {
      x: targetNode.position.x,       // Left side of target node
      y: targetNode.position.y + 40   // Middle of target node
    };
    
    // Create an S-curve path for the edge
    const path = `M ${start.x} ${start.y} C ${start.x + 50} ${start.y}, ${end.x - 50} ${end.y}, ${end.x} ${end.y}`;
    
    return (
      <g key={edge.id}>
        <path
          d={path}
          stroke="#888"
          strokeWidth="2"
          fill="none"
          strokeDasharray="none"
        />
        <circle cx={end.x} cy={end.y} r="3" fill="#888" />
        <path 
          d={`M ${end.x - 10} ${end.y - 5} L ${end.x} ${end.y} L ${end.x - 10} ${end.y + 5}`} 
          fill="#888" 
        />
      </g>
    );
  };

  // Render the in-progress connection line
  const renderConnectionLine = () => {
    if (!connecting) return null;
    
    const sourceNode = nodes.find(node => node.id === connecting.source);
    
    if (!sourceNode) return null;
    
    const start = {
      x: sourceNode.position.x + 180,
      y: sourceNode.position.y + 40
    };
    
    // Create a direct line from source to current mouse position
    return (
      <g>
        <path
          d={`M ${start.x} ${start.y} L ${mousePos.x} ${mousePos.y}`}
          stroke="#888"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
        />
        <circle cx={mousePos.x} cy={mousePos.y} r="3" fill="#888" />
      </g>
    );
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

  // Calculate when emails will be sent based on Wait nodes
  const calculateScheduledEmails = (flow) => {
    const scheduledEmails = [];
    const now = new Date();
    
    // Find all email nodes
    const emailNodes = flow.nodes.filter(node => node.type === 'coldEmail');
    
    emailNodes.forEach(emailNode => {
      let totalDelay = 0;
      
      // Find connected wait nodes that come before this email
      const incomingEdges = flow.edges.filter(edge => edge.target === emailNode.id);
      incomingEdges.forEach(edge => {
        const sourceNode = flow.nodes.find(n => n.id === edge.source);
        if (sourceNode && sourceNode.type === 'wait') {
          const delay = parseInt(sourceNode.data.delay || 0);
          const timeUnit = sourceNode.data.timeUnit || 'days';
          
          // Convert to milliseconds
          let delayMs = delay;
          if (timeUnit === 'minutes') delayMs *= 60 * 1000;
          else if (timeUnit === 'hours') delayMs *= 60 * 60 * 1000;
          else if (timeUnit === 'days') delayMs *= 24 * 60 * 60 * 1000;
          
          totalDelay += delayMs;
        }
      });
      
      // Calculate scheduled time
      const scheduledTime = new Date(now.getTime() + totalDelay);
      
      scheduledEmails.push({
        id: emailNode.id,
        subject: emailNode.data.subject || '(No subject)',
        content: emailNode.data.content || '(No content)',
        scheduledTime: scheduledTime.toISOString(),
        formattedTime: scheduledTime.toLocaleString()
      });
    });
    
    return scheduledEmails;
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
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={currentFlowName}
            onChange={(e) => setCurrentFlowName(e.target.value)}
            className="px-2 py-1 text-black rounded"
            placeholder="Flow name"
          />
          <button 
            onClick={saveFlow}
            className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded"
          >
            Save Flow
          </button>
          <button 
            onClick={clearCanvas}
            className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded ml-2"
          >
            Clear Canvas
          </button>
        </div>
        <div className="text-xl font-bold">Email Automation Builder</div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 p-4 flex flex-col gap-4">
          <h2 className="font-bold text-lg">Node Types</h2>
          
          <div 
            className={`bg-blue-100 p-3 rounded border-2 border-blue-300 cursor-grab ${nodeDragging === 'coldEmail' ? 'opacity-50' : ''}`}
            draggable
            onDragStart={(e) => onSidebarDragStart(e, 'coldEmail')}
            onDragEnd={() => setNodeDragging(null)}
          >
            Cold Email
          </div>
          
          <div 
            className={`bg-yellow-100 p-3 rounded border-2 border-yellow-300 cursor-grab ${nodeDragging === 'wait' ? 'opacity-50' : ''}`}
            draggable
            onDragStart={(e) => onSidebarDragStart(e, 'wait')}
            onDragEnd={() => setNodeDragging(null)}
          >
            Wait/Delay
          </div>
          
          <div 
            className={`bg-green-100 p-3 rounded border-2 border-green-300 cursor-grab ${nodeDragging === 'leadSource' ? 'opacity-50' : ''}`}
            draggable
            onDragStart={(e) => onSidebarDragStart(e, 'leadSource')}
            onDragEnd={() => setNodeDragging(null)}
          >
            Lead Source
          </div>

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
        
        {/* Canvas */}
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
            {edges.map(renderEdge)}
            {renderConnectionLine()}
          </svg>
          
          {/* Render nodes */}
          {nodes.map(renderNode)}
          
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
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="h-screen">
      <EmailAutomationFlow />
    </div>
  );
}