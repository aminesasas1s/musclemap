const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data.js');
const dataContent = fs.readFileSync(dataPath, 'utf8');

// Use regex to extract exerciseCatalog
const regex = /export const exerciseCatalog = (\[[\s\S]*?\]);/;
const match = dataContent.match(regex);

if (match) {
  const catalog = eval(match[1]); // Evaluate the array string to JS object
  const muscleGroups = {};
  catalog.forEach(ex => {
    if (!muscleGroups[ex.muscle]) {
      muscleGroups[ex.muscle] = [];
    }
    muscleGroups[ex.muscle].push({ id: ex.id, name: ex.name });
  });
  fs.writeFileSync('catalog_summary.json', JSON.stringify(muscleGroups, null, 2));
  console.log('Catalog summarized!');
} else {
  console.log('Catalog not found.');
}
