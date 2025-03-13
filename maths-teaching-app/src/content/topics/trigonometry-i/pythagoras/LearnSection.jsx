import React from 'react';
import LearnSectionBase from '../../../../components/sections/LearnSectionBase';
import PythagorasVisualization from '../../../../components/math/visualizations/PythagorasVisualization';
import MathDisplay from '../../../../components/common/MathDisplay';

const LearnSection = () => {
  return (
    <LearnSectionBase
      title="Understanding Pythagoras' Theorem"
      lessonTitle="Pythagoras' Theorem"
      introduction={
        <div className="space-y-4">
          <p>
            Pythagoras' theorem is a fundamental relationship in Euclidean geometry that relates the 
            three sides of a right-angled triangle. It states that:
          </p>
          <div className="py-2">
            <MathDisplay
              expression={"a^2 + b^2 = c^2"}
              displayMode={true}
            />
          </div>
          <p>
            Where <em>a</em> and <em>b</em> are the lengths of the two sides that form the right angle
            (known as the legs or catheti), and <em>c</em> is the length of the hypotenuse (the 
            side opposite the right angle).
          </p>
        </div>
      }
      concept={
        <div className="space-y-4">
          <p>
            Pythagoras' theorem can be understood visually by comparing the areas of squares built
            on each side of a right-angled triangle. The theorem tells us that the sum of the areas
            of the squares on the legs equals the area of the square on the hypotenuse.
          </p>
          <p>
            This visual approach helps us understand why the formula works. Use the toggle buttons in the 
            visualization below to show or hide different elements.
          </p>
        </div>
      }
      visualization={
        <PythagorasVisualization 
          base={3} 
          height={4}
        />
      }
      hints={[
        "What happens to the areas of the squares when we change the shape of the triangle? Try to visualize how the theorem holds for any right triangle.",
        "How could you verify that the area of the square on the hypotenuse equals the sum of the areas of the other two squares?",
        "For the 3-4-5 triangle shown in the visualization, can you calculate each square's area and confirm that a² + b² = c²?",
        "Can you think of other real-world applications where Pythagoras' theorem might be useful?",
        "How would you use the theorem to find the length of one side if you know the other two sides?"
      ]}
      conclusion={
        <div className="space-y-4">
          <p>
            Pythagoras' theorem is not just a mathematical curiosity—it's a powerful tool with countless practical applications:
          </p>
          <ul className="list-disc pl-6">
            <li>Finding distances between points in coordinate geometry</li>
            <li>Construction and engineering for ensuring right angles</li>
            <li>Navigation and mapping</li>
            <li>Physics and many branches of science</li>
          </ul>
          <p>
            The theorem is often written as:
          </p>
          <div className="py-2">
            <MathDisplay
              expression={"c = \\sqrt{a^2 + b^2}"}
              displayMode={true}
            />
          </div>
          <p>
            This form is especially useful when we know the lengths of the two legs and need to find the hypotenuse.
          </p>
        </div>
      }
    />
  );
};

export default LearnSection;