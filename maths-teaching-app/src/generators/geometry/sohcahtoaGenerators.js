// src/generators/geometry/sohcahtoaGenerators.js
import _ from 'lodash';
import { createRightTriangle } from '../../factories/triangleFactory';
// or if you prefer default import:
// import triangleFactory from '../../factories/triangleFactory';

/**
 * Generate an example using tangent only
 */
const generateTangentExample = (options = {}) => {
  const {
    sectionType = 'examples',
    seed = Date.now()
  } = options;

  // Choose a clean angle that will give reasonable numbers
  const angles = [30, 45, 60, 35, 40, 50, 55];
  const angleIndex = seed ? Math.floor((seed % 100) / 15) % angles.length : _.random(0, angles.length - 1);
  const angle = angles[angleIndex];
  
  // Choose whether to find a side or an angle
  const findSide = seed ? (seed % 5 > 2) : (Math.random() > 0.4); // 60% chance to find a side
  
  if (findSide) {
    // Finding a side using tangent
    const givenSide = seed ? 3 + (seed % 6) : _.random(3, 8);
    const otherSide = Math.round(givenSide * Math.tan(angle * Math.PI / 180) * 10) / 10;
    
    const isOpposite = seed ? (seed % 2 === 0) : (Math.random() > 0.5);
    const knownSide = isOpposite ? 'opposite' : 'adjacent';
    const unknownSide = isOpposite ? 'adjacent' : 'opposite';
    
    // Prepare values for visualization
    const base = isOpposite ? otherSide : givenSide;
    const height = isOpposite ? givenSide : otherSide;
    
    // Create the triangle visualization config
    const visualization = createRightTriangle({
      base,
      height,
      showRightAngle: true,
      showAngles: [true, false],
      angleLabels: [`${angle}°`, ''],
      labelStyle: "numeric",
      orientation: 'default',
      units: 'cm',
      sectionType
    });
    
    // Create solution steps
    const solution = [
      {
        explanation: `Identify what we know: angle = ${angle}°, ${knownSide} = ${givenSide} cm`,
        formula: `\\theta = ${angle}^{\\circ}, \\text{ ${knownSide} } = ${givenSide}\\text{ cm}`
      },
      {
        explanation: `Since we know the angle and the ${knownSide} side, we can use tangent to find the ${unknownSide} side`,
        formula: `\\tan(\\theta) = \\frac{\\text{opposite}}{\\text{adjacent}}`
      },
      {
        explanation: isOpposite ? 
          `Rearrange to solve for the adjacent side` : 
          `Rearrange to solve for the opposite side`,
        formula: isOpposite ? 
          `\\text{adjacent} = \\frac{\\text{opposite}}{\\tan(\\theta)}` : 
          `\\text{opposite} = \\text{adjacent} \\times \\tan(\\theta)`
      },
      {
        explanation: "Substitute the values",
        formula: isOpposite ? 
          `\\text{adjacent} = \\frac{${givenSide}}{\\tan(${angle}^{\\circ})}` : 
          `\\text{opposite} = ${givenSide} \\times \\tan(${angle}^{\\circ})`
      },
      {
        explanation: "Calculate (use a calculator)",
        formula: `${unknownSide} = ${otherSide}\\text{ cm}`,
        toggleAngle: true
      }
    ];
    
    return {
      title: `Finding the ${unknownSide} side using tangent`,
      questionText: `Find the length of the ${unknownSide} side when the angle is ${angle}° and the ${knownSide} side is ${givenSide} cm.`,
      visualization,
      solution,
      // Additional properties for internal use
      angle,
      knownSide: {
        name: knownSide,
        value: givenSide
      },
      unknownSide: {
        name: unknownSide,
        value: otherSide
      },
      visualValues: {
        base,
        height
      }
    };
  } else {
    // Finding an angle using inverse tangent (arctan)
    const opposite = seed ? 2 + (seed % 7) : _.random(2, 8);
    const adjacent = seed ? 2 + ((seed + 3) % 7) : _.random(2, 8);
    const calculatedAngle = Math.round(Math.atan(opposite / adjacent) * 180 / Math.PI);
    
    // Create the triangle visualization config
    const visualization = createRightTriangle({
      base: adjacent,
      height: opposite,
      showRightAngle: true,
      showAngles: [false, false], // Initially hide the angle
      labelStyle: "numeric",
      orientation: 'default',
      units: 'cm',
      sectionType
    });
    
    // Create solution steps
    const solution = [
      {
        explanation: `Identify what we know: opposite = ${opposite} cm, adjacent = ${adjacent} cm`,
        formula: `\\text{opposite} = ${opposite}\\text{ cm}, \\text{ adjacent } = ${adjacent}\\text{ cm}`
      },
      {
        explanation: `To find the angle, we need to use the inverse tangent function (arctan or tan⁻¹)`,
        formula: `\\tan(\\theta) = \\frac{\\text{opposite}}{\\text{adjacent}}`
      },
      {
        explanation: `Rearrange to solve for the angle`,
        formula: `\\theta = \\tan^{-1}\\left(\\frac{\\text{opposite}}{\\text{adjacent}}\\right)`
      },
      {
        explanation: "Substitute the values",
        formula: `\\theta = \\tan^{-1}\\left(\\frac{${opposite}}{${adjacent}}\\right)`
      },
      {
        explanation: "Calculate (use a calculator)",
        formula: `\\theta = ${calculatedAngle}^{\\circ}`,
        toggleAngle: true
      }
    ];
    
    return {
      title: "Finding an angle using inverse tangent",
      questionText: `Find the angle θ when the opposite side is ${opposite} cm and the adjacent side is ${adjacent} cm.`,
      visualization,
      solution,
      // Additional properties for internal use
      angle: calculatedAngle,
      knownSide: {
        name: "both sides",
        value: null
      },
      unknownSide: {
        name: "angle",
        value: calculatedAngle
      },
      visualValues: {
        base: adjacent,
        height: opposite
      }
    };
  }
};

