// Render edge/connection between nodes
export const renderEdge = (edge, nodes) => {
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
  export const renderConnectionLine = (connecting, nodes, mousePos) => {
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