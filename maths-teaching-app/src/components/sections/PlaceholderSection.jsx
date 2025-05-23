import React from 'react';

const PlaceholderSection = ({ sectionName, message = "This section is under development." }) => (
  <div className="p-6 bg-white border rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold mb-4">{sectionName}</h2>
    <p>{message}</p>
  </div>
);

export default PlaceholderSection;