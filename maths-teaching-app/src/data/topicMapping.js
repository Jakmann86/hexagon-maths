export const topicToWeek = {
    'Trigonometry I': 1,
    'Algebra I': 2,
    'Algebra II': 3,
    'Geometry I': 4,        // ← MOVED FROM WEEK 6
    'Algebra III': 5,       // ← SHIFTED (was Week 4)
    'Algebra IV': 6,        // ← SHIFTED (was Week 5)
    // Add more topics as they're built
};

export const weekToTopic = {
    1: 'Trigonometry I',
    2: 'Algebra I',
    3: 'Algebra II',
    4: 'Geometry I',        // ← MOVED FROM WEEK 6
    5: 'Algebra III',       // ← SHIFTED (was Week 4)
    6: 'Algebra IV',        // ← SHIFTED (was Week 5)
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