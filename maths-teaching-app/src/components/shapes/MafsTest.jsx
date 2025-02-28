import React from 'react';
import {
    Mafs,
    Coordinates,
    Line,
    Point,
    Circle,
    Transform,
    Theme,
    useMovablePoint,
    Vector,
    Text
} from "mafs";
import "mafs/core.css";
import { Card, CardContent } from '@/components/ui/card';

const MafsTest = () => {
    // Create a movable point for interactive testing
    const point = useMovablePoint([2, 1]);

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Right Triangle Test</h2>
                    <div className="h-96">
                        <Mafs>
                            <Coordinates.Cartesian />

                            {/* Create a right triangle */}
                            <Line.Segment point1={[0, 0]} point2={[3, 0]} color={Theme.blue} />
                            <Line.Segment point1={[3, 0]} point2={[3, 4]} color={Theme.blue} />
                            <Line.Segment point1={[3, 4]} point2={[0, 0]} color={Theme.blue} />

                            {/* Add right angle marker */}
                            <Transform translate={[0.3, 0.3]}>
                                <Line.Segment point1={[0, 0]} point2={[0, 0.5]} color={Theme.black} />
                                <Line.Segment point1={[0, 0.5]} point2={[0.5, 0.5]} color={Theme.black} />
                            </Transform>

                            {/* Add angle arc */}
                            <Circle
                                center={[0, 0]}
                                radius={0.5}
                                angleStart={0}
                                angleEnd={Math.atan2(4, 3)}
                                color={Theme.red}
                            />

                            {/* Add labels */}
                            <Text x={1.5} y={-0.3}>Adjacent</Text>
                            <Text x={3.3} y={2}>Opposite</Text>
                            <Text x={1} y={2}>Hypotenuse</Text>
                        </Mafs>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Interactive Point and Vector Test</h2>
                    <div className="h-96">
                        <Mafs>
                            <Coordinates.Cartesian />

                            {/* Add movable point */}
                            {point.element}

                            {/* Add vector from origin to point */}
                            <Vector tail={[0, 0]} tip={point.point} color={Theme.indigo} />

                            {/* Add perpendicular lines */}
                            <Line.Segment
                                point1={[0, 0]}
                                point2={[point.point[0], 0]}
                                color={Theme.green}
                            />
                            <Line.Segment
                                point1={[point.point[0], 0]}
                                point2={point.point}
                                color={Theme.green}
                            />
                        </Mafs>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Circle with Right Triangle Test</h2>
                    <div className="h-96">
                        <Mafs>
                            <Coordinates.Cartesian />

                            {/* Add circle */}
                            <Circle center={[0, 0]} radius={2} />

                            {/* Add right triangle inscribed in circle */}
                            <Line.Segment point1={[0, 0]} point2={[2, 0]} color={Theme.purple} />
                            <Line.Segment point1={[2, 0]} point2={[0, 2]} color={Theme.purple} />
                            <Line.Segment point1={[0, 2]} point2={[0, 0]} color={Theme.purple} />

                            {/* Add points */}
                            <Point x={0} y={0} />
                            <Point x={2} y={0} />
                            <Point x={0} y={2} />
                        </Mafs>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MafsTest;