const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data.js');
const uploadsPath = path.join(__dirname, 'uploads', 'uploads.json');

const dataContent = fs.readFileSync(dataPath, 'utf8');
const uploads = JSON.parse(fs.readFileSync(uploadsPath, 'utf8'));

const imagesByMuscle = {
  Chest: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
  Back: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
  Shoulders: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
  Quadriceps: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  Glutes: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
  Hamstrings: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
  Abs: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
  Calves: 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=800&q=80',
  Biceps: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
  Triceps: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
  Forearms: 'https://images.unsplash.com/photo-1571019614245-cd287e2385a2?auto=format&fit=crop&w=800&q=80',
  Lats: 'https://images.unsplash.com/photo-1599058917212-d80ac5a8f7c3?auto=format&fit=crop&w=800&q=80',
  Obliques: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80',
  Tibialis: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
  Adductors: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
  Neck: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
  Traps: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
};

const validUploads = uploads.filter(u => u.title && u.videoUrl && u.muscle && u.muscle !== 'test' && u.muscle !== 'exercise');

// Dedup by title
const uniqueTitles = new Set();
const newCatalog = [];
let idCounter = 1;

for (const upload of validUploads) {
  if (!uniqueTitles.has(upload.title)) {
    uniqueTitles.add(upload.title);
    newCatalog.push({
      id: idCounter++,
      muscle: upload.muscle,
      name: upload.title,
      target: [upload.muscle],
      secondary: [],
      equipment: 'Custom',
      difficulty: 'Intermediate',
      calories: 200,
      image: imagesByMuscle[upload.muscle] || imagesByMuscle['Chest'],
      videoUrl: upload.videoUrl
    });
  }
}

const catalogStr = `export const exerciseCatalog = [\n${newCatalog.map(e => `  ${JSON.stringify(e, null, 2).replace(/\n/g, '\n  ')}`).join(',\n')}\n];`;

// Replace in data.js
const startIndex = dataContent.indexOf('export const exerciseCatalog = [');
const endIndex = dataContent.indexOf('export const workoutPlans = [');

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = dataContent.substring(0, startIndex) + catalogStr + '\n\n' + dataContent.substring(endIndex);
  fs.writeFileSync(dataPath, newContent);
  console.log(`Replaced exerciseCatalog with ${newCatalog.length} exercises.`);
} else {
  console.log('Could not find exerciseCatalog block or workoutPlans block.');
}
