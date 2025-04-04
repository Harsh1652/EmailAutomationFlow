import React from 'react';

const Navbar = ({ currentFlowName, setCurrentFlowName, saveFlow, clearCanvas }) => {
  return (
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
  );
};

export default Navbar;