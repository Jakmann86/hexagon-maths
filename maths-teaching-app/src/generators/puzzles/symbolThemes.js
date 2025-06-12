// src/generators/puzzles/symbolThemes.js

/**
 * Symbol themes for visual algebra puzzles
 * Each theme contains 6 unique symbols to provide variety within puzzles
 * Symbols are carefully chosen to be visually distinct and engaging
 */
export const symbolThemes = {
  fruit: ['🍎', '🍌', '🍊', '🍇', '🥝', '🍓'],
  animals: ['🐱', '🐶', '🐼', '🦊', '🐸', '🐺'],
  shapes: ['🟦', '🟨', '🟩', '🟪', '🟫', '⬜'],
  sports: ['⚽', '🏀', '🎾', '🏈', '🏐', '🏓'],
  school: ['📚', '✏️', '📐', '📏', '🖊️', '📝'],
  space: ['🌟', '🌙', '🪐', '☀️', '🌍', '🚀'],
  food: ['🍕', '🍔', '🌮', '🍰', '🍪', '🧁']
};

/**
 * Get all available theme names
 * @returns {string[]} Array of theme names
 */
export const getThemeNames = () => {
  return Object.keys(symbolThemes);
};

/**
 * Get symbols for a specific theme
 * @param {string} themeName - Name of the theme
 * @returns {string[]} Array of symbol strings for that theme
 */
export const getThemeSymbols = (themeName) => {
  if (!symbolThemes[themeName]) {
    throw new Error(`Theme "${themeName}" not found. Available themes: ${getThemeNames().join(', ')}`);
  }
  return [...symbolThemes[themeName]]; // Return a copy to prevent mutation
};

/**
 * Get a random theme name
 * @returns {string} Random theme name
 */
export const getRandomTheme = () => {
  const themes = getThemeNames();
  return themes[Math.floor(Math.random() * themes.length)];
};

/**
 * Get a weekly theme based on week number (for consistent theming)
 * Cycles through themes in order to provide variety throughout the year
 * @param {number} weekNumber - Week number (1-52)
 * @returns {string} Theme name for that week
 */
export const getWeeklyTheme = (weekNumber = 1) => {
  const themes = getThemeNames();
  const themeIndex = (weekNumber - 1) % themes.length;
  return themes[themeIndex];
};

/**
 * Get current theme based on today's date
 * Automatically calculates week number from current date
 * @returns {string} Current theme name
 */
export const getCurrentTheme = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
  const weekNumber = Math.ceil(dayOfYear / 7);
  return getWeeklyTheme(weekNumber);
};

/**
 * Select random symbols from a theme
 * @param {string} themeName - Name of the theme
 * @param {number} count - Number of symbols to select (default: 2)
 * @returns {string[]} Array of selected symbols
 */
export const selectRandomSymbols = (themeName, count = 2) => {
  const symbols = getThemeSymbols(themeName);
  
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
    sports: 'Sports',
    school: 'School Supplies',
    space: 'Space & Planets',
    food: 'Food & Treats'
  };
  
  return displayNames[themeName] || themeName.charAt(0).toUpperCase() + themeName.slice(1);
};

// Export default object for convenience
export default {
  themes: symbolThemes,
  getThemeNames,
  getThemeSymbols,
  getRandomTheme,
  getWeeklyTheme,
  getCurrentTheme,
  selectRandomSymbols,
  isValidSymbol,
  findSymbolTheme,
  getThemeDisplayName
};