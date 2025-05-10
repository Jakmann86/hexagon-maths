// maths-teaching-app/src/content/topics/trigonometry-i/sohcahtoa1/ExamplesSection.jsx
import React, { useState, useEffect } from 'react';
import ExamplesSectionBase from '../../../../components/sections/ExamplesSectionBase';
import MathDisplay from '../../../../components/common/MathDisplay';
import RightTriangle from '../../../../components/math/shapes/RightTriangle';
import _ from 'lodash';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';

const ExamplesSection = ({ currentTopic, currentLessonId }) => {
  // Get theme colors for examples section
  const theme = useSectionTheme('examples');

  const [examples, setExamples] = useState([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [showAngle, setShowAngle] = useState(false);

  // Generate all examples when the component mounts
  useEffect(() => {
    generateExamples();
  }, []);

  // Regenerate all examples
  const generateExamples = () => {
    setExamples([
      generateTangentExample(),
      generateMixedTrigExample(),
      generateSpecialTriangleExample()
    ]);
    setShowAngle(false);
  };

  // Helper function for creating clean angle labels
  const formatAngle = (degrees) => `${degrees}°`;

  // 1. Generate an example using tangent only
  const generateTangentExample = () => {
    // Choose a clean angle that will give reasonable numbers
    const angles = [30, 45, 60, 35, 40, 50, 55];
    const angle = _.sample(angles);
    
    // Choose whether to find a side or an angle
    const findSide = Math.random() > 0.4; // 60% chance to find a side
    
    if (findSide) {
      // Finding a side using tangent
      const givenSide = _.random(3, 8);
      const otherSide = Math.round(givenSide * Math.tan(angle * Math.PI / 180) * 10) / 10;
      
      const isOpposite = Math.random() > 0.5;
      const knownSide = isOpposite ? 'opposite' : 'adjacent';
      const unknownSide = isOpposite ? 'adjacent' : 'opposite';
      
      // Prepare values for visualization
      const base = isOpposite ? otherSide : givenSide;
      const height = isOpposite ? givenSide : otherSide;
      
      return {
        title: `Finding the ${unknownSide} side using tangent`,
        question: `Find the length of the ${unknownSide} side when the angle is ${formatAngle(angle)} and the ${knownSide} side is ${givenSide} cm.`,
        angle,
        knownSide: {
          name: knownSide,
          value: givenSide
        },
        unknownSide: {
          name: unknownSide,
          value: otherSide
        },
        orientation: 'default',
        visualValues: {
          base,
          height
        },
        steps: [
          {
            explanation: `Identify what we know: angle = ${formatAngle(angle)}, ${knownSide} = ${givenSide} cm`,
            math: <MathDisplay math={`\\theta = ${angle}^{\\circ}, \\text{ ${knownSide} } = ${givenSide}\\text{ cm}`} />
          },
          {
            explanation: `Since we know the angle and the ${knownSide} side, we can use tangent to find the ${unknownSide} side`,
            math: <MathDisplay math={`\\tan(\\theta) = \\frac{\\text{opposite}}{\\text{adjacent}}`} />
          },
          {
            explanation: isOpposite ? 
              `Rearrange to solve for the adjacent side` : 
              `Rearrange to solve for the opposite side`,
            math: isOpposite ? 
              <MathDisplay math={`\\text{adjacent} = \\frac{\\text{opposite}}{\\tan(\\theta)}`} /> : 
              <MathDisplay math={`\\text{opposite} = \\text{adjacent} \\times \\tan(\\theta)`} />
          },
          {
            explanation: "Substitute the values",
            math: isOpposite ? 
              <MathDisplay math={`\\text{adjacent} = \\frac{${givenSide}}{\\tan(${angle}^{\\circ})}`} /> : 
              <MathDisplay math={`\\text{opposite} = ${givenSide} \\times \\tan(${angle}^{\\circ})`} />
          },
          {
            explanation: "Calculate (use a calculator)",
            math: <MathDisplay math={`${unknownSide} = ${otherSide}\\text{ cm}`} />,
            toggleAngle: true
          }
        ]
      };
    } else {
      // Finding an angle using inverse tangent (arctan)
      const opposite = _.random(2, 8);
      const adjacent = _.random(2, 8);
      const calculatedAngle = Math.round(Math.atan(opposite / adjacent) * 180 / Math.PI);
      
      return {
        title: "Finding an angle using inverse tangent",
        question: `Find the angle θ when the opposite side is ${opposite} cm and the adjacent side is ${adjacent} cm.`,
        angle: calculatedAngle,
        knownSide: {
          name: "both sides",
          value: null
        },
        unknownSide: {
          name: "angle",
          value: calculatedAngle
        },
        orientation: 'default',
        visualValues: {
          base: adjacent,
          height: opposite
        },
        steps: [
          {
            explanation: `Identify what we know: opposite = ${opposite} cm, adjacent = ${adjacent} cm`,
            math: <MathDisplay math={`\\text{opposite} = ${opposite}\\text{ cm}, \\text{ adjacent } = ${adjacent}\\text{ cm}`} />
          },
          {
            explanation: `To find the angle, we need to use the inverse tangent function (arctan or tan⁻¹)`,
            math: <MathDisplay math={`\\tan(\\theta) = \\frac{\\text{opposite}}{\\text{adjacent}}`} />
          },
          {
            explanation: `Rearrange to solve for the angle`,
            math: <MathDisplay math={`\\theta = \\tan^{-1}\\left(\\frac{\\text{opposite}}{\\text{adjacent}}\\right)`} />
          },
          {
            explanation: "Substitute the values",
            math: <MathDisplay math={`\\theta = \\tan^{-1}\\left(\\frac{${opposite}}{${adjacent}}\\right)`} />
          },
          {
            explanation: "Calculate (use a calculator)",
            math: <MathDisplay math={`\\theta = ${calculatedAngle}^{\\circ}`} />,
            toggleAngle: true
          }
        ]
      };
    }
  };

  // 2. Generate an example using a mix of sine, cosine, and tangent
  const generateMixedTrigExample = () => {
    // Choose which trig ratio to use
    const trigRatio = _.sample(['sine', 'cosine', 'tangent']);
    const angle = _.sample([30, 45, 60, 35, 40, 50, 55]);
    
    // Determine sides based on trig ratio
    let givenSide, unknownSide, unknownValue;
    let base, height;
    
    if (trigRatio === 'sine') {
      // sin(θ) = opposite / hypotenuse
      const hypotenuse = _.random(5, 10);
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
      const hypotenuse = _.random(5, 10);
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
      const adjacent = _.random(3, 8);
      const opposite = Math.round(adjacent * Math.tan(angle * Math.PI / 180) * 10) / 10;
      
      givenSide = 'adjacent';
      unknownSide = 'opposite';
      unknownValue = opposite;
      
      // For visualization
      base = adjacent;
      height = opposite;
    }
    
    return {
      title: `Using ${trigRatio} to find a missing side`,
      question: `Find the ${unknownSide} side when the angle is ${formatAngle(angle)} and the ${givenSide} is ${trigRatio === 'tangent' ? base : Math.sqrt(base*base + height*height).toFixed(1)} cm.`,
      angle,
      trigRatio,
      knownSide: {
        name: givenSide,
        value: trigRatio === 'tangent' ? base : Math.sqrt(base*base + height*height).toFixed(1)
      },
      unknownSide: {
        name: unknownSide,
        value: unknownValue
      },
      orientation: _.sample(['default', 'rotate90']),
      visualValues: {
        base,
        height
      },
      steps: [
        {
          explanation: `Identify what we know: angle = ${formatAngle(angle)}, ${givenSide} = ${trigRatio === 'tangent' ? base : Math.sqrt(base*base + height*height).toFixed(1)} cm`,
          math: <MathDisplay math={`\\theta = ${angle}^{\\circ}, \\text{ ${givenSide} } = ${trigRatio === 'tangent' ? base : Math.sqrt(base*base + height*height).toFixed(1)}\\text{ cm}`} />
        },
        {
          explanation: `For this problem, we'll use the ${trigRatio} ratio`,
          math: trigRatio === 'sine' ? 
                 <MathDisplay math={`\\sin(\\theta) = \\frac{\\text{opposite}}{\\text{hypotenuse}}`} /> :
                 trigRatio === 'cosine' ?
                 <MathDisplay math={`\\cos(\\theta) = \\frac{\\text{adjacent}}{\\text{hypotenuse}}`} /> :
                 <MathDisplay math={`\\tan(\\theta) = \\frac{\\text{opposite}}{\\text{adjacent}}`} />
        },
        {
          explanation: `Rearrange to solve for the ${unknownSide} side`,
          math: trigRatio === 'sine' ? 
                 <MathDisplay math={`\\text{opposite} = \\text{hypotenuse} \\times \\sin(\\theta)`} /> :
                 trigRatio === 'cosine' ?
                 <MathDisplay math={`\\text{adjacent} = \\text{hypotenuse} \\times \\cos(\\theta)`} /> :
                 <MathDisplay math={`\\text{opposite} = \\text{adjacent} \\times \\tan(\\theta)`} />
        },
        {
          explanation: "Substitute the values",
          math: trigRatio === 'sine' ? 
                 <MathDisplay math={`\\text{opposite} = ${Math.sqrt(base*base + height*height).toFixed(1)} \\times \\sin(${angle}^{\\circ})`} /> :
                 trigRatio === 'cosine' ?
                 <MathDisplay math={`\\text{adjacent} = ${Math.sqrt(base*base + height*height).toFixed(1)} \\times \\cos(${angle}^{\\circ})`} /> :
                 <MathDisplay math={`\\text{opposite} = ${base} \\times \\tan(${angle}^{\\circ})`} />
        },
        {
          explanation: "Calculate (use a calculator)",
          math: <MathDisplay math={`${unknownSide} = ${unknownValue}\\text{ cm}`} />,
          toggleAngle: true
        }
      ]
    };
  };

  // 3. Generate an example for special triangles (45-45-90 or 30-60-90)
  const generateSpecialTriangleExample = () => {
    // Choose which special triangle to use
    const triangleType = _.sample(['45-45-90', '30-60-90']);
    
    if (triangleType === '45-45-90') {
      // 45-45-90 triangle (isosceles right triangle)
      const leg = _.random(2, 8);
      const hypotenuse = Math.round(leg * Math.sqrt(2) * 100) / 100;
      
      return {
        title: "45-45-90 Special Triangle",
        question: `In a 45-45-90 triangle with legs of length ${leg} cm, find the hypotenuse.`,
        specialTriangle: '45-45-90',
        knownSide: {
          name: 'leg',
          value: leg
        },
        unknownSide: {
          name: 'hypotenuse',
          value: hypotenuse
        },
        orientation: 'default',
        visualValues: {
          base: leg,
          height: leg
        },
        steps: [
          {
            explanation: "In a 45-45-90 triangle, both legs are equal and the angles are 45°, 45°, and 90°",
            math: <MathDisplay math={`\\text{leg } = \\text{leg } = ${leg}\\text{ cm}`} />
          },
          {
            explanation: "For a 45-45-90 triangle, the hypotenuse = leg × √2",
            math: <MathDisplay math={`\\text{hypotenuse } = \\text{leg } \\times \\sqrt{2}`} />
          },
          {
            explanation: "Substitute the leg length",
            math: <MathDisplay math={`\\text{hypotenuse } = ${leg} \\times \\sqrt{2}`} />
          },
          {
            explanation: "Calculate the exact value",
            math: <MathDisplay math={`\\text{hypotenuse } = ${leg} \\times \\sqrt{2} = ${leg}\\sqrt{2}\\text{ cm}`} />
          },
          {
            explanation: "As a decimal",
            math: <MathDisplay math={`\\text{hypotenuse } \\approx ${hypotenuse}\\text{ cm}`} />,
            toggleAngle: true
          }
        ]
      };
    } else {
      // 30-60-90 triangle
      const shortLeg = _.random(2, 6);
      const longLeg = Math.round(shortLeg * Math.sqrt(3) * 100) / 100;
      const hypotenuse = shortLeg * 2;
      
      return {
        title: "30-60-90 Special Triangle",
        question: `In a 30-60-90 triangle with the shorter leg of length ${shortLeg} cm, find the longer leg and the hypotenuse.`,
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
        orientation: 'default',
        visualValues: {
          base: shortLeg,
          height: longLeg
        },
        steps: [
          {
            explanation: "In a 30-60-90 triangle, if the shorter leg (opposite to 30°) is s:",
            math: <MathDisplay math={`\\text{Shorter leg } = s = ${shortLeg}\\text{ cm}`} />
          },
          {
            explanation: "The longer leg (opposite to 60°) = s × √3",
            math: <MathDisplay math={`\\text{Longer leg } = s \\times \\sqrt{3} = ${shortLeg} \\times \\sqrt{3}`} />
          },
          {
            explanation: "Calculate the exact value of the longer leg",
            math: <MathDisplay math={`\\text{Longer leg } = ${shortLeg}\\sqrt{3}\\text{ cm} \\approx ${longLeg}\\text{ cm}`} />
          },
          {
            explanation: "The hypotenuse = 2 × s",
            math: <MathDisplay math={`\\text{Hypotenuse } = 2 \\times s = 2 \\times ${shortLeg} = ${hypotenuse}\\text{ cm}`} />
          },
          {
            explanation: "The three sides of the 30-60-90 triangle are in the ratio s : s√3 : 2s",
            math: <MathDisplay math={`\\text{Sides ratio: } ${shortLeg} : ${shortLeg}\\sqrt{3} : ${hypotenuse}`} />,
            toggleAngle: true
          }
        ]
      };
    }
  };

  // Handle toggling the angle display in the triangle
  const handleStepAction = (step) => {
    if (step && step.toggleAngle) {
      setShowAngle(true);
    }

    // Reset functionality
    if (step && step.reset) {
      setShowAngle(false);
    }
  };

  // Render function for example content
  const renderExampleContent = (example) => {
    if (!example) return null;

    // Determine which angles to show based on example and showAngle state
    let angleVisibility = [false, false];
    let angleLabels = ['θ', ''];
    
    if (example.specialTriangle) {
      // Special triangle angles
      if (example.specialTriangle === '45-45-90') {
        angleVisibility = [true, true];
        angleLabels = ['45°', '45°'];
      } else if (example.specialTriangle === '30-60-90') {
        angleVisibility = [true, true];
        angleLabels = ['30°', '60°'];
      }
    } else if (showAngle) {
      // Regular example with angle shown
      angleVisibility = [true, false];
      angleLabels = [`${example.angle}°`, ''];
    }

    return (
      <div className="flex flex-col-reverse md:flex-row gap-6 items-center pt-4">
        {/* Triangle visualization on the left */}
        <div className="md:w-2/5 flex justify-start pl-4 pt-8 mb-6 md:mb-0">
          <RightTriangle
            base={example.visualValues?.base || 4}
            height={example.visualValues?.height || 3}
            showRightAngle={true}
            showAngles={angleVisibility}
            angleLabels={angleLabels}
            labelStyle="numeric"
            orientation={example.orientation || 'default'}
            containerHeight={300}
            style={{
              fillColor: '#FF9800',
              fillOpacity: 0.2,
              strokeColor: '#E65100'
            }}
          />
        </div>

        {/* Question with working area */}
        <div className="md:w-3/5">
          <div className={`p-5 bg-${theme.pastelBg} rounded-lg mb-6`}>
            <p className="text-gray-700 font-medium">{example.question}</p>
          </div>

          {/* Working area for teacher */}
          <div className="bg-gray-50 p-6 rounded-lg min-h-40 h-48 border border-dashed border-gray-300">
            {/* Empty space for teacher's working */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Themed container with orange accent */}
      <div className="border-2 border-t-4 border-orange-500 rounded-lg shadow-md bg-white overflow-hidden">
        <ExamplesSectionBase
          examples={examples}
          generateExamples={generateExamples}
          renderExampleContent={renderExampleContent}
          currentTopic={currentTopic}
          currentLessonId={currentLessonId}
          currentExampleIndex={currentExampleIndex}
          setCurrentExampleIndex={setCurrentExampleIndex}
          onStepAction={handleStepAction}
          themeKey="examples"
        />
      </div>
    </div>
  );
};

export default ExamplesSection;