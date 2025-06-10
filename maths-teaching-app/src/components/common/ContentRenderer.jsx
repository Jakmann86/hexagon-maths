// src/components/common/ContentRenderer.jsx
// Universal content renderer for consistent math and text rendering across all sections

import React from 'react';
import MathDisplay from './MathDisplay';
import classNames from 'classnames';

/**
 * ContentRenderer - Universal content handler for all section types
 * Provides intelligent auto-detection and customizable rendering controls
 * 
 * @param {Object} props
 * @param {string|object} props.content - Content to render (string, structured object, or explicit type)
 * @param {string} props.type - Explicit type override ('auto', 'text', 'math', 'mixed')
 * @param {string} props.size - Size for math content ('normal', 'large', 'x-large', 'huge')
 * @param {string} props.sectionType - Section context ('starter', 'diagnostic', 'learn', 'examples', 'challenge')
 * @param {boolean} props.center - Whether to center content
 * @param {string} props.className - Additional CSS classes
 * @param {object} props.mathOptions - Custom options for MathDisplay component
 * @param {object} props.textOptions - Custom options for text rendering
 * @param {object} props.detection - Custom detection rules override
 * @param {string} props.color - Color scheme ('default', 'primary', 'secondary', 'accent')
 * @param {string} props.fontWeight - Font weight for text ('normal', 'medium', 'semibold', 'bold')
 * @param {boolean} props.debug - Enable debug logging for detection logic
 */
