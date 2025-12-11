// src/content/topics/algebra-ii/quadratic-simultaneous/StarterSection.jsx
// Starter Section for Quadratic Simultaneous Equations (Algebra II - Lesson 3)
// Following Pattern 2 architecture
//
// Last Lesson: Factorising Quadratics (random from that generator)
// Last Week: Random from Recurring Decimals, Factorising Quadratics (previous 2 lessons)
// Last Topic: Most difficult Trigonometry questions
// Last Year: Magic Square puzzle

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useUI } from '../../../../context/UIContext';
import MathDisplay from '../../../../components/common/MathDisplay';

// Import generators
import { factorisingQuadraticsGenerators } from '../../../../generators/algebra/factorisingQuadraticsGenerator';
import { recurringDecimalsGenerators } from '../../../../generators/algebra/recurringDecimalsGenerator';

// ============================================================
// TRIGONOMETRY GENERATORS (Most difficult - for Last Topic)
// These would normally be imported from trigonometry generators
// ============================================================

const generateDifficultTrigQuestion = (seed) => {
  const questions = [
    {
      question: 'Find the exact value of $\\sin 60° \\times \\cos 30° + \\sin 30° \\times \\cos 60°$',
      answer: '1',
      workingOut: '\\frac{\\sqrt{3}}{2} \\times \\frac{\\sqrt{3}}{2} + \\frac{1}{2} \\times \\frac{1}{2} = \\frac{3}{4} + \\frac{1}{4} = 1'
    },
    {
      question: 'Solve $2\\sin x = \\sqrt{3}$ for $0° \\leq x \\leq 360°$',
      answer: 'x = 60°, 120°',
      workingOut: '\\sin x = \\frac{\\sqrt{3}}{2}, x = 60° \\text{ or } x = 180° - 60° = 120°'
    },
    {
      question: 'In triangle ABC, AB = 8 cm, BC = 6 cm, angle ABC = 60°. Find AC.',
      answer: '7.21 cm (3 s.f.)',
      workingOut: 'AC^2 = 8^2 + 6^2 - 2(8)(6)\\cos 60° = 64 + 36 - 48 = 52, AC = \\sqrt{52} = 7.21'
    },
    {
      question: 'Find the area of a triangle with sides 7 cm and 9 cm and included angle 40°.',
      answer: '20.2 cm² (3 s.f.)',
      workingOut: 'Area = \\frac{1}{2} \\times 7 \\times 9 \\times \\sin 40° = 31.5 \\times 0.643 = 20.2'
    },
    {
      question: 'Given $\\tan x = \\frac{3}{4}$ and $x$ is acute, find $\\sin x$.',
      answer: '\\frac{3}{5}',
      workingOut: '\\text{Hypotenuse} = \\sqrt{3^2 + 4^2} = 5, \\sin x = \\frac{3}{5}'
    },
    {
      question: 'Solve $\\cos^2 x = \\frac{1}{4}$ for $0° \\leq x \\leq 360°$',
      answer: 'x = 60°, 120°, 240°, 300°',
      workingOut: '\\cos x = \\pm\\frac{1}{2}, x = 60°, 120°, 240°, 300°'
    }
  ];
  return questions[seed % questions.length];
};

// ============================================================
// MAGIC SQUARE GENERATOR (Last Year puzzle)
// ============================================================

