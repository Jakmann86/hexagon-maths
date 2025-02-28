import { MafsSquare, MafsRightTriangle } from '../../../components/shapes';
import _ from 'lodash';
import React from 'react';

console.log("MafsSquare import:", MafsSquare);
console.log("MafsRightTriangle import:", MafsRightTriangle);

export const pythagorasDiagnostics = {
   1: {
       title: "Square Area",
       generator: () => {
           const side = 5;
           return {
               questionDisplay: "What is the area of this square?",
               shape: {
                   component: MafsSquare,
                   props: {
                       sideLength: side,
                       showDimensions: true,
                       units: "cm"
                   }
               },
               correctAnswer: side * side,
               answerDisplay: `${side}^2 = ${side * side} cm²`,
               options: [
                   side * side,
                   side * 4,
                   side + side,
                   Math.floor(side * side * 1.5)
               ].sort(() => Math.random() - 0.5)
           };
       }
   },
   2: {
       title: "Square Root",
       generator: () => {
           const sideLength = _.random(4, 9);
           const area = sideLength * sideLength;
           
           return {
               questionDisplay: `If a square has an area of ${area} square cm, what is its side length?`,
               correctAnswer: sideLength,
               answerDisplay: `√${area} = ${sideLength} cm`,
               options: [
                   sideLength,
                   area / 4,
                   Math.floor(area / 3),
                   area / 2
               ].sort(() => Math.random() - 0.5),
               shape: {
                   component: MafsSquare,
                   props: {
                       sideLength: '?',
                       showArea: true,
                       areaLabel: area,
                       units: 'cm'
                   }
               }
           };
       }
   },
   3: {
       title: "Identify Hypotenuse",
       generator: () => {
           const pythagoreanTriples = [
               { a: 3, b: 4, c: 5 },
               { a: 5, b: 12, c: 13 },
               { a: 6, b: 8, c: 10 },
               { a: 8, b: 15, c: 17 }
           ];
           
           const triple = _.sample(pythagoreanTriples);
           const orientation = _.sample(['right', 'left', 'up', 'down']);

           return {
               questionDisplay: "Which side is the hypotenuse of this right-angled triangle?",
               correctAnswer: 'z',
               answerDisplay: "The side z is the hypotenuse (longest side) of the triangle",
               options: ['x', 'y', 'z', 'none'].sort(() => Math.random() - 0.5),
               shape: {
                   component: MafsRightTriangle,
                   props: {
                       base: triple.a,
                       height: triple.b,
                       orientation: orientation,
                       labelStyle: 'algebraic',
                       showRightAngle: true
                   }
               }
           };
       }
   },
   4: {
       title: "Find Missing Side",
       generator: () => {
           const base = _.random(3, 8);
           const height = _.random(3, 8);
           const hypotenuse = Number(Math.sqrt(base * base + height * height).toFixed(1));

           return {
               questionDisplay: "Find the length of the missing side of this right-angled triangle.",
               correctAnswer: hypotenuse,
               answerDisplay: `√(${base}² + ${height}²) = ${hypotenuse} cm`,
               options: [
                   hypotenuse,
                   base + height,
                   Number((hypotenuse * 0.8).toFixed(1)),
                   Number((hypotenuse * 1.2).toFixed(1))
               ].sort(() => Math.random() - 0.5),
               shape: {
                   component: MafsRightTriangle,
                   props: {
                       base: base,
                       height: height,
                       showLabels: true,
                       labelStyle: 'numeric',
                       showRightAngle: true,
                       units: 'cm'
                   }
               }
           };
       }
   }
};

export default pythagorasDiagnostics;