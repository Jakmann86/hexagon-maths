// src/generators/statistics/averageGenerators.js
import _ from 'lodash';

/**
 * Generate diagnostic question for basic mean, median, mode, range
 * Returns a single dataset with all four statistics to calculate
 * RANDOMIZED: Generates different datasets each time
 */
export const generateMeanMedianModeRange = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'diagnostic'
    } = options;

    // Generate a random dataset with a clear mode
    const modeValue = _.random(10, 20);
    const otherValues = [
        _.random(8, 15),
        _.random(15, 22),
        _.random(12, 18),
        _.random(18, 25)
    ];
    
    // Create dataset with mode appearing 3 times
    const dataset = [modeValue, modeValue, modeValue, ...otherValues].sort((a, b) => a - b);
    
    // Calculate statistics (rounded to 2 decimal places)
    const sum = dataset.reduce((sum, val) => sum + val, 0);
    const mean = Math.round((sum / dataset.length) * 100) / 100;
    const median = Math.round(((dataset[3] + dataset[4]) / 2) * 100) / 100;
    const mode = modeValue;
    const range = dataset[dataset.length - 1] - dataset[0];
    
    if (sectionType === 'diagnostic') {
        return {
            questionDisplay: {
                text: 'Calculate the mean, median, mode and range:',
                data: dataset,
                layout: 'dataset'
            },
            parts: [
                { label: 'Mean', correctAnswer: `${mean}` },
                { label: 'Median', correctAnswer: `${median}` },
                { label: 'Mode', correctAnswer: `${mode}` },
                { label: 'Range', correctAnswer: `${range}` }
            ],
            explanation: `Mean: (${dataset.join(' + ')}) ÷ ${dataset.length} = ${mean}
                         Median: Middle values are ${dataset[3]} and ${dataset[4]}, average = ${median}
                         Mode: ${mode} appears 3 times (most frequent)
                         Range: ${dataset[dataset.length - 1]} - ${dataset[0]} = ${range}`
        };
    }

    // Fallback
    return generateMeanMedianModeRange({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate question to find missing number when mean is given
 * Section-aware output for diagnostic and examples
 * RANDOMIZED: Generates different problems each time
 */
export const generateFindMissingNumber = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'diagnostic'
    } = options;

    let numbers, mean, total, knownSum, missing;

    if (difficulty === 'easy') {
        // 4 numbers, mean is a whole number
        total = 4;
        mean = _.random(8, 15);
        numbers = [
            _.random(5, mean),
            _.random(mean - 3, mean + 3),
            _.random(mean, mean + 5)
        ];
        knownSum = numbers.reduce((sum, val) => sum + val, 0);
        missing = (mean * total) - knownSum;
    } else if (difficulty === 'medium') {
        // 5 numbers, clean solution
        total = 5;
        mean = _.random(20, 30);
        numbers = [
            _.random(15, 25),
            _.random(18, 28),
            _.random(22, 32),
            _.random(25, 35)
        ];
        knownSum = numbers.reduce((sum, val) => sum + val, 0);
        missing = (mean * total) - knownSum;
    } else {
        // Hard: 6 numbers, may have decimal mean
        total = 6;
        // Generate mean with 0 or 0.5 decimal
        mean = Math.round(_.random(40, 55) * 2) / 2; // 40, 40.5, 41, 41.5, etc.
        numbers = [
            _.random(35, 50),
            _.random(40, 55),
            _.random(38, 52),
            _.random(30, 45),
            _.random(45, 60)
        ];
        knownSum = numbers.reduce((sum, val) => sum + val, 0);
        missing = Math.round(((mean * total) - knownSum) * 100) / 100;
    }

    const questionText = difficulty === 'easy' ? 
        `The mean of four numbers is ${mean}. Three of the numbers are ${numbers.join(', ')}. What is the fourth number?` :
        difficulty === 'medium' ?
        `Five numbers have a mean of ${mean}. Four of them are ${numbers.join(', ')}. Find the fifth number.` :
        `The mean of six numbers is ${mean}. Five of them are ${numbers.join(', ')}. Calculate the sixth number.`;

    if (sectionType === 'diagnostic') {
        // Generate strategic distractors
        const incorrectOptions = [
            `${missing + 2}`,      // Arithmetic error
            `${missing - 1}`,      // Off by one
            `${mean}`              // Used mean instead of solving
        ].filter(opt => opt !== `${missing}`);

        return {
            questionDisplay: {
                text: questionText,
                numbers: numbers,
                mean: mean,
                layout: 'missing_number'
            },
            correctAnswer: `${missing}`,
            options: [`${missing}`, ...incorrectOptions].sort(() => Math.random() - 0.5),
            explanation: `Total sum needed = ${mean} × ${total} = ${mean * total}. 
                         Known sum = ${knownSum}. 
                         Missing number = ${mean * total} - ${knownSum} = ${missing}`
        };
    }
    
    else if (sectionType === 'examples') {
        return {
            title: "Finding Missing Numbers",
            questionText: questionText,
            solution: [
                {
                    explanation: "Calculate the total sum needed",
                    formula: `\\text{Total sum} = \\text{Mean} \\times \\text{Count} = ${mean} \\times ${total} = ${mean * total}`
                },
                {
                    explanation: "Calculate sum of known numbers",
                    formula: `${numbers.join(' + ')} = ${knownSum}`
                },
                {
                    explanation: "Subtract to find missing number",
                    formula: `${mean * total} - ${knownSum} = ${missing}`
                }
            ]
        };
    }

    return generateFindMissingNumber({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate combined mean problems
 * Combines means from two or more groups
 * RANDOMIZED: Generates different problems each time
 */
export const generateCombinedMean = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'diagnostic'
    } = options;

    let groups, totalCount, totalSum, combinedMean, questionText;

    if (difficulty === 'easy') {
        // Two groups with simple numbers
        const count1 = _.random(8, 15);
        const count2 = _.random(10, 20);
        const mean1 = _.random(6, 12);
        const mean2 = _.random(10, 18);
        
        groups = [
            { count: count1, mean: mean1, name: 'Group A' },
            { count: count2, mean: mean2, name: 'Group B' }
        ];
        totalCount = count1 + count2;
        totalSum = (count1 * mean1) + (count2 * mean2);
        combinedMean = Math.round((totalSum / totalCount) * 100) / 100;
        questionText = `Group A has ${count1} students with a mean test score of ${mean1}. Group B has ${count2} students with a mean test score of ${mean2}. What is the mean score when both groups are combined?`;
    } else if (difficulty === 'medium') {
        // Two groups with larger numbers
        const count1 = _.random(20, 30);
        const count2 = _.random(15, 25);
        const mean1 = _.random(60, 75);
        const mean2 = _.random(65, 80);
        
        groups = [
            { count: count1, mean: mean1, name: 'Class 10A' },
            { count: count2, mean: mean2, name: 'Class 10B' }
        ];
        totalCount = count1 + count2;
        totalSum = (count1 * mean1) + (count2 * mean2);
        combinedMean = Math.round((totalSum / totalCount) * 100) / 100;
        questionText = `Class 10A has ${count1} students with a mean height of ${mean1} cm. Class 10B has ${count2} students with a mean height of ${mean2} cm. Find the mean height of all students.`;
    } else {
        // Hard: Three groups
        const count1 = _.random(10, 16);
        const count2 = _.random(12, 18);
        const count3 = _.random(14, 20);
        const mean1 = _.random(70, 85);
        const mean2 = _.random(75, 88);
        const mean3 = _.random(68, 82);
        
        groups = [
            { count: count1, mean: mean1, name: 'Class A' },
            { count: count2, mean: mean2, name: 'Class B' },
            { count: count3, mean: mean3, name: 'Class C' }
        ];
        totalCount = count1 + count2 + count3;
        totalSum = (count1 * mean1) + (count2 * mean2) + (count3 * mean3);
        combinedMean = Math.round((totalSum / totalCount) * 100) / 100;
        questionText = `Three classes took a test. Class A (${count1} students) had a mean of ${mean1}%, Class B (${count2} students) had a mean of ${mean2}%, and Class C (${count3} students) had a mean of ${mean3}%. Calculate the overall mean score.`;
    }

    if (sectionType === 'diagnostic') {
        const incorrectOptions = [
            `${Number((groups[0].mean + groups[1].mean) / 2).toFixed(2)}`, // Simple average of means
            `${Number(combinedMean + 2).toFixed(2)}`,      // Arithmetic error
            `${Number(combinedMean - 1.5).toFixed(2)}`     // Different error
        ].filter(opt => opt !== `${combinedMean}`);

        return {
            questionDisplay: {
                text: questionText,
                groups: groups,
                layout: 'combined_mean'
            },
            correctAnswer: `${combinedMean}`,
            options: [`${combinedMean}`, ...incorrectOptions].sort(() => Math.random() - 0.5),
            explanation: `Total = ${groups.map(g => `(${g.count} × ${g.mean})`).join(' + ')} = ${totalSum}. 
                         Combined mean = ${totalSum} ÷ ${totalCount} = ${combinedMean}`
        };
    }
    
    else if (sectionType === 'examples') {
        const solutionSteps = groups.map((g, idx) => ({
            explanation: `Calculate total for ${g.name}`,
            formula: `${g.count} \\times ${g.mean} = ${g.count * g.mean}`
        }));

        solutionSteps.push({
            explanation: "Add all totals together",
            formula: groups.map(g => `${g.count * g.mean}`).join(' + ') + ` = ${totalSum}`
        });

        solutionSteps.push({
            explanation: "Calculate total count",
            formula: groups.map(g => `${g.count}`).join(' + ') + ` = ${totalCount}`
        });

        solutionSteps.push({
            explanation: "Divide total sum by total count",
            formula: `\\frac{${totalSum}}{${totalCount}} = ${combinedMean}`
        });

        return {
            title: "Combined Mean",
            questionText: questionText,
            solution: solutionSteps
        };
    }

    return generateCombinedMean({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate problem-solving questions with mean
 * Real-world contexts like teacher weight problems
 * RANDOMIZED: Generates different problems each time
 */
export const generateProblemSolvingMean = (options = {}) => {
    const {
        difficulty = 'medium',
        sectionType = 'diagnostic'
    } = options;

    let studentCount, studentMean, increase, totalWithTeacher, newMean, teacherWeight, questionText;

    if (difficulty === 'easy') {
        studentCount = _.random(15, 25);
        studentMean = _.random(50, 65);
        increase = _.random(1, 3);
        totalWithTeacher = studentCount + 1;
        newMean = studentMean + increase;
        teacherWeight = Math.round(((newMean * totalWithTeacher) - (studentMean * studentCount)) * 100) / 100;
        questionText = `The mean weight of ${studentCount} students is ${studentMean} kg. When the teacher joins them, the mean weight increases by ${increase} kg. What is the teacher's weight?`;
    } else if (difficulty === 'medium') {
        studentCount = _.random(30, 40);
        studentMean = _.random(40, 55);
        // 500g = 0.5kg, or random between 200g-800g
        const increaseInGrams = _.random(2, 8) * 100; // 200, 300, 400, ... 800
        increase = increaseInGrams / 1000;
        totalWithTeacher = studentCount + 1;
        newMean = Math.round((studentMean + increase) * 100) / 100;
        teacherWeight = Math.round(((newMean * totalWithTeacher) - (studentMean * studentCount)) * 100) / 100;
        questionText = `The mean weight of a class of ${studentCount} students is ${studentMean} kg. When the teacher is added, the mean weight increases by ${increaseInGrams} g. What is the weight of the teacher?`;
    } else {
        // Hard: Mean decreases
        studentCount = _.random(6, 10);
        studentMean = _.random(25, 32);
        const decrease = Math.round(_.random(15, 30) * 2) / 10; // 1.5 to 3.0 in 0.1 steps
        newMean = Math.round((studentMean - decrease) * 100) / 100;
        totalWithTeacher = studentCount + 1;
        teacherWeight = Math.round(((newMean * totalWithTeacher) - (studentMean * studentCount)) * 100) / 100;
        increase = decrease;
        questionText = `The mean age of ${studentCount} players in a football team is ${studentMean} years. When a new player joins, the mean age decreases to ${newMean} years. How old is the new player?`;
    }

    if (sectionType === 'diagnostic') {
        const incorrectOptions = [
            `${teacherWeight + studentCount}`,  // Added instead of using mean formula
            `${Math.abs(teacherWeight - 10)}`,  // Arithmetic error
            `${Math.floor(teacherWeight / 2)}`  // Wrong calculation
        ].filter(opt => opt !== `${teacherWeight}`);

        return {
            questionDisplay: {
                text: questionText,
                context: {
                    studentCount,
                    studentMean,
                    increase: difficulty === 'medium' ? '500 g (0.5 kg)' : `${increase} kg`
                },
                layout: 'problem_solving'
            },
            correctAnswer: `${teacherWeight}`,
            options: [`${teacherWeight}`, ...incorrectOptions].sort(() => Math.random() - 0.5),
            explanation: `Students' total = ${studentCount} × ${studentMean} = ${studentCount * studentMean}. 
                         New total = ${totalWithTeacher} × ${newMean} = ${totalWithTeacher * newMean}. 
                         Teacher's weight = ${totalWithTeacher * newMean} - ${studentCount * studentMean} = ${teacherWeight} kg`
        };
    }
    
    else if (sectionType === 'examples') {
        const solutionSteps = [];

        if (difficulty === 'medium') {
            solutionSteps.push({
                explanation: "Convert to same units",
                formula: `500 \\text{ g} = 0.5 \\text{ kg}`
            });
        }

        solutionSteps.push({
            explanation: `Calculate students' total weight`,
            formula: `${studentCount} \\times ${studentMean} = ${studentCount * studentMean} \\text{ kg}`
        });

        solutionSteps.push({
            explanation: "Calculate new mean",
            formula: difficulty === 'hard' ? 
                `\\text{New mean} = ${newMean} \\text{ years}` :
                `${studentMean} + ${increase} = ${newMean} \\text{ kg}`
        });

        solutionSteps.push({
            explanation: `Calculate total weight with ${difficulty === 'hard' ? 'new player' : 'teacher'}`,
            formula: `${totalWithTeacher} \\times ${newMean} = ${totalWithTeacher * newMean}`
        });

        solutionSteps.push({
            explanation: `Find ${difficulty === 'hard' ? "new player's age" : "teacher's weight"}`,
            formula: `${totalWithTeacher * newMean} - ${studentCount * studentMean} = ${teacherWeight}${difficulty === 'hard' ? ' \\text{ years}' : ' \\text{ kg}'}`
        });

        return {
            title: "Problem Solving with Mean",
            questionText: questionText,
            solution: solutionSteps
        };
    }

    return generateProblemSolvingMean({ ...options, sectionType: 'diagnostic' });
};

/**
 * Generate reverse mean challenge
 * Given numbers and target mean, find which to remove
 * RANDOMIZED: Generates different problems each time
 */
export const generateReverseMean = (options = {}) => {
    const {
        sectionType = 'challenge'
    } = options;

    // Generate 5 random numbers
    const base = _.random(10, 20);
    const numbers = [
        base,
        base + _.random(2, 5),
        base + _.random(5, 8),
        base + _.random(8, 12),
        base + _.random(12, 15)
    ];
    
    const currentSum = numbers.reduce((sum, val) => sum + val, 0);
    
    // Choose target mean that gives integer result
    const targetMean = _.random(base + 3, base + 10);
    const targetSum = 3 * targetMean;
    const removeSum = currentSum - targetSum;
    
    // Find which two numbers sum to removeSum
    let answer = [];
    for (let i = 0; i < numbers.length; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
            if (numbers[i] + numbers[j] === removeSum) {
                answer = [numbers[i], numbers[j]];
                break;
            }
        }
        if (answer.length > 0) break;
    }
    
    // If no exact match found, adjust targetMean
    if (answer.length === 0) {
        answer = [numbers[0], numbers[1]];
        const actualRemoveSum = answer[0] + answer[1];
        const actualTargetSum = currentSum - actualRemoveSum;
        const actualTargetMean = Math.round((actualTargetSum / 3) * 100) / 100;
        
        return {
            questionDisplay: {
                text: `Five numbers are: ${numbers.join(', ')}. If you remove exactly two numbers, the mean of the remaining three numbers is ${actualTargetMean}. Which two numbers were removed?`,
                numbers: numbers,
                targetMean: actualTargetMean,
                layout: 'challenge'
            },
            hint: `Work backwards: if 3 numbers have a mean of ${actualTargetMean}, what must their sum be?`,
            answer: answer,
            solution: [
                {
                    explanation: "Calculate required sum for target mean",
                    formula: `3 \\times ${actualTargetMean} = ${actualTargetSum}`
                },
                {
                    explanation: "Calculate current sum",
                    formula: `${numbers.join(' + ')} = ${currentSum}`
                },
                {
                    explanation: "Calculate sum to remove",
                    formula: `${currentSum} - ${actualTargetSum} = ${actualRemoveSum}`
                },
                {
                    explanation: "Identify the pair",
                    formula: `${answer[0]} + ${answer[1]} = ${actualRemoveSum} \\checkmark`
                },
                {
                    explanation: "Verify",
                    formula: `\\text{Mean of remaining} = ${actualTargetMean} \\checkmark`
                }
            ]
        };
    }
    
    // Numbers match perfectly
    const remainingNumbers = numbers.filter((n, i) => ![answer[0], answer[1]].includes(n));
    
    return {
        questionDisplay: {
            text: `Five numbers are: ${numbers.join(', ')}. If you remove exactly two numbers, the mean of the remaining three numbers is ${targetMean}. Which two numbers were removed?`,
            numbers: numbers,
            targetMean: targetMean,
            layout: 'challenge'
        },
        hint: `Work backwards: if 3 numbers have a mean of ${targetMean}, what must their sum be?`,
        answer: answer,
        solution: [
            {
                explanation: "Calculate required sum for target mean",
                formula: `3 \\times ${targetMean} = ${targetSum}`
            },
            {
                explanation: "Calculate current sum",
                formula: `${numbers.join(' + ')} = ${currentSum}`
            },
            {
                explanation: "Calculate sum to remove",
                formula: `${currentSum} - ${targetSum} = ${removeSum}`
            },
            {
                explanation: "Identify the pair",
                formula: `${answer[0]} + ${answer[1]} = ${removeSum} \\checkmark`
            },
            {
                explanation: "Verify",
                formula: `\\text{Remaining: } ${remainingNumbers.join(', ')} \\rightarrow \\text{Mean} = \\frac{${targetSum}}{3} = ${targetMean} \\checkmark`
            }
        ]
    };
};

/**
 * Generate moving average challenge
 * Update mean as new data arrives
 * RANDOMIZED: Generates different problems each time
 */
export const generateMovingAverage = (options = {}) => {
    const {
        sectionType = 'challenge'
    } = options;

    const initialDays = _.random(5, 7);
    const initialMean = _.random(35, 55);
    const sundayValue = _.random(initialMean - 5, initialMean + 15);
    const totalDays = initialDays + 1;
    const totalCustomers = (initialDays * initialMean) + sundayValue;
    const answer = Math.round((totalCustomers / totalDays) * 100) / 100;

    return {
        questionDisplay: {
            text: `A shop tracks the mean number of customers per day. In the first ${initialDays} days of the week, the mean was ${initialMean} customers per day. On the final day, ${sundayValue} customers visited. What is the mean for the whole period?`,
            layout: 'challenge'
        },
        answer: answer,
        solution: [
            {
                explanation: `Calculate total for first ${initialDays} days`,
                formula: `${initialDays} \\times ${initialMean} = ${initialDays * initialMean} \\text{ customers}`
            },
            {
                explanation: "Add final day's customers",
                formula: `${initialDays * initialMean} + ${sundayValue} = ${totalCustomers}`
            },
            {
                explanation: "Calculate mean for whole period",
                formula: `\\frac{${totalCustomers}}{${totalDays}} = ${answer} \\text{ customers per day}`
            }
        ]
    };
};

/**
 * Generate outlier impact challenge
 * Show effect of outliers on mean
 * RANDOMIZED: Generates different problems each time
 */
export const generateOutlierImpact = (options = {}) => {
    const {
        sectionType = 'challenge'
    } = options;

    // Generate a dataset with an obvious outlier
    const base = _.random(10, 15);
    const normalValues = [
        base,
        base + _.random(1, 3),
        base + _.random(1, 4),
        base + _.random(2, 5),
        base + _.random(2, 6),
        base + _.random(3, 7),
        base + _.random(4, 8)
    ];
    
    // Add a clear outlier (much larger)
    const outlier = base + _.random(30, 45);
    const dataset = [...normalValues, outlier].sort((a, b) => a - b);
    
    // Calculate means
    const sumWithOutlier = dataset.reduce((sum, val) => sum + val, 0);
    const withOutlier = Math.round((sumWithOutlier / dataset.length) * 100) / 100;
    
    const sumWithoutOutlier = normalValues.reduce((sum, val) => sum + val, 0);
    const withoutOutlier = Math.round((sumWithoutOutlier / normalValues.length) * 100) / 100;
    
    const difference = Math.round((withOutlier - withoutOutlier) * 100) / 100;

    return {
        questionDisplay: {
            text: `A dataset contains the values: ${dataset.join(', ')}. The value ${outlier} is an outlier. Calculate: a) The mean with the outlier, b) The mean without the outlier, c) The difference between them.`,
            dataset: dataset,
            outlier: outlier,
            layout: 'challenge'
        },
        answers: {
            withOutlier: withOutlier,
            withoutOutlier: withoutOutlier,
            difference: difference
        },
        solution: [
            {
                explanation: "Calculate mean with outlier",
                formula: `\\frac{${dataset.join(' + ')}}{${dataset.length}} = \\frac{${sumWithOutlier}}{${dataset.length}} = ${withOutlier}`
            },
            {
                explanation: "Calculate mean without outlier",
                formula: `\\frac{${normalValues.join(' + ')}}{${normalValues.length}} = \\frac{${sumWithoutOutlier}}{${normalValues.length}} = ${withoutOutlier}`
            },
            {
                explanation: "Calculate difference",
                formula: `${withOutlier} - ${withoutOutlier} = ${difference}`
            },
            {
                explanation: "Conclusion",
                formula: `\\text{The outlier increased the mean by ${difference} units}`
            }
        ]
    };
};

// Export grouped generators
export const averageGenerators = {
    generateMeanMedianModeRange,
    generateFindMissingNumber,
    generateCombinedMean,
    generateProblemSolvingMean,
    generateReverseMean,
    generateMovingAverage,
    generateOutlierImpact
};

export default averageGenerators;