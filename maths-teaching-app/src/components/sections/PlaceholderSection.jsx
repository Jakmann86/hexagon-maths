import React from 'react';

const PlaceholderSection = ({ 
  sectionName = "Interactive Learning",
  title = "Advanced Topics",
  message = "This section is under development." 
}) => {
  // Section colors from your app + additional sixth color
  const sectionColors = {
    starter: '#3b82f6',    // Blue
    diagnostic: '#9333ea', // Purple  
    learn: '#16a34a',      // Green
    examples: '#f97316',   // Orange
    challenge: '#ef4444',  // Red
    extra: '#eab308'       // Yellow - sixth color
  };

  // Create hexagon path
  const createHexagonPath = () => {
    const size = 60;
    const centerX = 150;
    const centerY = 150;
    const angle = Math.PI / 3; // 60 degrees
    
    let path = '';
    for (let i = 0; i < 6; i++) {
      const x = centerX + size * Math.cos(angle * i - Math.PI / 2);
      const y = centerY + size * Math.sin(angle * i - Math.PI / 2);
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }
    path += ' Z';
    return path;
  };

  // Create individual hexagon segments
  const createHexagonSegment = (index, color) => {
    const size = 60;
    const centerX = 150;
    const centerY = 150;
    const angle = Math.PI / 3;
    
    const x1 = centerX + size * Math.cos(angle * index - Math.PI / 2);
    const y1 = centerY + size * Math.sin(angle * index - Math.PI / 2);
    const x2 = centerX + size * Math.cos(angle * (index + 1) - Math.PI / 2);
    const y2 = centerY + size * Math.sin(angle * (index + 1) - Math.PI / 2);
    
    return (
      <path
        key={index}
        d={`M ${centerX} ${centerY} L ${x1} ${y1} L ${x2} ${y2} Z`}
        fill={color}
        opacity="0.9"
        className="transition-opacity duration-300 hover:opacity-100"
      />
    );
  };

  const colors = Object.values(sectionColors);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-8 max-w-2xl">
        
        {/* Coming Soon Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-md border border-gray-200">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          <span className="text-sm font-medium text-gray-600">
            {title} - {sectionName} Coming Soon
          </span>
        </div>

        {/* Hexagon Logo */}
        <div className="flex items-center justify-center space-x-4">
          <div className="relative">
            <svg 
              width="300" 
              height="300" 
              viewBox="0 0 300 300"
              className="drop-shadow-lg"
            >
              {/* Hexagon segments with different colors */}
              {colors.map((color, index) => createHexagonSegment(index, color))}
              
              {/* White center circle for text - made bigger */}
              <circle
                cx="150"
                cy="150"
                r="45"
                fill="white"
                className="drop-shadow-md"
              />
              
              {/* Hexagon outline - thicker */}
              <path
                d={createHexagonPath()}
                fill="none"
                stroke="#475569"
                strokeWidth="3"
                opacity="0.4"
              />
            </svg>
            
            {/* Logo Text Overlay - Professional font */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-extrabold text-gray-900 leading-tight tracking-tight" style={{ fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif' }}>
                  Hexagon
                </div>
                <div className="text-lg font-extrabold text-gray-900 leading-tight tracking-tight" style={{ fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif' }}>
                  Maths
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {title}
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-600 font-medium">
            {sectionName}
          </h2>
        </div>

        {/* Description */}
        <div className="space-y-4 text-gray-600">
          <p className="text-lg leading-relaxed">
            We're working hard to bring you an amazing interactive learning experience. 
            This section will include engaging lessons, practice problems, and visual demonstrations.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Interactive Lessons</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Visual Learning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Practice Problems</span>
            </div>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1s'
              }}
            ></div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Development Progress</span>
            <span className="text-sm text-gray-500">75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: '75%' }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Core framework complete • Adding interactive content
          </p>
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-500 border-t border-gray-200 pt-6">
          <p>
            Thank you for your patience as we build something amazing for mathematics education.
          </p>
        </div>

      </div>
    </div>
  );
};

export default PlaceholderSection;