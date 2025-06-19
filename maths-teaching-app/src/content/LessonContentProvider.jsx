// src/content/LessonContentProvider.jsx - Dynamic Component Loader with Graceful Fallbacks
import React, { useState, useEffect } from 'react';
import { curriculum } from '../data/curriculum';
import PlaceholderSection from '../components/sections/PlaceholderSection';

/**
 * LoadingSpinner component for better UX during component loading
 */
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Loading lesson content...</span>
  </div>
);

/**
 * ErrorSection component for handling load failures gracefully
 */
const ErrorSection = ({ sectionName, error, onRetry }) => (
  <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
    <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load {sectionName}</h3>
    <p className="text-red-600 mb-4">
      {error?.message || 'An unexpected error occurred while loading this section.'}
    </p>
    <button 
      onClick={onRetry}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

/**
 * Dynamic LessonContentProvider - Loads lesson components on demand
 * 
 * This replaces the massive switch statement approach with dynamic imports
 * based on the curriculum.js configuration. Components are loaded only when
 * needed, improving performance and maintainability.
 * 
 * Gracefully falls back to PlaceholderSection for missing components instead
 * of showing harsh error states.
 */
const LessonContentProvider = ({ currentTopic, currentLessonId, currentSection }) => {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Convert topic name to filesystem-safe key
   * "Trigonometry I" -> "trigonometry-i"
   */
  const getTopicKey = (topicName) => {
    return topicName.toLowerCase().replace(/\s+/g, '-');
  };

  /**
   * Build the dynamic import path from curriculum data
   */
  const buildImportPath = (topicKey, sectionPath) => {
    return `./topics/${topicKey}/${sectionPath}`;
  };

  /**
   * Load the appropriate component based on current navigation state
   */
  const loadComponent = async () => {
    setLoading(true);

    try {
      // Get topic data from curriculum
      const topicData = curriculum[currentTopic];
      if (!topicData) {
        // Topic not in curriculum - use placeholder
        setComponent(null);
        setLoading(false);
        return;
      }

      // Get lesson data
      const lessonData = topicData.lessons.find(lesson => lesson.id === currentLessonId);
      if (!lessonData) {
        // Lesson not defined - use placeholder
        setComponent(null);
        setLoading(false);
        return;
      }

      // Get section path
      const sectionPath = lessonData.sections[currentSection];
      if (!sectionPath) {
        // Section not defined - use placeholder
        setComponent(null);
        setLoading(false);
        return;
      }

      // Build import path and load component
      const topicKey = getTopicKey(currentTopic);
      const importPath = buildImportPath(topicKey, sectionPath);
      
      console.log(`Loading component: ${importPath}`);
      
      const module = await import(importPath);
      
      // Handle both default exports and named exports
      const ComponentToRender = module.default || module[Object.keys(module)[0]];
      
      if (!ComponentToRender) {
        // Component file exists but no valid export - use placeholder
        console.warn(`No valid component found in ${importPath}`);
        setComponent(null);
        setLoading(false);
        return;
      }

      setComponent(() => ComponentToRender);
      setLoading(false);
      
    } catch (err) {
      // Import failed (file doesn't exist, syntax error, etc.) - use placeholder
      console.warn(`Failed to load component: ${err.message}`);
      setComponent(null);
      setLoading(false);
    }
  };

  /**
   * Load component whenever navigation changes
   */
  useEffect(() => {
    loadComponent();
  }, [currentTopic, currentLessonId, currentSection]);

  // Render loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Render component if loaded successfully
  if (Component) {
    return (
      <Component 
        currentTopic={currentTopic} 
        currentLessonId={currentLessonId}
        currentSection={currentSection}
      />
    );
  }

  // Fallback to your nice placeholder for any missing content
  const lessonData = curriculum[currentTopic]?.lessons.find(lesson => lesson.id === currentLessonId);
  const sectionName = currentSection.charAt(0).toUpperCase() + currentSection.slice(1);
  
  return (
    <PlaceholderSection 
      sectionName={sectionName}
      title={lessonData?.title || `Lesson ${currentLessonId}`}
      message="This section is planned for future development."
    />
  );
};

export default LessonContentProvider;