const generateMagicSquare = (seed) => {
  // Magic squares where rows, columns, diagonals sum to same value
  const squares = [
    {
      grid: [[8, 1, 6], [3, 5, 7], [4, 9, 2]],
      hidden: [[0, 0], [1, 1], [2, 2]], // Hide diagonal
      sum: 15
    },
    {
      grid: [[2, 7, 6], [9, 5, 1], [4, 3, 8]],
      hidden: [[0, 1], [1, 2], [2, 0]],
      sum: 15
    },
    {
      grid: [[16, 3, 2, 13], [5, 10, 11, 8], [9, 6, 7, 12], [4, 15, 14, 1]],
      hidden: [[0, 0], [1, 1], [2, 2], [3, 3]],
      sum: 34
    },
    {
      grid: [[6, 1, 8], [7, 5, 3], [2, 9, 4]],
      hidden: [[0, 2], [1, 0], [2, 1]],
      sum: 15
    }
  ];

  const selected = squares[seed % squares.length];
  
  // Create display grid with blanks
  const displayGrid = selected.grid.map((row, i) => 
    row.map((val, j) => {
      const isHidden = selected.hidden.some(([hi, hj]) => hi === i && hj === j);
      return isHidden ? null : val;
    })
  );

  // Get the hidden values for the answer
  const hiddenValues = selected.hidden.map(([i, j]) => selected.grid[i][j]);

  return {
    grid: displayGrid,
    fullGrid: selected.grid,
    sum: selected.sum,
    hiddenPositions: selected.hidden,
    answer: `Hidden values: ${hiddenValues.join(', ')} (Magic sum = ${selected.sum})`
  };
};

// ============================================================
// QUESTION GENERATORS FOR EACH CATEGORY
// ============================================================

const generateLastLessonQuestion = (seed) => {
  // Last lesson was Factorising Quadratics
  const generators = [
    factorisingQuadraticsGenerators.generateSimpleQuadratic,
    factorisingQuadraticsGenerators.generateDifferenceOfSquares,
    factorisingQuadraticsGenerators.generateComplexQuadratic
  ];
  
  const generator = generators[seed % generators.length];
  const question = generator({ seed });
  
  return {
    question: question.questionText,
    answer: question.answer,
    workingOut: question.solution?.map(s => s.formula).join(' \\rightarrow ') || ''
  };
};

const generateLastWeekQuestion = (seed) => {
  // Last week: Recurring Decimals and Factorising Quadratics
  const allGenerators = [
    // Recurring decimals
    () => {
      const q = recurringDecimalsGenerators.generateSingleDigitRecurring({ seed });
      return { question: q.questionText, answer: q.answer, workingOut: q.solution?.map(s => s.formula).join(' \\\\ ') || '' };
    },
    () => {
      const q = recurringDecimalsGenerators.generateTwoDigitRecurring({ seed });
      return { question: q.questionText, answer: q.answer, workingOut: q.solution?.map(s => s.formula).join(' \\\\ ') || '' };
    },
    // Factorising
    () => {
      const q = factorisingQuadraticsGenerators.generateSimpleQuadratic({ seed });
      return { question: q.questionText, answer: q.answer, workingOut: '' };
    },
    () => {
      const q = factorisingQuadraticsGenerators.generateDifferenceOfSquares({ seed });
      return { question: q.questionText, answer: q.answer, workingOut: '' };
    }
  ];

  const generator = allGenerators[seed % allGenerators.length];
  return generator();
};

const generateLastTopicQuestion = (seed) => {
  // Last topic: Trigonometry (most difficult)
  return generateDifficultTrigQuestion(seed);
};

const generateLastYearQuestion = (seed) => {
  // Magic square puzzle
  const magicSquare = generateMagicSquare(seed);
  return {
    type: 'magic-square',
    ...magicSquare
  };
};

// ============================================================
// MAGIC SQUARE COMPONENT
// ============================================================

