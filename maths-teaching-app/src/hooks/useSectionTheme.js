// src/hooks/useSectionTheme.js
import { useMemo } from 'react';

/**
 * Hook to provide consistent theming for different section types
 * @param {string} sectionType - The type of section ('starter', 'diagnostic', 'learn', 'examples', 'challenge')
 * @returns {Object} An object containing color class names and styling properties for the section
 */
export const useSectionTheme = (sectionType) => {
  return useMemo(() => {
    // Define color schemes for each section type
    const themes = {
      starter: {
        name: 'Starter',
        key: 'blue',
        primary: 'blue-500',
        primaryHover: 'blue-600',
        secondary: 'blue-100',
        secondaryText: 'blue-700',
        pastelBg: 'blue-50',
        pastelText: 'blue-800',
        borderColor: 'blue-200',
        focus: 'blue-500',
      },
      diagnostic: {
        name: 'Diagnostic',
        key: 'purple',
        primary: 'purple-500',
        primaryHover: 'purple-600',
        secondary: 'purple-100',
        secondaryText: 'purple-700',
        pastelBg: 'purple-50',
        pastelText: 'purple-800',
        borderColor: 'purple-200',
        focus: 'purple-500',
      },
      learn: {
        name: 'Learn',
        key: 'green',
        primary: 'green-500',
        primaryHover: 'green-600',
        secondary: 'green-100',
        secondaryText: 'green-700',
        pastelBg: 'green-50',
        pastelText: 'green-800',
        borderColor: 'green-200',
        focus: 'green-500',
      },
      examples: {
        name: 'Examples',
        key: 'orange',
        primary: 'orange-500',
        primaryHover: 'orange-600',
        secondary: 'orange-100',
        secondaryText: 'orange-700',
        pastelBg: 'orange-50',
        pastelText: 'orange-800',
        borderColor: 'orange-200',
        focus: 'orange-500',
      },
      challenge: {
        name: 'Challenge',
        key: 'red',
        primary: 'red-500',
        primaryHover: 'red-600',
        secondary: 'red-100',
        secondaryText: 'red-700',
        pastelBg: 'red-50',
        pastelText: 'red-800',
        borderColor: 'red-200',
        focus: 'red-500',
      }
    };

    // Return the requested theme, or default to starter if not found
    return themes[sectionType] || themes.starter;
  }, [sectionType]);
};

export default useSectionTheme;