// src/content/topics/trigonometry-i/pythagoras/LearnSection.jsx
import React from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import PythagorasVisualization from '../../../../components/math/visualizations/PythagorasVisualization';
import MathDisplay from '../../../../components/common/MathDisplay';
import { useUI } from '../../../../context/UIContext';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';
import PythagorasVisualizationGraph from '../../../../components/math/visualizations/PythagorasVisualizationGraph';

const LearnSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  // Get theme colors for learn section
  const theme = useSectionTheme('learn');
  
  return (
    <div className="space-y-6">
      <Card className={`border-t-4 border-${theme.primary}`}>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pythagoras' Theorem</h2>
          
          {/* Main visualization - central focus */}
          <div className="mb-4 flex justify-center">
            <div className="w-full max-w-2xl">
              <PythagorasVisualizationGraph />
            </div>
          </div>
          
          {/* Teacher hints - only shown when answers/hints are toggled on */}
          {showAnswers && (
            <div className={`mt-8 border-t border-${theme.borderColor} pt-6`}>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Teacher Notes</h3>
              
              {/* Formulas section */}
              <div className={`mb-6 bg-${theme.pastelBg} p-4 rounded-lg`}>
                <h4 className={`font-medium text-${theme.pastelText} mb-2`}>Key Formulas</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex justify-center">
                    <MathDisplay math="a^2 + b^2 = c^2" />
                  </div>
                  <div className="flex justify-center">
                    <MathDisplay math="c = \sqrt{a^2 + b^2}" />
                  </div>
                  <div className="flex justify-center">
                    <MathDisplay math="a = \sqrt{c^2 - b^2}" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-2">Discussion Questions</h4>
                  <ul className="list-disc list-inside space-y-2 text-amber-700">
                    <li>What happens to the square areas when we change the triangle dimensions?</li>
                    <li>How can we verify the relationship a² + b² = c² for a 3-4-5 triangle?</li>
                    <li>Why does this relationship only work for right triangles?</li>
                    <li>What real-world applications use this principle?</li>
                  </ul>
                </div>
                
                <div className={`bg-${theme.pastelBg} p-4 rounded-lg`}>
                  <h4 className={`font-medium text-${theme.pastelText} mb-2`}>Key Points</h4>
                  <ul className={`list-disc list-inside space-y-2 text-${theme.secondaryText}`}>
                    <li>Pythagorean triples are sets of integers that satisfy the theorem:
                      <ul className="list-disc list-inside ml-4 mt-1">
                        <li>(3, 4, 5)</li>
                        <li>(5, 12, 13)</li>
                        <li>(8, 15, 17)</li>
                        <li>(7, 24, 25)</li>
                      </ul>
                    </li>
                    <li>The visualization proves the theorem by directly comparing areas</li>
                    <li>The theorem only works for right-angled triangles</li>
                  </ul>
                </div>
              </div>
              
              <div className={`mt-4 bg-${theme.pastelBg} p-4 rounded-lg`}>
                <h4 className={`font-medium text-${theme.pastelText} mb-2`}>Applications & Activities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-1">Real-World Applications</h5>
                    <ul className={`list-disc list-inside space-y-1 text-${theme.secondaryText}`}>
                      <li>Construction: Creating right angles</li>
                      <li>Navigation: Calculating direct distances</li>
                      <li>Engineering: Structural stability</li>
                      <li>Computer graphics: Distance calculations</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">Classroom Activities</h5>
                    <ol className={`list-decimal list-inside space-y-1 text-${theme.secondaryText}`}>
                      <li>Create paper squares to physically verify the relationship</li>
                      <li>Challenge: Find other Pythagorean triples</li>
                      <li>Measure classroom objects and apply the theorem</li>
                      <li>Historical connection: Egyptian rope knotting (3-4-5 triangles)</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnSection;