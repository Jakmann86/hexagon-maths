// src/components/math/TestMafs.jsx
import React from 'react';
import { Mafs, Coordinates, Circle, useMovablePoint } from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';

const TestMafs = () => {
  const point = useMovablePoint([0, 0]);
  
  return (
    <div style={{ height: 400, width: '100%' }}>
      <Mafs>
        <Coordinates />
        <Circle center={point.point} radius={2} />
      </Mafs>
    </div>
  );
};

export default TestMafs;