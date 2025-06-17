// src/generators/puzzles/symbolThemes.js - Enhanced with compatibility

/**
 * Enhanced symbol themes for visual algebra puzzles
 * Each theme contains 6 unique symbols with fallback options for compatibility
 * Symbols are carefully chosen to be visually distinct and work across browsers
 */
export const symbolThemes = {
  // HIGH COMPATIBILITY THEMES (work everywhere)
  fruit: ['🍎', '🍌', '🍊', '🍇', '🥝', '🍓'],
  animals: ['🐱', '🐶', '🐼', '🦊', '🐸', '🐺'],
  sports: ['⚽', '🏀', '🎾', '🏈', '🏐', '🏓'],
  food: ['🍕', '🍔', '🌮', '🍰', '🍪', '🧁'],
  
  // MEDIUM COMPATIBILITY THEMES  
  school: ['📚', '✏️', '📐', '📏', '🖊️', '📝'],
  space: ['🌟', '🌙', '🪐', '☀️', '🌍', '🚀'],
  
  // IMPROVED SHAPES THEME (better compatibility)
  shapes: ['■', '▲', '●', '◆', '★', '♦'], // Using basic Unicode symbols instead
  
  // BACKUP SHAPES (if even basic symbols fail)
  shapesBasic: ['□', '△', '○', '◇', '☆', '♢'], // Outline versions
  
  // COLOR BLOCKS (improved compatibility)
  colors: ['🔴', '🟡', '🟢', '🔵', '🟣', '🟤'], // Using circle emojis instead of squares
  
  // NATURE THEME
  nature: ['🌸', '🌲', '🍀', '🌺', '🌻', '🌿'],
  
  // CLASSIC SYMBOLS (maximum compatibility)
  classic: ['※', '◎', '◈', '◐', '◑', '◒']
};

/**
 * Compatibility ratings for each theme
 * 'high' = works everywhere, 'medium' = most browsers, 'experimental' = newest browsers only
 */
export const themeCompatibility = {
  fruit: 'high',
  animals: 'high', 
  sports: 'high',
  food: 'high',
  school: 'medium',
  space: 'medium',
  shapes: 'high',        // Now using basic Unicode
  shapesBasic: 'high',
  colors: 'medium',      // Circle emojis are better supported
  nature: 'medium',
  classic: 'high'
};

/**
 * Get high-compatibility themes only
 * @returns {string[]} Array of theme names with high compatibility
 */
export const getHighCompatibilityThemes = () => {
  return Object.entries(themeCompatibility)
    .filter(([theme, rating]) => rating === 'high')
    .map(([theme]) => theme);
};

/**
 * Get all available theme names
 * @returns {string[]} Array of theme names
 */
export const getThemeNames = () => {
  return Object.keys(symbolThemes);
};

/**
 * Get symbols for a specific theme with fallback
 * @param {string} themeName - Name of the theme
 * @param {boolean} safeMode - If true, only return high-compatibility themes
 * @returns {string[]} Array of symbol strings for that theme
 */
export const getThemeSymbols = (themeName, safeMode = false) => {
  if (!symbolThemes[themeName]) {
    throw new Error(`Theme "${themeName}" not found. Available themes: ${getThemeNames().join(', ')}`);
  }
  
  // In safe mode, redirect problematic themes to safe alternatives
  if (safeMode) {
    const safeAlternatives = {
      'shapes': 'shapesBasic',  // Use outline shapes instead
      'colors': 'fruit',        // Use fruit instead of colored circles
      'space': 'animals',       // Use animals instead of space
      'school': 'sports'        // Use sports instead of school supplies
    };
    
    if (themeCompatibility[themeName] !== 'high' && safeAlternatives[themeName]) {
      console.warn(`Theme "${themeName}" may have compatibility issues. Using "${safeAlternatives[themeName]}" instead.`);
      return [...symbolThemes[safeAlternatives[themeName]]];
    }
  }
  
  return [...symbolThemes[themeName]]; // Return a copy to prevent mutation
};

/**
 * Get a random high-compatibility theme
 * @param {boolean} safeMode - If true, only return themes with high compatibility
 * @returns {string} Random theme name
 */
export const getRandomTheme = (safeMode = false) => {
  const themes = safeMode ? getHighCompatibilityThemes() : getThemeNames();
  return themes[Math.floor(Math.random() * themes.length)];
};

/**
 * Get a weekly theme based on week number with compatibility preference
 * @param {number} weekNumber - Week number (1-52)
 * @param {boolean} safeMode - Prefer high-compatibility themes
 * @returns {string} Theme name for that week
 */
export const getWeeklyTheme = (weekNumber = 1, safeMode = false) => {
  const themes = safeMode ? getHighCompatibilityThemes() : getThemeNames();
  const themeIndex = (weekNumber - 1) % themes.length;
  return themes[themeIndex];
};

