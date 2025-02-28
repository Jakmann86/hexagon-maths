// src/components/MathStarters/components/Mathematical/DisplayComponents/Question.jsx  (New file)
import React from 'react';
import MathDisplay from '../../../common/MathDisplay'; // Assuming MathDisplay is in the same directory
import PropTypes from 'prop-types';


const Question = ({ instruction, math, hint, svg }) => (
    <div className="space-y-2">
        <p className="font-medium text-gray-700">{instruction}</p>
        {math && <MathDisplay math={math} size="large" className="mt-1" />} {/* Use MathDisplay here */}
        {hint && <p className="text-sm text-gray-500 italic mt-1">*{hint}</p>}
        {svg && <div dangerouslySetInnerHTML={{ __html: svg }} className="mt-2" />}
        {/*Other jsx elements can be rendered within question such as inputs*/}
    </div>
);

Question.propTypes = {
    instruction: PropTypes.string.isRequired,
    math: PropTypes.string,
    hint: PropTypes.string,
    svg: PropTypes.string,
};


export default Question;