/**
 * Generate an example using a mix of sine, cosine, and tangent
 */
const generateMixedTrigExample = (options = {}) => {
  const {
    sectionType = 'examples',
    seed = Date.now()
  } = options;

  // Choose which trig ratio to use
  const trigRatios = ['sine', 'cosine', 'tangent'];
  const trigRatio = seed ? trigRatios[seed % 3] : _.sample(trigRatios);
  
  const angles = [30, 45, 60, 35, 40, 50, 55];
  const angle = seed ? angles[seed % angles.length] : _.sample(angles);
  
  // Determine sides based on trig ratio
  let givenSide, unknownSide, unknownValue;
  let base, height;
  
  if (trigRatio === 'sine') {
    // sin(θ) = opposite / hypotenuse
    const hypotenuse = seed ? 5 + (seed % 6) : _.random(5, 10);
    const opposite = Math.round(hypotenuse * Math.sin(angle * Math.PI / 180) * 10) / 10;
    
    givenSide = 'hypotenuse';
    unknownSide = 'opposite';
    unknownValue = opposite;
    
    // For visualization
    const adjacent = Math.round(Math.sqrt(hypotenuse*hypotenuse - opposite*opposite) * 10) / 10;
    base = adjacent;
    height = opposite;
  } 
  else if (trigRatio === 'cosine') {
    // cos(θ) = adjacent / hypotenuse
    const hypotenuse = seed ? 5 + (seed % 6) : _.random(5, 10);
    const adjacent = Math.round(hypotenuse * Math.cos(angle * Math.PI / 180) * 10) / 10;
    
    givenSide = 'hypotenuse';
    unknownSide = 'adjacent';
    unknownValue = adjacent;
    
    // For visualization
    const opposite = Math.round(Math.sqrt(hypotenuse*hypotenuse - adjacent*adjacent) * 10) / 10;
    base = adjacent;
    height = opposite;
  }
  else { // tangent
    // tan(θ) = opposite / adjacent
    const adjacent = seed ? 3 + (seed % 6) : _.random(3, 8);
    const opposite = Math.round(adjacent * Math.tan(angle * Math.PI / 180) * 10) / 10;
    
    givenSide = 'adjacent';
    unknownSide = 'opposite';
    unknownValue = opposite;
    
    // For visualization
    base = adjacent;
    height = opposite;
  }
  
  // Calculate hypotenuse for visualization
  const hypotenuse = Math.sqrt(base*base + height*height).toFixed(1);
  
  // Determine orientation
  const orientations = ['default', 'rotate90'];
  const orientation = seed ? orientations[seed % 2] : _.sample(orientations);
  
  // Create triangle visualization config
  const visualization = createRightTriangle({
    base,
    height,
    showRightAngle: true,
    showAngles: [true, false],
    angleLabels: [`${angle}°`, ''],
    labelStyle: "numeric",
    orientation,
    units: 'cm',
    sectionType
  });
  
  // Create solution steps
  const solution = [
    {
      explanation: `Identify what we know: angle = ${angle}°, ${givenSide} = ${trigRatio === 'tangent' ? base : hypotenuse} cm`,
      formula: `\\theta = ${angle}^{\\circ}, \\text{ ${givenSide} } = ${trigRatio === 'tangent' ? base : hypotenuse}\\text{ cm}`
    },
    {
      explanation: `For this problem, we'll use the ${trigRatio} ratio`,
      formula: trigRatio === 'sine' ? 
               `\\sin(\\theta) = \\frac{\\text{opposite}}{\\text{hypotenuse}}` :
               trigRatio === 'cosine' ?
               `\\cos(\\theta) = \\frac{\\text{adjacent}}{\\text{hypotenuse}}` :
               `\\tan(\\theta) = \\frac{\\text{opposite}}{\\text{adjacent}}`
    },
    {
      explanation: `Rearrange to solve for the ${unknownSide} side`,
      formula: trigRatio === 'sine' ? 
               `\\text{opposite} = \\text{hypotenuse} \\times \\sin(\\theta)` :
               trigRatio === 'cosine' ?
               `\\text{adjacent} = \\text{hypotenuse} \\times \\cos(\\theta)` :
               `\\text{opposite} = \\text{adjacent} \\times \\tan(\\theta)`
    },
    {
      explanation: "Substitute the values",
      formula: trigRatio === 'sine' ? 
               `\\text{opposite} = ${hypotenuse} \\times \\sin(${angle}^{\\circ})` :
               trigRatio === 'cosine' ?
               `\\text{adjacent} = ${hypotenuse} \\times \\cos(${angle}^{\\circ})` :
               `\\text{opposite} = ${base} \\times \\tan(${angle}^{\\circ})`
    },
    {
      explanation: "Calculate (use a calculator)",
      formula: `${unknownSide} = ${unknownValue}\\text{ cm}`,
      toggleAngle: true
    }
  ];
  
  return {
    title: `Using ${trigRatio} to find a missing side`,
    questionText: `Find the ${unknownSide} side when the angle is ${angle}° and the ${givenSide} is ${trigRatio === 'tangent' ? base : hypotenuse} cm.`,
    visualization,
    solution,
    // Additional properties for internal use
    angle,
    trigRatio,
    knownSide: {
      name: givenSide,
      value: trigRatio === 'tangent' ? base : hypotenuse
    },
    unknownSide: {
      name: unknownSide,
      value: unknownValue
    },
    visualValues: {
      base,
      height
    }
  };
};

