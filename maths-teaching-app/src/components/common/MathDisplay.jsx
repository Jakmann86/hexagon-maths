// Updated MathDisplay.jsx
import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import classNames from 'classnames';

const MathDisplay = ({
    math = '',
    size = 'normal',
    className = '',
    displayMode = false
}) => {
    // Clean up math expression
    const safeExpression = (typeof math === 'string' ? math : '').trim();
    
    if (!safeExpression) {
        return null;
    }

    // Use MathStarters-inspired styling classes
    const wrapperClasses = classNames(
        'math-display',
        `math-${size}`,
        className
    );

    // Choose display mode based on complexity
    const shouldUseBlockMode = displayMode || 
        safeExpression.includes('\\begin{align') ||
        safeExpression.includes('\\\\');

    return (
        <div className={wrapperClasses}>
            {shouldUseBlockMode ? (
                <BlockMath math={safeExpression} />
            ) : (
                <InlineMath math={safeExpression} />
            )}
        </div>
    );
};

export default MathDisplay;