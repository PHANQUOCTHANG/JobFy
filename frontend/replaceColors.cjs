const fs = require('fs');
const path = require('path');

const directories = [
  'src/features/home/components',
  'src/features/auth/components',
  'src/layouts/client/components',
  'src/pages/client/home'
];

const colorMap = {
  '#D44E2B': '#1A56DB', // Primary Blue
  '#d44e2b': '#1A56DB',
  '#BF3F1E': '#1447C0', // Primary Blue Hover
  '#bf3f1e': '#1447C0',
  '#E8A83A': '#F59E0B', // Amber
  '#e8a83a': '#F59E0B',
  '#111018': '#0F172A', // Slate 900
  '#F7F4EE': '#F4F6FA', // Clean White background instead of cream
  '#f7f4ee': '#F4F6FA',
  '#6B6059': '#64748B', // Slate 500 text
  '#6b6059': '#64748B',
  '#9B8E7F': '#94A3B8', // Slate 400 text
  '#9b8e7f': '#94A3B8',
  '#E8E2D8': '#E2E8F0', // Slate 200 border
  '#e8e2d8': '#E2E8F0',
  '#2B1B15': '#0F172A', // Very dark slate for cards
  '#9B3B26': '#1E3A8A', // Blue 900
  '#7A2E1E': '#1E40AF', // Blue 800
  '#68271A': '#1D4ED8', // Blue 700
  "fontFamily: \"'Playfair Display', serif\"": "fontFamily: \"'Manrope', sans-serif\"",
  "fontFamily: '\\'Playfair Display\\', serif'": "fontFamily: '\\'Manrope\\', sans-serif'"
};

function processDirectory(dir) {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) return;
  
  const files = fs.readdirSync(fullPath);
  for (const file of files) {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const filePath = path.join(fullPath, file);
      let content = fs.readFileSync(filePath, 'utf-8');
      
      let modified = false;
      // Also apply logic for when the background is white, maybe change white text to dark if needed.
      // But typically, dark mode cards (bg-[#111018] -> bg-[#0F172A]) will keep white text.
      // The only issue is if #F7F4EE (Cream) was the bg and #FFFFFF (White) was a card.
      // If we change #F7F4EE to #FFFFFF, both bg and card are white. They will blend.
      // To fix this, let's map #F7F4EE to #F4F6FA (Slate 50) instead of #FFFFFF to keep the distinction.
      // Let's modify the map inside the script dynamically:
      
      for (const [oldVal, newVal] of Object.entries(colorMap)) {
        if (content.includes(oldVal)) {
          content = content.split(oldVal).join(newVal);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated: ${filePath}`);
      }
    }
  }
}

directories.forEach(processDirectory);
console.log("Done replacing colors.");
