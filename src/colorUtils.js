const extendedColorDatabase = [
  // Reds
  { name: "Red", r: 255, g: 0, b: 0 },
  { name: "Crimson", r: 220, g: 20, b: 60 },
  { name: "Dark Red", r: 139, g: 0, b: 0 },
  { name: "Firebrick", r: 178, g: 34, b: 34 },
  { name: "Indian Red", r: 205, g: 92, b: 92 },
  { name: "Salmon", r: 250, g: 128, b: 114 },
  { name: "Tomato", r: 255, g: 99, b: 71 },

  // Pinks
  { name: "Pink", r: 255, g: 192, b: 203 },
  { name: "Hot Pink", r: 255, g: 105, b: 180 },
  { name: "Deep Pink", r: 255, g: 20, b: 147 },
  { name: "Light Pink", r: 255, g: 182, b: 193 },

  // Oranges
  { name: "Orange", r: 255, g: 165, b: 0 },
  { name: "Coral", r: 255, g: 127, b: 80 },
  { name: "Dark Orange", r: 255, g: 140, b: 0 },

  // Yellows
  { name: "Yellow", r: 255, g: 255, b: 0 },
  { name: "Gold", r: 255, g: 215, b: 0 },
  { name: "Light Yellow", r: 255, g: 255, b: 224 },
  { name: "Khaki", r: 240, g: 230, b: 140 },

  // Greens
  { name: "Green", r: 0, g: 128, b: 0 },
  { name: "Lime", r: 0, g: 255, b: 0 },
  { name: "Forest Green", r: 34, g: 139, b: 34 },
  { name: "Olive", r: 128, g: 128, b: 0 },
  { name: "Olive Drab", r: 107, g: 142, b: 35 },
  { name: "Sea Green", r: 46, g: 139, b: 87 },
  { name: "Medium Spring Green", r: 0, g: 250, b: 154 },
  { name: "Spring Green", r: 0, g: 255, b: 127 },
  { name: "Teal", r: 0, g: 128, b: 128 },

  // Cyans
  { name: "Cyan", r: 0, g: 255, b: 255 },
  { name: "Aqua", r: 0, g: 255, b: 255 },
  { name: "Light Cyan", r: 224, g: 255, b: 255 },
  { name: "Turquoise", r: 64, g: 224, b: 208 },

  // Blues
  { name: "Blue", r: 0, g: 0, b: 255 },
  { name: "Navy", r: 0, g: 0, b: 128 },
  { name: "Royal Blue", r: 65, g: 105, b: 225 },
  { name: "Steel Blue", r: 70, g: 130, b: 180 },
  { name: "Sky Blue", r: 135, g: 206, b: 235 },
  { name: "Cornflower Blue", r: 100, g: 149, b: 237 },
  { name: "Midnight Blue", r: 25, g: 25, b: 112 },

  // Purples
  { name: "Purple", r: 128, g: 0, b: 128 },
  { name: "Magenta", r: 255, g: 0, b: 255 },
  { name: "Fuchsia", r: 255, g: 0, b: 255 },
  { name: "Violet", r: 238, g: 130, b: 238 },
  { name: "Indigo", r: 75, g: 0, b: 130 },
  { name: "Orchid", r: 218, g: 112, b: 214 },
  { name: "Plum", r: 221, g: 160, b: 221 },

  // Browns
  { name: "Brown", r: 165, g: 42, b: 42 },
  { name: "Chocolate", r: 210, g: 105, b: 30 },
  { name: "Sienna", r: 160, g: 82, b: 45 },
  { name: "Peru", r: 205, g: 133, b: 63 },
  { name: "Sandy Brown", r: 244, g: 164, b: 96 },
  { name: "Tan", r: 210, g: 180, b: 140 },

  // Whites
  { name: "White", r: 255, g: 255, b: 255 },
  { name: "Snow", r: 255, g: 250, b: 250 },
  { name: "Ivory", r: 255, g: 255, b: 240 },
  { name: "Linen", r: 250, g: 240, b: 230 },

  // Grays
  { name: "Gray", r: 128, g: 128, b: 128 },
  { name: "Silver", r: 192, g: 192, b: 192 },
  { name: "Light Gray", r: 211, g: 211, b: 211 },
  { name: "Dim Gray", r: 105, g: 105, b: 105 },
  { name: "Dark Gray", r: 169, g: 169, b: 169 },

  // Blacks
  { name: "Black", r: 0, g: 0, b: 0 },
  { name: "Dark Slate Gray", r: 47, g: 79, b: 79 },
];

// Function to find closest named color
export const findClosestColorName = (rgb) => {
  let minDistance = Number.MAX_VALUE;
  let closestColor = "Unknown";

  extendedColorDatabase.forEach((color) => {
    // Calculate Euclidean distance in RGB space
    const distance = Math.sqrt(
      Math.pow(rgb.r - color.r, 2) +
        Math.pow(rgb.g - color.g, 2) +
        Math.pow(rgb.b - color.b, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color.name;
    }
  });

  return closestColor;
};

// Convert RGB to HSL for additional analysis
export const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

// Get color properties for better descriptions
export const getColorProperties = (rgb) => {
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Determine if color is light or dark
  const isLight = hsl.l > 50;

  // Determine color intensity
  let intensity;
  if (hsl.s < 10) {
    intensity = "Very Dull";
  } else if (hsl.s < 30) {
    intensity = "Dull";
  } else if (hsl.s < 70) {
    intensity = "Moderate";
  } else if (hsl.s < 90) {
    intensity = "Vibrant";
  } else {
    intensity = "Very Vibrant";
  }

  return {
    hsl,
    isLight,
    intensity,
  };
};

export default {
  colors: extendedColorDatabase,
  findClosestColorName,
  rgbToHsl,
  getColorProperties,
};
