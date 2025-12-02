// src/factories/shapes/cuboidFactory.js
// Factory for creating Cuboid3D configuration objects
// Following Pattern 2: Factory creates config, Section renders component

/**
 * Create a cuboid configuration for 3D Pythagoras problems
 * Shows internal triangles for finding diagonals
 */
export function createPythagorasCuboid({
  width = 4,
  depth = 3,
  height = 5,
  units = 'cm',
  showBaseDiagonal = false,
  showSpaceDiagonal = false,
  showVertices = false
} = {}) {
  return {
    width,
    depth,
    height,
    units,
    showTriangles: {
      baseDiagonal: showBaseDiagonal,
      spaceDiagonal: showSpaceDiagonal
    },
    showLabels: {
      dimensions: true,
      baseDiagonal: showBaseDiagonal,
      spaceDiagonal: showSpaceDiagonal,
      vertices: showVertices,
      faces: false
    },
    showFaces: {
      top: true,
      bottom: true,
      front: true,
      back: true,
      left: true,
      right: true
    },
    highlightFaces: {},
    highlightEdges: {},
    vertexLabels: {
      show: showVertices,
      labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    }
  };
}

/**
 * Create a cuboid configuration for surface area problems
 * Highlights specific faces and shows their areas
 */
export function createSurfaceAreaCuboid({
  width = 4,
  depth = 3,
  height = 5,
  units = 'cm',
  highlightFace = null, // 'top', 'front', 'right', 'left', 'back', 'bottom'
  showAllFaceAreas = false,
  showVertices = false
} = {}) {
  const highlightFaces = {
    top: highlightFace === 'top' || highlightFace === 'all',
    bottom: highlightFace === 'bottom' || highlightFace === 'all',
    front: highlightFace === 'front' || highlightFace === 'all',
    back: highlightFace === 'back' || highlightFace === 'all',
    left: highlightFace === 'left' || highlightFace === 'all',
    right: highlightFace === 'right' || highlightFace === 'all'
  };

  return {
    width,
    depth,
    height,
    units,
    showTriangles: {
      baseDiagonal: false,
      spaceDiagonal: false
    },
    showLabels: {
      dimensions: true,
      baseDiagonal: false,
      spaceDiagonal: false,
      vertices: showVertices,
      faces: showAllFaceAreas || highlightFace !== null
    },
    showFaces: {
      top: true,
      bottom: true,
      front: true,
      back: true,
      left: true,
      right: true
    },
    highlightFaces,
    highlightEdges: {},
    vertexLabels: {
      show: showVertices,
      labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    }
  };
}

/**
 * Create a cuboid configuration for volume problems
 * Shows dimensions clearly, optionally with formula overlay
 */
export function createVolumeCuboid({
  width = 4,
  depth = 3,
  height = 5,
  units = 'cm',
  highlightDimensions = false,
  showVertices = false
} = {}) {
  return {
    width,
    depth,
    height,
    units,
    showTriangles: {
      baseDiagonal: false,
      spaceDiagonal: false
    },
    showLabels: {
      dimensions: true,
      baseDiagonal: false,
      spaceDiagonal: false,
      vertices: showVertices,
      faces: false
    },
    showFaces: {
      top: true,
      bottom: true,
      front: true,
      back: true,
      left: true,
      right: true
    },
    highlightFaces: {},
    highlightEdges: {
      width: highlightDimensions,
      depth: highlightDimensions,
      height: highlightDimensions
    },
    vertexLabels: {
      show: showVertices,
      labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    }
  };
}

/**
 * Create a cuboid configuration for starter/diagnostic questions
 * Identify vertices, edges, faces
 */
export function createLabelingCuboid({
  width = 4,
  depth = 3,
  height = 5,
  units = 'cm',
  vertexLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  showDimensions = true,
  highlightEdge = null, // e.g., 'AB', 'CG', 'EH'
  highlightFace = null
} = {}) {
  // Parse edge highlight (e.g., 'AB' -> highlight width)
  const highlightEdges = {};
  if (highlightEdge) {
    // Map common edges to highlight types
    const edgeMap = {
      'AB': 'width', 'DC': 'width', 'EF': 'width', 'HG': 'width',
      'AD': 'depth', 'BC': 'depth', 'EH': 'depth', 'FG': 'depth',
      'AE': 'height', 'BF': 'height', 'CG': 'height', 'DH': 'height'
    };
    if (edgeMap[highlightEdge]) {
      highlightEdges[edgeMap[highlightEdge]] = true;
    }
  }

  const highlightFaces = {
    top: highlightFace === 'top' || highlightFace === 'EFGH',
    bottom: highlightFace === 'bottom' || highlightFace === 'ABCD',
    front: highlightFace === 'front' || highlightFace === 'ABFE',
    back: highlightFace === 'back' || highlightFace === 'DCGH',
    left: highlightFace === 'left' || highlightFace === 'ADHE',
    right: highlightFace === 'right' || highlightFace === 'BCGF'
  };

  return {
    width,
    depth,
    height,
    units,
    showTriangles: {
      baseDiagonal: false,
      spaceDiagonal: false
    },
    showLabels: {
      dimensions: showDimensions,
      baseDiagonal: false,
      spaceDiagonal: false,
      vertices: true,
      faces: false
    },
    showFaces: {
      top: true,
      bottom: true,
      front: true,
      back: true,
      left: true,
      right: true
    },
    highlightFaces,
    highlightEdges,
    vertexLabels: {
      show: true,
      labels: vertexLabels
    }
  };
}

/**
 * Create a plain cuboid with minimal decoration
 * Good for simple illustrations
 */
export function createPlainCuboid({
  width = 4,
  depth = 3,
  height = 5,
  units = 'cm',
  showDimensions = true
} = {}) {
  return {
    width,
    depth,
    height,
    units,
    showTriangles: {
      baseDiagonal: false,
      spaceDiagonal: false
    },
    showLabels: {
      dimensions: showDimensions,
      baseDiagonal: false,
      spaceDiagonal: false,
      vertices: false,
      faces: false
    },
    showFaces: {
      top: true,
      bottom: true,
      front: true,
      back: true,
      left: true,
      right: true
    },
    highlightFaces: {},
    highlightEdges: {},
    vertexLabels: {
      show: false
    }
  };
}

// Calculation helpers (can be used by generators)
export const cuboidCalculations = {
  baseDiagonal: (w, d) => Math.sqrt(w * w + d * d),
  spaceDiagonal: (w, d, h) => Math.sqrt(w * w + d * d + h * h),
  surfaceArea: (w, d, h) => 2 * (w * d + w * h + d * h),
  volume: (w, d, h) => w * d * h,
  faceAreas: (w, d, h) => ({
    top: w * d,
    bottom: w * d,
    front: w * h,
    back: w * h,
    left: d * h,
    right: d * h
  })
};

export default {
  createPythagorasCuboid,
  createSurfaceAreaCuboid,
  createVolumeCuboid,
  createLabelingCuboid,
  createPlainCuboid,
  calculations: cuboidCalculations
};