/**
 * Generate an example for special triangles (45-45-90 or 30-60-90)
 */
const generateSpecialTriangleExample = (options = {}) => {
  const {
    sectionType = 'examples',
    seed = Date.now()
  } = options;

  // Choose which special triangle to use
  const triangleTypes = ['45-45-90', '30-60-90'];
  const triangleType = seed ? triangleTypes[seed % 2] : _.sample(triangleTypes);
  
  if (triangleType === '45-45-90') {
    // 45-45-90 triangle (isosceles right triangle)
    const leg = seed ? 2 + (seed % 7) : _.random(2, 8);
    const hypotenuse = Math.round(leg * Math.sqrt(2) * 100) / 100;
    
    // Create triangle visualization config
    const visualization = createRightTriangle({
      base: leg,
      height: leg,
      showRightAngle: true,
      showAngles: [true, true],
      angleLabels: ['45°', '45°'],
      labelStyle: "numeric",
      orientation: 'default',
      units: 'cm',
      sectionType
    });
    
    // Create solution steps
    const solution = [
      {
        explanation: "In a 45-45-90 triangle, both legs are equal and the angles are 45°, 45°, and 90°",
        formula: `\\text{leg } = \\text{leg } = ${leg}\\text{ cm}`
      },
      {
        explanation: "For a 45-45-90 triangle, the hypotenuse = leg × √2",
        formula: `\\text{hypotenuse } = \\text{leg } \\times \\sqrt{2}`
      },
      {
        explanation: "Substitute the leg length",
        formula: `\\text{hypotenuse } = ${leg} \\times \\sqrt{2}`
      },
      {
        explanation: "Calculate the exact value",
        formula: `\\text{hypotenuse } = ${leg} \\times \\sqrt{2} = ${leg}\\sqrt{2}\\text{ cm}`
      },
      {
        explanation: "As a decimal",
        formula: `\\text{hypotenuse } \\approx ${hypotenuse}\\text{ cm}`,
        toggleAngle: true
      }
    ];
    
    return {
      title: "45-45-90 Special Triangle",
      questionText: `In a 45-45-90 triangle with legs of length ${leg} cm, find the hypotenuse.`,
      visualization,
      solution,
      // Additional properties for internal use
      specialTriangle: '45-45-90',
      knownSide: {
        name: 'leg',
        value: leg
      },
      unknownSide: {
        name: 'hypotenuse',
        value: hypotenuse
      },
      visualValues: {
        base: leg,
        height: leg
      }
    };
  } else {
    // 30-60-90 triangle
    const shortLeg = seed ? 2 + (seed % 5) : _.random(2, 6);
    const longLeg = Math.round(shortLeg * Math.sqrt(3) * 100) / 100;
    const hypotenuse = shortLeg * 2;
    
    // Create triangle visualization config
    const visualization = createRightTriangle({
      base: shortLeg,
      height: longLeg,
      showRightAngle: true,
      showAngles: [true, true],
      angleLabels: ['30°', '60°'],
      labelStyle: "numeric",
      orientation: 'default',
      units: 'cm',
      sectionType
    });
    
    // Create solution steps
    const solution = [
      {
        explanation: "In a 30-60-90 triangle, if the shorter leg (opposite to 30°) is s:",
        formula: `\\text{Shorter leg } = s = ${shortLeg}\\text{ cm}`
      },
      {
        explanation: "The longer leg (opposite to 60°) = s × √3",
        formula: `\\text{Longer leg } = s \\times \\sqrt{3} = ${shortLeg} \\times \\sqrt{3}`
      },
      {
        explanation: "Calculate the exact value of the longer leg",
        formula: `\\text{Longer leg } = ${shortLeg}\\sqrt{3}\\text{ cm} \\approx ${longLeg}\\text{ cm}`
      },
      {
        explanation: "The hypotenuse = 2 × s",
        formula: `\\text{Hypotenuse } = 2 \\times s = 2 \\times ${shortLeg} = ${hypotenuse}\\text{ cm}`
      },
      {
        explanation: "The three sides of the 30-60-90 triangle are in the ratio s : s√3 : 2s",
        formula: `\\text{Sides ratio: } ${shortLeg} : ${shortLeg}\\sqrt{3} : ${hypotenuse}`,
        toggleAngle: true
      }
    ];
    
    return {
      title: "30-60-90 Special Triangle",
      questionText: `In a 30-60-90 triangle with the shorter leg of length ${shortLeg} cm, find the longer leg and the hypotenuse.`,
      visualization,
      solution,
      // Additional properties for internal use
      specialTriangle: '30-60-90',
      knownSide: {
        name: 'shorter leg',
        value: shortLeg
      },
      unknownSide: {
        name: 'longer leg and hypotenuse',
        value: {
          longLeg: longLeg,
          hypotenuse: hypotenuse
        }
      },
      visualValues: {
        base: shortLeg,
        height: longLeg
      }
    };
  }
};

// Main object export with all generators
const SohcahtoaGenerators = {
  generateTangentExample,
  generateMixedTrigExample,
  generateSpecialTriangleExample,
  
  // Helper to generate all examples
  generateExampleQuestions: () => {
    const seed = Date.now();
    
    return [
      generateTangentExample({ seed }),
      generateMixedTrigExample({ seed: seed + 1000 }),
      generateSpecialTriangleExample({ seed: seed + 2000 })
    ];
  }
};

export default SohcahtoaGenerators;