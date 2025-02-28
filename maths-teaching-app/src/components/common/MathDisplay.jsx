// src/components/MathStarters/components/Mathematical/DisplayComponents/MathDisplay.js
import React from 'react';
import { InlineMath } from 'react-katex';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const MathDisplay = ({
    math,
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
    math: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['normal', 'large', 'x-large', 'huge']),
    className: PropTypes.string,
    displayMode: PropTypes.bool
};

export default MathDisplay;
