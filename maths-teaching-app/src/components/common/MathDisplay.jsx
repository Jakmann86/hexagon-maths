import React from 'react';
import { InlineMath } from 'react-katex';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const MathDisplay = ({
    math = '',  // Default to empty string to prevent undefined errors
    expression = '',  // Add an alternative prop
    size = 'normal',
    className,
    displayMode = false
}) => {
    // Prioritize 'math' prop, fall back to 'expression'
    const safeExpression = (typeof math === 'string' ? math : 
        (typeof expression === 'string' ? expression : '')).trim();

    // If expression is empty, return null or a placeholder
    if (!safeExpression) {
        return null;
    }

    // Map for LaTeX size commands
    const sizeMap = {
        normal: '\\normalsize',
        large: '\\large',
        'x-large': '\\Large',
        huge: '\\huge'
    };

    // Dynamically combine className with size-specific classes
    const wrapperClasses = classNames(
        'math-display',
        `math-${size}`, // e.g. 'math-normal', 'math-large'
        className
    );

    // Ensure the math expression starts with the appropriate LaTeX size command
    const formattedMath = safeExpression.startsWith('\\') ? safeExpression : `${sizeMap[size]} ${safeExpression}`;

    return (
        <div className={wrapperClasses}>
            <InlineMath
                math={formattedMath}
                displayMode={displayMode}
                errorColor={'#cc0000'}
                throwOnError={false}
                strict={false}
            />
        </div>
    );
};

MathDisplay.propTypes = {
    math: PropTypes.string,
    expression: PropTypes.string,
    size: PropTypes.oneOf(['normal', 'large', 'x-large', 'huge']),
    className: PropTypes.string,
    displayMode: PropTypes.bool
};

export default MathDisplay;