const MagicSquareDisplay = ({ grid, showAnswer, fullGrid }) => {
  const size = grid.length;
  const cellSize = size === 4 ? 'w-12 h-12 text-lg' : 'w-14 h-14 text-xl';
  
  return (
    <div className="flex flex-col items-center">
      <div className={`grid gap-1 ${size === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
        {grid.map((row, i) => 
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`${cellSize} border-2 border-gray-400 flex items-center justify-center font-bold rounded ${
                cell === null 
                  ? showAnswer 
                    ? 'bg-green-100 text-green-700 border-green-400' 
                    : 'bg-yellow-50 border-yellow-400'
                  : 'bg-white'
              }`}
            >
              {cell === null ? (showAnswer ? fullGrid[i][j] : '?') : cell}
            </div>
          ))
        )}
      </div>
      <p className="text-sm text-gray-500 mt-2">Each row, column, and diagonal sums to the same value</p>
    </div>
  );
};

// ============================================================
// MAIN STARTER SECTION COMPONENT
// ============================================================

const StarterSection = ({ currentTopic, currentLessonId }) => {
  const { showAnswers } = useUI();
  const [questions, setQuestions] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});

  const generateAllQuestions = useCallback(() => {
    const seed = Date.now();
    setQuestions({
      lastLesson: generateLastLessonQuestion(seed),
      lastWeek: generateLastWeekQuestion(seed + 1000),
      lastTopic: generateLastTopicQuestion(seed + 2000),
      lastYear: generateLastYearQuestion(seed + 3000)
    });
    setExpandedCards({});
  }, []);

  useEffect(() => {
    generateAllQuestions();
  }, [generateAllQuestions]);

  const toggleCard = (cardKey) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardKey]: !prev[cardKey]
    }));
  };

  if (!questions) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const categories = [
    { key: 'lastLesson', title: 'Last Lesson', subtitle: 'Factorising Quadratics', color: 'blue' },
    { key: 'lastWeek', title: 'Last Week', subtitle: 'Recurring Decimals & Factorising', color: 'green' },
    { key: 'lastTopic', title: 'Last Topic', subtitle: 'Trigonometry', color: 'purple' },
    { key: 'lastYear', title: 'Last Year', subtitle: 'Magic Square', color: 'amber' }
  ];

  const colorClasses = {
    blue: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', header: 'bg-blue-500' },
    green: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-700', header: 'bg-green-500' },
    purple: { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-700', header: 'bg-purple-500' },
    amber: { border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', header: 'bg-amber-500' }
  };

  return (
    <div className="space-y-6">
      {/* Header with regenerate button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Starter Questions</h2>
        <button
          onClick={generateAllQuestions}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
        >
          <RefreshCw size={18} />
          <span>New Questions</span>
        </button>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(({ key, title, subtitle, color }) => {
          const q = questions[key];
          const colors = colorClasses[color];
          const isExpanded = expandedCards[key];
          const isMagicSquare = q.type === 'magic-square';

          return (
            <div
              key={key}
              className={`border-2 ${colors.border} rounded-lg overflow-hidden shadow-sm`}
            >
              {/* Card Header */}
              <div className={`${colors.header} text-white px-4 py-2`}>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm opacity-90">{subtitle}</p>
              </div>

              {/* Card Content */}
              <div className={`${colors.bg} p-4`}>
                {isMagicSquare ? (
                  <MagicSquareDisplay 
                    grid={q.grid} 
                    fullGrid={q.fullGrid}
                    showAnswer={showAnswers} 
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-lg mb-2">
                      <MathDisplay 
                        math={q.question?.replace(/^\$/, '').replace(/\$$/, '').replace('Factorise: ', '').replace('Show that ', '').replace(/\$/g, '')} 
                        displayMode={true} 
                      />
                    </div>
                  </div>
                )}

                {/* Answer Section */}
                {showAnswers && (
                  <div className={`mt-4 pt-3 border-t ${colors.border}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <p className={`text-sm font-medium ${colors.text}`}>Answer:</p>
                        <div className="mt-1">
                          <MathDisplay math={q.answer} displayMode={false} />
                        </div>
                      </div>
                      
                      {/* Expand working button */}
                      {q.workingOut && (
                        <button
                          onClick={() => toggleCard(key)}
                          className={`ml-2 p-1 ${colors.text} hover:opacity-70`}
                        >
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      )}
                    </div>

                    {/* Expanded working */}
                    {isExpanded && q.workingOut && (
                      <div className="mt-3 p-3 bg-white rounded border text-sm">
                        <p className="text-gray-500 mb-1">Working:</p>
                        <MathDisplay math={q.workingOut} displayMode={true} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StarterSection;