/**
 * Get current theme based on today's date with compatibility check
 * @param {boolean} safeMode - Prefer high-compatibility themes
 * @returns {string} Current theme name
 */
export const getCurrentTheme = (safeMode = false) => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
  const weekNumber = Math.ceil(dayOfYear / 7);
  return getWeeklyTheme(weekNumber, safeMode);
};

/**
 * Browser compatibility detector
 * @returns {Object} Browser info and compatibility recommendations
 */
export const detectBrowserCompatibility = () => {
  const ua = navigator.userAgent;
  const isChrome = /Chrome/.test(ua);
  const isFirefox = /Firefox/.test(ua);
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
  const version = ua.match(/(Chrome|Firefox|Safari)\/(\d+)/);
  
  const browserVersion = version ? parseInt(version[2]) : 0;
  
  // Compatibility recommendations based on browser
  let emojiSupport = 'medium';
  let recommendSafeMode = false;
  
  if (isChrome && browserVersion >= 89) {
    emojiSupport = 'high';
  } else if (isChrome && browserVersion >= 80) {
    emojiSupport = 'medium';
  } else if (isFirefox && browserVersion >= 85) {
    emojiSupport = 'medium';
  } else if (isSafari && browserVersion >= 14) {
    emojiSupport = 'high';
  } else {
    emojiSupport = 'low';
    recommendSafeMode = true;
  }
  
  return {
    browser: isChrome ? 'Chrome' : isFirefox ? 'Firefox' : isSafari ? 'Safari' : 'Unknown',
    version: browserVersion,
    emojiSupport,
    recommendSafeMode,
    safeThemes: getHighCompatibilityThemes()
  };
};

/**
 * Select random symbols from a theme with compatibility check
 * @param {string} themeName - Name of the theme
 * @param {number} count - Number of symbols to select (default: 2)
 * @param {boolean} safeMode - Use compatibility mode
 * @returns {string[]} Array of selected symbols
 */
export const selectRandomSymbols = (themeName, count = 2, safeMode = false) => {
  const symbols = getThemeSymbols(themeName, safeMode);
  
  if (count > symbols.length) {
    throw new Error(`Cannot select ${count} symbols from theme "${themeName}" which only has ${symbols.length} symbols`);
  }
  
  // Shuffle array and take first 'count' elements
  const shuffled = symbols.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

/**
 * Validate if a string is a valid symbol from any theme
 * @param {string} symbol - Symbol to validate
 * @returns {boolean} True if symbol exists in any theme
 */
export const isValidSymbol = (symbol) => {
  const allSymbols = Object.values(symbolThemes).flat();
  return allSymbols.includes(symbol);
};

/**
 * Find which theme a symbol belongs to
 * @param {string} symbol - Symbol to find
 * @returns {string|null} Theme name if found, null otherwise
 */
export const findSymbolTheme = (symbol) => {
  for (const [themeName, symbols] of Object.entries(symbolThemes)) {
    if (symbols.includes(symbol)) {
      return themeName;
    }
  }
  return null;
};

/**
 * Get theme display name (capitalized and user-friendly)
 * @param {string} themeName - Internal theme name
 * @returns {string} Display-friendly theme name
 */
export const getThemeDisplayName = (themeName) => {
  const displayNames = {
    fruit: 'Fruits',
    animals: 'Animals',
    shapes: 'Shapes',
    shapesBasic: 'Basic Shapes',
    sports: 'Sports',
    school: 'School Supplies',
    space: 'Space & Planets',
    food: 'Food & Treats',
    colors: 'Colored Circles',
    nature: 'Nature',
    classic: 'Classic Symbols'
  };
  
  return displayNames[themeName] || themeName.charAt(0).toUpperCase() + themeName.slice(1);
};

/**
 * Get compatibility info for a theme
 * @param {string} themeName - Theme to check
 * @returns {Object} Compatibility information
 */
export const getThemeCompatibilityInfo = (themeName) => {
  return {
    rating: themeCompatibility[themeName] || 'unknown',
    symbols: symbolThemes[themeName] || [],
    displayName: getThemeDisplayName(themeName),
    isSafe: themeCompatibility[themeName] === 'high'
  };
};

// Export default object for convenience
export default {
  themes: symbolThemes,
  compatibility: themeCompatibility,
  getThemeNames,
  getThemeSymbols,
  getRandomTheme,
  getWeeklyTheme,
  getCurrentTheme,
  selectRandomSymbols,
  isValidSymbol,
  findSymbolTheme,
  getThemeDisplayName,
  getHighCompatibilityThemes,
  detectBrowserCompatibility,
  getThemeCompatibilityInfo
};