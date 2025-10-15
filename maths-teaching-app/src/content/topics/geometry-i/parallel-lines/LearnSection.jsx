const concept = (
  <div className="space-y-6">
    {/* Rule 1: Corresponding Angles */}
    <div className="border-l-4 border-green-500 pl-4">
      <h4 className="font-bold text-lg mb-2">Rule 1: Corresponding Angles (F-shape)</h4>
      <p className="mb-2">
        When a transversal crosses parallel lines, corresponding angles are equal
      </p>
      <ContentRenderer 
        content="a = b \\text{ (corresponding angles)}"
        sectionType="learn"
        size="normal"
      />
      <p className="mt-2 text-sm text-gray-600">
        Look for the F-shape pattern - angles in the same position are equal
      </p>
    </div>

    {/* Rule 2: Alternate Angles */}
    <div className="border-l-4 border-green-500 pl-4">
      <h4 className="font-bold text-lg mb-2">Rule 2: Alternate Angles (Z-shape)</h4>
      <p className="mb-2">
        Alternate angles are equal when formed by parallel lines and a transversal
      </p>
      <ContentRenderer 
        content="a = b \\text{ (alternate angles)}"
        sectionType="learn"
        size="normal"
      />
      <p className="mt-2 text-sm text-gray-600">
        Look for the Z-shape pattern - angles on opposite sides are equal
      </p>
    </div>

    {/* Rule 3: Co-interior Angles */}
    <div className="border-l-4 border-green-500 pl-4">
      <h4 className="font-bold text-lg mb-2">Rule 3: Co-interior Angles (C-shape)</h4>
      <p className="mb-2">
        Co-interior angles add up to 180°
      </p>
      <ContentRenderer 
        content="a + b = 180° \\text{ (co-interior angles)}"
        sectionType="learn"
        size="normal"
      />
      <p className="mt-2 text-sm text-gray-600">
        Look for the C-shape pattern - angles between parallels sum to 180°
      </p>
    </div>
  </div>
);