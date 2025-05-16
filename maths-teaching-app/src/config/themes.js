// src/config/themes.js

export default {
  // Section-based themes
  sections: {
    starter: {
      primary: 'blue',
      color: '#0284c7',
      backgroundColor: '#e0f2fe',
      fillOpacity: 0.2,
      strokeWidth: 2
    },
    diagnostic: {
      primary: 'purple',
      color: '#9333ea',
      backgroundColor: '#f3e8ff',
      fillOpacity: 0.2,
      strokeWidth: 2
    },
    learn: {
      primary: 'green',
      color: '#16a34a',
      backgroundColor: '#dcfce7',
      fillOpacity: 0.2,
      strokeWidth: 2
    },
    examples: {
      primary: 'orange',
      color: '#f97316',
      backgroundColor: '#ffedd5',
      fillOpacity: 0.2,
      strokeWidth: 2
    },
    challenge: {
      primary: 'red',
      color: '#dc2626',
      backgroundColor: '#fee2e2',
      fillOpacity: 0.2,
      strokeWidth: 2
    }
  },
  
  // Use Tailwind-like sizing for consistency
  sizes: {
    xs: {
      containerHeight: 120,
      labelSize: 11
    },
    sm: {
      containerHeight: 180,
      labelSize: 12
    },
    md: {
      containerHeight: 250,
      labelSize: 13
    },
    lg: {
      containerHeight: 320,
      labelSize: 14
    },
    xl: {
      containerHeight: 400,
      labelSize: 15
    }
  }
};