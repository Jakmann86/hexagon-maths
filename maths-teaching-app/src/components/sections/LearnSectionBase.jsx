// src/components/sections/LearnSectionBase.jsx
import React, { useState } from 'react';
import { Card, CardContent } from '../common/Card';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

/**
 * LearnSectionBase - A template component for structured lesson content
 * 
 * @param {Object} props
 * @param {string} props.title - Main lesson title
 * @param {string} props.lessonTitle - Specific lesson name
 * @param {ReactNode} props.introduction - Introduction content
 * @param {ReactNode} props.concept - Main concept explanation
 * @param {ReactNode} props.visualization - Interactive visualization component
 * @param {string[]} props.hints - Array of teaching hints/questions
 * @param {ReactNode} props.conclusion - Conclusion or summary content
 * @param {string} props.currentTopic - Current topic identifier
 * @param {number} props.currentLessonId - Current lesson identifier
 */
const LearnSectionBase = ({
  title = "Understanding the Concept",
  lessonTitle = "",
  introduction,
  concept,
  visualization,
  hints = [],
  conclusion,
  currentTopic,
  currentLessonId
}) => {
  // State for expandable sections
  const [showHints, setShowHints] = useState(false);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          {/* Lesson Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{title}</h2>
          {lessonTitle && <h3 className="text-lg text-gray-600 mb-6">{lessonTitle}</h3>}
          
          <div className="space-y-8">
            {/* Introduction Section */}
            {introduction && (
              <section className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">Introduction</h3>
                <div className="text-gray-600">
                  {introduction}
                </div>
              </section>
            )}
            
            {/* Main Concept Section */}
            {concept && (
              <section className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">Key Concept</h3>
                <div className="text-gray-600">
                  {concept}
                </div>
              </section>
            )}
            
            {/* Visualization Section */}
            {visualization && (
              <section className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">Interactive Visualization</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {visualization}
                </div>
              </section>
            )}
            
            {/* Teaching Hints Section */}
            {hints && hints.length > 0 && (
              <section className="space-y-4">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center justify-between w-full p-4 bg-amber-50 text-amber-800 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5" />
                    <span className="font-medium">Teaching Prompts & Questions</span>
                  </div>
                  {showHints ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                {showHints && (
                  <div className="ml-6 space-y-3 mt-2">
                    <p className="text-gray-600 italic text-sm">
                      Use these discussion prompts and questions to guide students' understanding:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      {hints.map((hint, index) => (
                        <li key={index}>{hint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
            
            {/* Conclusion Section */}
            {conclusion && (
              <section className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">Summary & Applications</h3>
                <div className="text-gray-600">
                  {conclusion}
                </div>
              </section>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnSectionBase;