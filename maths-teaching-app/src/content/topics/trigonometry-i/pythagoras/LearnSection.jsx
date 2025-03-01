// src/content/topics/trigonometry-i/pythagoras/LearnSection.jsx
import React from 'react';
import { Card, CardContent } from '../../../../components/common/Card';

const LearnSection = ({ currentTopic, currentLessonId }) => {
    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Learn Pythagoras' Theorem</h2>
                    <div className="space-y-4">
                        <p>
                            Pythagoras' Theorem states that in a right-angled triangle,
                            the square of the length of the hypotenuse (the side opposite the right angle)
                            is equal to the sum of squares of the other two sides.
                        </p>
                        <p>
                            Mathematically, this is expressed as: a² + b² = c²
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">Key Concepts</h3>
                            <ul className="list-disc pl-5">
                                <li>Right-angled triangles</li>
                                <li>Squaring sides</li>
                                <li>Finding missing side lengths</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LearnSection;