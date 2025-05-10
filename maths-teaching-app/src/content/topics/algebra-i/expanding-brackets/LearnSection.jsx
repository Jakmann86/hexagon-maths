// src/content/topics/algebra-i/expanding-brackets/LearnSection.jsx
import React from 'react';
import { Card, CardContent } from '../../../../components/common/Card';
import MathDisplay from '../../../../components/common/MathDisplay';
import { useUI } from '../../../../context/UIContext';
import { useSectionTheme } from '../../../../hooks/useSectionTheme';

const LearnSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  // Get theme colors for learn section
  const theme = useSectionTheme('learn');
  
  return (
    <div className="space-y-6">
      <Card className={`border-t-4 border-${theme.primary}`}>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Expanding Double Brackets</h2>
          
          {/* Placeholder content */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-lg text-gray-700 mb-6">
              This section will teach students how to expand expressions with double brackets using the FOIL method.
            </p>
            
            <div className="flex justify-center mb-6">
              <MathDisplay math="(a + b)(c + d) = ac + ad + bc + bd" size="large" />
            </div>
            
            <p className="text-center text-gray-500 italic">
              Full content coming soon...
            </p>
          </div>
          
          {/* Teacher hints - only shown when answers/hints are toggled on */}
          {showAnswers && (
            <div className={`mt-8 border-t border-${theme.borderColor} pt-6`}>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Teacher Notes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-2">Discussion Questions</h4>
                  <ul className="list-disc list-inside space-y-2 text-amber-700">
                    <li>What does FOIL stand for in expanding brackets?</li>
                    <li>How can we use an area model to understand double brackets?</li>
                    <li>How can we check if our expansion is correct?</li>
                    <li>What patterns do you notice when expanding (x+a)(x+b)?</li>
                  </ul>
                </div>
                
                <div className={`bg-${theme.pastelBg} p-4 rounded-lg`}>
                  <h4 className={`font-medium text-${theme.pastelText} mb-2`}>Key Points</h4>
                  <ul className={`list-disc list-inside space-y-2 text-${theme.secondaryText}`}>
                    <li>FOIL: First, Outside, Inside, Last</li>
                    <li>Double brackets expansion creates a quadratic expression</li>
                    <li>The area model helps visualize the expansion</li>
                    <li>Collecting like terms is essential after expanding</li>
                  </ul>
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