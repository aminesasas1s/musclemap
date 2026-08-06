const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\hal\\Desktop\\tiktok\\gym';
const destDir = path.join(__dirname, 'uploads');
const metadataFile = path.join(destDir, 'uploads.json');

const muscleMapping = {
  'Forearms': 'Forearms',
  'abs': 'Abs',
  'back': 'Back',
  'bicep': 'Biceps',
  'calves': 'Calves',
  'chest': 'Chest',
  'glutes': 'Glutes',
  'leg': 'Quadriceps', 
  'obliques': 'Obliques',
  'shoulder': 'Shoulders',
  'traps': 'Traps',
  'triceps': 'Triceps'
};

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

let metadata = [];
try {
  metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf-8') || '[]');
} catch (e) {
  metadata = [];
}

const folders = fs.readdirSync(srcDir);

folders.forEach(folder => {
  const folderPath = path.join(srcDir, folder);
  if (fs.statSync(folderPath).isDirectory()) {
    const muscleName = muscleMapping[folder];
    if (!muscleName) {
      console.log(`Skipping unknown folder: ${folder}`);
      return;
    }

    const files = fs.readdirSync(folderPath).filter(f => f.match(/\.(mp4|webm|mov)$/i));
    files.forEach((file, index) => {
      const slot = index + 1; // 1-based indexing for slots
      const ext = path.extname(file);
      const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const newFilename = `${muscleName.toLowerCase()}-${unique}${ext}`;
      const destPath = path.join(destDir, newFilename);
      const urlPath = `/uploads/${newFilename}`;

      // Copy file
      fs.copyFileSync(path.join(folderPath, file), destPath);

      // Check if slot already exists in metadata
      const existingIndex = metadata.findIndex(m => m.muscle === muscleName && (m.slot || 1) === slot);
      const entry = {
        muscle: muscleName,
        slot: slot,
        path: urlPath,
        videoUrl: urlPath,
        title: file
      };

      if (existingIndex !== -1) {
        // Remove old file
        try {
          const oldPath = path.join(destDir, path.basename(metadata[existingIndex].path));
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (e) {
          // ignore
        }
        metadata[existingIndex] = entry;
      } else {
        metadata.push(entry);
      }
      console.log(`Uploaded ${muscleName} slot ${slot} (${file})`);
    });
  }
});

fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
console.log('Done!');
