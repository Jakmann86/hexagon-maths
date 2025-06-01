// Updated MathDisplay.jsx - Improved KaTeX rendering and consistency
import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import classNames from 'classnames';

/**
 * MathDisplay - Consistent mathematical expression renderer
 * Handles both inline and block math with proper sizing and error handling
 * 
 * @param {Object} props
 * @param {string} props.math - LaTeX math expression to render
 * @param {string} props.size - Size variant ('normal', 'large', 'x-large', 'huge')
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.displayMode - Force block/display mode (optional)
 * @param {boolean} props.center - Center the math expression (default: false)
 * @param {string} props.errorFallback - Text to show if LaTeX fails to render
 */
const MathDisplay = ({
    math = '',
    size = 'normal',
    className = '',
    displayMode = null, // null = auto-detect, true = force block, false = force inline
    center = false,
    errorFallback = null
}) => {
    // Clean up math expression
    const safeExpression = (typeof math === 'string' ? math : '').trim();
    
    if (!safeExpression) {
        return null;
    }

    // Enhanced auto-detection for block mode
    const shouldUseBlockMode = displayMode !== null 
        ? displayMode  // Use explicit setting if provided
        : (
            // Auto-detect cases that should use block mode
            safeExpression.includes('\\\\') ||           // Line breaks
            safeExpression.includes('\\begin{') ||       // Environments (align, array, etc.)
            safeExpression.includes('\\frac{') ||        // Fractions look better in block mode
            safeExpression.includes('\\sum') ||          // Summations
            safeExpression.includes('\\int') ||          // Integrals
            safeExpression.includes('\\prod') ||         // Products
            safeExpression.includes('\\sqrt{') ||        // Square roots
            safeExpression.length > 50                   // Long expressions
        );

    // Build wrapper classes with proper size handling
    const wrapperClasses = classNames(
        'math-display',
        `math-${size}`,
        {
            'text-center': center,
            'katex-block': shouldUseBlockMode,
            'katex-inline': !shouldUseBlockMode
        },
        className
    );

    // KaTeX rendering options for consistency
    const katexOptions = {
        throwOnError: false,        // Don't throw on errors, show error in red
        errorColor: '#dc2626',      // Red color for errors
        strict: false,              // Allow more LaTeX features
        trust: false,               // Don't allow dangerous commands
        macros: {
            // Add common educational math macros
            '\\R': '\\mathbb{R}',
            '\\N': '\\mathbb{N}',
            '\\Z': '\\mathbb{Z}',
            '\\Q': '\\mathbb{Q}',
        }
    };

    // Error boundary for malformed LaTeX
    const renderMath = () => {
        try {
            if (shouldUseBlockMode) {
                return (
                    <BlockMath 
                        math={safeExpression} 
                        {...katexOptions}
                    />
                );
            } else {
                return (
                    <InlineMath 
                        math={safeExpression} 
                        {...katexOptions}
                    />
                );
            }
        } catch (error) {
            console.warn('KaTeX rendering error:', error, 'Expression:', safeExpression);
            
            // Fallback to error message or original text
            const fallbackText = errorFallback || `Math Error: ${safeExpression}`;
            return (
                <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-sm">
                    {fallbackText}
                </span>
            );
        }
    };

    return (
        <div className={wrapperClasses}>
            {renderMath()}
        </div>
    );
};

// Add display name for debugging
MathDisplay.displayName = 'MathDisplay';

export default MathDisplay;