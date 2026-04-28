import React from 'react';

// Simple test component to isolate issues
export default function DebugTest() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Test</h1>
      
      {/* Test Matrix Components */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Matrix Test</h2>
        <div className="bg-white p-4 rounded border">
          <p>If you can see this, basic rendering works.</p>
        </div>
      </div>
      
      {/* Test Taylor Components */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Taylor Test</h2>
        <div className="bg-white p-4 rounded border">
          <p>If you can see this, basic rendering works.</p>
        </div>
      </div>
      
      {/* Test MathJS */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">MathJS Test</h2>
        <div className="bg-white p-4 rounded border">
          <p>Testing mathjs import...</p>
        </div>
      </div>
    </div>
  );
}
