// src/content/topics/trigonometry-i/sohcahtoa1/LearnSection.jsx
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">SOHCAHTOA: Finding Missing Sides</h2>
          
          {/* Main content area */}
          <div className="mb-4">
            <p className="text-lg text-gray-700 mb-4">
              SOHCAHTOA is a mnemonic device that helps us remember the ratios in right-angled triangles:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className={`p-4 bg-${theme.pastelBg} rounded-lg text-center`}>
                <h3 className="font-semibold mb-2">SOH</h3>
                <MathDisplay math="\sin(\theta) = \frac{\text{Opposite}}{\text{Hypotenuse}}" />
              </div>
              
              <div className={`p-4 bg-${theme.pastelBg} rounded-lg text-center`}>
                <h3 className="font-semibold mb-2">CAH</h3>
                <MathDisplay math="\cos(\theta) = \frac{\text{Adjacent}}{\text{Hypotenuse}}" />
              </div>
              
              <div className={`p-4 bg-${theme.pastelBg} rounded-lg text-center`}>
                <h3 className="font-semibold mb-2">TOA</h3>
                <MathDisplay math="\tan(\theta) = \frac{\text{Opposite}}{\text{Adjacent}}" />
              </div>
            </div>
            
            <p className="text-lg text-gray-700">
              These trigonometric ratios allow us to find missing sides in right-angled triangles
              when we know an angle and at least one side.
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
                    <li>When would you use sine vs. cosine vs. tangent?</li>
                    <li>How can we identify which sides are adjacent and opposite?</li>
                    <li>Why do we need to know the angle to find a missing side?</li>
                    <li>What real-world applications use these trigonometric ratios?</li>
                  </ul>
                </div>
                
                <div className={`bg-${theme.pastelBg} p-4 rounded-lg`}>
                  <h4 className={`font-medium text-${theme.pastelText} mb-2`}>Key Points</h4>
                  <ul className={`list-disc list-inside space-y-2 text-${theme.secondaryText}`}>
                    <li>SOHCAHTOA only works for right-angled triangles</li>
                    <li>Opposite and adjacent sides are always relative to the angle</li>
                    <li>The hypotenuse is always the longest side</li>
                    <li>You need to rearrange the formula to find missing sides</li>
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