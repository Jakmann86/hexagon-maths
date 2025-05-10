export const topicToWeek = {
    'Trigonometry I': 1,
    'Algebra I': 2,
    'Algebra II': 3,
    'Algebra III': 4,
    'Algebra IV': 5,
    // Add more topics as needed
};

export const weekToTopic = {
    1: 'Trigonometry I',
    2: 'Algebra I',
    3: 'Algebra II',
    4: 'Algebra III',
    5: 'Algebra IV',
    // Add more weeks as needed
};

// Helper function to get week number from topic name
export const getWeekFromTopic = (topicName) => {
    return topicToWeek[topicName];
};

// Helper function to get topic name from week number
export const getTopicFromWeek = (weekNumber) => {
    return weekToTopic[weekNumber];
};