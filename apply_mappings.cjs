const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'src', 'data.js');
let dataContent = fs.readFileSync(dataFile, 'utf8');

const mappings = JSON.parse(fs.readFileSync('mappings.json', 'utf8'));

// create reverse mapping: exercise_id -> videoUrl
const idToUrl = {};
for (const [url, id] of Object.entries(mappings)) {
  if (!idToUrl[id]) {
    idToUrl[id] = url;
  }
}

// Read the exercise list to find the name to use for matching if needed, but we can just use regex to replace videoUrl for each id.
// We need to parse data.js or just regex replace carefully.
// The structure is:
//   id: 1,
//   muscle: 'Chest',
//   name: 'Barbell Bench Press',
//   ...
//   videoUrl: '...',

let modifiedContent = dataContent.replace(/id:\s*(\d+),([\s\S]{1,400}?)videoUrl:\s*(null|'[^']+'|"[^"]+"),/g, (match, idStr, middle, oldUrl) => {
  const id = parseInt(idStr, 10);
  if (idToUrl[id]) {
    return `id: ${id},${middle}videoUrl: '${idToUrl[id]}',`;
  }
  // If we don't have a specific mapping, we could reset it to null to avoid incorrect videos
  // But let's just reset those that don't have a mapping.
  return `id: ${id},${middle}videoUrl: null,`; 
});

fs.writeFileSync(dataFile, modifiedContent);
console.log('Successfully applied correct mappings to data.js!');
