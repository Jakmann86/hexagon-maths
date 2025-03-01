// src/content/topics/trigonometry-i/pythagoras/ExamplesSection.jsx
import React from 'react';
import { Card, CardContent } from '../../../../components/common/Card';

const ExamplesSection = ({ currentTopic, currentLessonId }) => {
    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Worked Examples</h2>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">Example 1: Finding Hypotenuse</h3>
                            <p>A right-angled triangle has sides of length 3 and 4. Find the length of the hypotenuse.</p>
                            <div className="mt-2 bg-white p-3 rounded">
                                <p>Solution:</p>
                                <p>a² + b² = c²</p>
                                <p>3² + 4² = c²</p>
                                <p>9 + 16 = c²</p>
                                <p>25 = c²</p>
                                <p>c = √25 = 5</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ExamplesSection;