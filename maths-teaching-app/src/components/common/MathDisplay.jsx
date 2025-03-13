import React from 'react';
import { InlineMath } from 'react-katex';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const MathDisplay = ({
    math = '',  // Default to empty string to prevent undefined errors
    size = 'normal',
    className,
    displayMode = false
}) => {
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

    // Defensive check to ensure math is a string
    if (!math || typeof math !== 'string') {
        console.warn('MathDisplay: Invalid or missing math expression');
        return <div className={wrapperClasses}>Invalid expression</div>;
    }

    // Ensure the math expression starts with the appropriate LaTeX size command
    const formattedMath = math.startsWith('\\') ? math : `${sizeMap[size]} ${math}`;

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
    size: PropTypes.oneOf(['normal', 'large', 'x-large', 'huge']),
    className: PropTypes.string,
    displayMode: PropTypes.bool
};

export default MathDisplay;