const ContentRenderer = ({
  content,
  type = 'auto',
  size = 'normal',
  sectionType = 'default',
  center = false,
  className = '',
  mathOptions = {},
  textOptions = {},
  detection = {},
  color = 'default',
  fontWeight = 'normal',
  debug = false
}) => {
  // Early return for empty content
  if (!content && content !== 0) return null;

  // Debug logging helper
  const debugLog = (message, data = {}) => {
    if (debug) {
      console.log(`[ContentRenderer] ${message}`, data);
    }
  };

  debugLog('Rendering content', { content, type, sectionType });

  // Handle explicit type override - highest priority
  if (type !== 'auto') {
    debugLog('Using explicit type override', { type });
    return renderWithExplicitType(content, type);
  }

  // Handle explicit content objects with type specification
  if (typeof content === 'object' && content !== null) {
    if (content.content !== undefined && content.type !== undefined) {
      debugLog('Found explicit content object', content);
      return (
        <ContentRenderer
          content={content.content}
          type={content.type}
          size={size}
          sectionType={sectionType}
          center={center}
          className={className}
          mathOptions={mathOptions}
          textOptions={textOptions}
          color={color}
          fontWeight={fontWeight}
        />
      );
    }

    // Handle structured mixed content (text + math)
    if (content.text !== undefined || content.math !== undefined) {
      debugLog('Found structured mixed content', content);
      return renderMixedContent(content);
    }
  }

  // Handle string content with intelligent auto-detection
  if (typeof content === 'string') {
    debugLog('Analyzing string content for auto-detection');
    const detectionResult = analyzeContent(content.toString());
    debugLog('Detection result', detectionResult);

    return renderBasedOnDetection(content, detectionResult);
  }

  // Handle numeric content
  if (typeof content === 'number') {
    debugLog('Found numeric content, rendering as math');
    return renderMath(content.toString());
  }

  // Fallback for unknown content types
  debugLog('Unknown content type, rendering as text', { contentType: typeof content });
  return renderText(String(content));

  // ==================== RENDERING FUNCTIONS ====================

  /**
   * Render content with explicit type override
   */
  function renderWithExplicitType(content, explicitType) {
    switch (explicitType) {
      case 'math':
        return renderMath(content);
      case 'text':
        return renderText(content);
      case 'mixed':
        return renderMixedContent(content);
      case 'html':
        return renderHTML(content);
      default:
        return renderText(content);
    }
  }

  /**
   * Render structured mixed content (text + math)
   */
  function renderMixedContent(mixedContent) {
    const { text = '', math = '', layout = 'horizontal' } = mixedContent;

    if (layout === 'vertical') {
      return (
        <div className={classNames('flex flex-col items-center gap-3', className)}>
          {text && renderText(text)}
          {math && renderMath(math)}
        </div>
      );
    } else {
      return (
        <div className={classNames('flex items-center justify-center gap-1', className)}>
          {text && renderText(text)}
          {math && renderMath(math)}
        </div>
      );
    }
  }

  /**
   * Render as mathematical expression using MathDisplay
   */
  function renderMath(mathContent) {
    // Preprocess math content for better LaTeX rendering
    let processed = mathContent;

    if (typeof processed === 'string') {
      // Convert multiplication symbols and expressions
      processed = processed.replace(/×/g, '\\times');
      processed = processed.replace(/\s*\*\s*/g, ' \\times ');
      processed = processed.replace(/(\d+)\s+times\s+(\d+)/gi, '$1 \\times $2');
      processed = processed.replace(/(\d+)\s+x\s+(\d+)/gi, '$1 \\times $2');

      // Handle proper spacing around operators
      processed = processed.replace(/\s*\+\s*/g, ' + ');
      processed = processed.replace(/\s*-\s*/g, ' - ');
      processed = processed.replace(/\s*=\s*/g, ' = ');
    }

    const mergedMathOptions = {
      size,
      center,
      ...mathOptions
    };

    return (
      <div className={classNames(className, { 'text-center': center })}>
        <MathDisplay math={processed} {...mergedMathOptions} />
      </div>
    );
  }

  /**
   * Render as plain text with customizable styling
   */
  function renderText(textContent) {
    const colorClasses = getColorClasses();
    const fontClasses = getFontClasses();
    const sizeClasses = getSizeClasses();

    const mergedTextOptions = {
      className: classNames(
        colorClasses,
        fontClasses,
        sizeClasses,
        { 'text-center': center },
        className
      ),
      ...textOptions
    };

    return (
      <div {...mergedTextOptions}>
        {textContent}
      </div>
    );
  }

  /**
   * Render as HTML (dangerous, use carefully)
   */
  function renderHTML(htmlContent) {
    return (
      <div
        className={classNames(className, { 'text-center': center })}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }

  /**
   * Render based on auto-detection results
   */
  function renderBasedOnDetection(content, detectionResult) {
    const { shouldRenderAsMath, confidence, reasons } = detectionResult;

    debugLog('Rendering decision', { shouldRenderAsMath, confidence, reasons });

    if (shouldRenderAsMath) {
      return renderMath(content);
    } else {
      return renderText(content);
    }
  }

  // ==================== CONTENT ANALYSIS ====================

  /**
   * Intelligent content analysis with high-class detection logic
   */
  function analyzeContent(text) {
    const trimmedText = text.trim();
    let score = 0;
    const reasons = [];

    // Custom detection rules override
    const rules = {
      forceText: [], // Patterns that force text rendering
      forceMath: [], // Patterns that force math rendering
      textBoost: 0,  // Score boost for text
      mathBoost: 0,  // Score boost for math
      ...detection   // User-provided overrides
    };

    // Check for explicit overrides first
    if (rules.forceText.some(pattern => pattern.test(trimmedText))) {
      return { shouldRenderAsMath: false, confidence: 1.0, reasons: ['Force text override'] };
    }

    if (rules.forceMath.some(pattern => pattern.test(trimmedText))) {
      return { shouldRenderAsMath: true, confidence: 1.0, reasons: ['Force math override'] };
    }

    // 1. Text indicators (negative scores - prefer text)
    const textIndicators = [
      { pattern: /^(none|all|true|false|yes|no|try|error)/i, score: -100, reason: 'Common text options' },
      { pattern: /(none of these|all of these|not possible|cannot|impossible)/i, score: -100, reason: 'Text phrases' },
      { pattern: /[a-zA-Z]{3,}/, score: -20, reason: 'Contains words' },
      { pattern: /\s+[a-zA-Z]+\s+/, score: -30, reason: 'Multiple words' },
      { pattern: /^[A-Z][a-z]/, score: -15, reason: 'Sentence case' },
      { pattern: /[.!?]$/, score: -25, reason: 'Sentence ending' },
      { pattern: /\b(is|are|the|and|or|but|with|from|for|about)\b/i, score: -35, reason: 'Common English words' }
    ];

    // 2. Math indicators (positive scores - prefer math)
    const mathIndicators = [
      { pattern: /^\\/, score: 100, reason: 'LaTeX command' },
      { pattern: /\$/, score: 90, reason: 'Math delimiters' },
      { pattern: /^\d+(\.\d+)?$/, score: 80, reason: 'Pure number' },
      { pattern: /^\d+(\.\d+)?\s*(cm|m|mm|km|ft|in|°|degrees)(\^?\d+)?$/i, score: 85, reason: 'Number with units' },
      { pattern: /×/, score: 70, reason: 'Multiplication symbol' },
      { pattern: /\\times/, score: 70, reason: 'LaTeX times' },
      { pattern: /\d+\s+(times|x)\s+\d+/i, score: 75, reason: 'Multiplication expression' },
      { pattern: /[+\-*/=<>^_{}]/, score: 25, reason: 'Math operators' },
      { pattern: /\\text\{/, score: 60, reason: 'LaTeX text command' },
      { pattern: /\\frac\{/, score: 70, reason: 'Fraction' },
      { pattern: /\\sqrt\{/, score: 70, reason: 'Square root' },
      { pattern: /[αβγθπφψ]/, score: 50, reason: 'Greek letters' },
      { pattern: /\^\d+/, score: 40, reason: 'Superscript' },
      { pattern: /_\d+/, score: 40, reason: 'Subscript' }
    ];

    // 3. Section-specific adjustments
    const sectionAdjustments = {
      'starter': { textBoost: 10, mathBoost: 0 },      // Slightly prefer text for clarity
      'diagnostic': { textBoost: 0, mathBoost: 20 },   // Prefer math for consistency
      'learn': { textBoost: 5, mathBoost: 15 },        // Balanced with slight math preference
      'examples': { textBoost: 0, mathBoost: 25 },     // Strong math preference for examples
      'challenge': { textBoost: 0, mathBoost: 20 }     // Math preference for challenges
    };

    const sectionBoost = sectionAdjustments[sectionType] || { textBoost: 0, mathBoost: 0 };

    // Apply text indicator scoring
    textIndicators.forEach(({ pattern, score: indicatorScore, reason }) => {
      if (pattern.test(trimmedText)) {
        score += indicatorScore;
        reasons.push(`${reason} (${indicatorScore})`);
      }
    });

    // Apply math indicator scoring
    mathIndicators.forEach(({ pattern, score: indicatorScore, reason }) => {
      if (pattern.test(trimmedText)) {
        score += indicatorScore;
        reasons.push(`${reason} (+${indicatorScore})`);
      }
    });

    // Apply section-specific adjustments
    score += sectionBoost.mathBoost - sectionBoost.textBoost;
    if (sectionBoost.mathBoost || sectionBoost.textBoost) {
      reasons.push(`Section adjustment (${sectionBoost.mathBoost - sectionBoost.textBoost})`);
    }

    // Apply custom rule boosts
    score += rules.mathBoost - rules.textBoost;

    // Calculate confidence based on score magnitude
    const confidence = Math.min(Math.abs(score) / 100, 1.0);

    // Determine final decision
    const shouldRenderAsMath = score > 0;

    return { shouldRenderAsMath, confidence, reasons, finalScore: score };
  }

  // ==================== STYLING HELPERS ====================

  function getColorClasses() {
    const colorMap = {
      default: 'text-gray-800',
      primary: 'text-blue-800',
      secondary: 'text-purple-700',
      accent: 'text-green-700',
      muted: 'text-gray-600',
      error: 'text-red-600',
      success: 'text-green-600'
    };
    return colorMap[color] || colorMap.default;
  }

  function getFontClasses() {
    const fontMap = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    };
    return fontMap[fontWeight] || fontMap.normal;
  }

  function getSizeClasses() {
    const sizeMap = {
      small: 'text-sm',
      normal: 'text-lg',
      large: 'text-xl',
      'x-large': 'text-2xl'
    };
    return sizeMap[size] || sizeMap.normal;
  }
};

// Set display name for debugging
ContentRenderer.displayName = 'ContentRenderer';

export default ContentRenderer;