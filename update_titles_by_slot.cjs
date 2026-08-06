const fs = require('fs');
const path = require('path');

const mapping = {
  "Chest": {
    "1": "Flat Barbell Bench Press",
    "2": "Incline Barbell Bench Press",
    "3": "High-to-Low Cable Fly",
    "4": "Pec Deck Machine Fly",
    "5": "Low-to-High Cable Fly",
    "6": "Low-to-High Cable Fly",
    "7": "Standing Cable Fly"
  },
  "Traps": {
    "1": "Behind the Back Barbell Shrug",
    "2": "Single-Arm Behind the Back Dumbbell Shrug",
    "3": "Overhead Barbell Shrug",
    "4": "Dumbbell Shrug",
    "5": "Leaning Dumbbell Shrug"
  },
  "Triceps": {
    "1": "Cable Tricep Pushdown",
    "2": "Lying Dumbbell Tricep Extension",
    "3": "Standing Overhead Dumbbell Tricep Extension",
    "4": "Dumbbell Tricep Kickback",
    "5": "Overhead Cable Tricep Extension"
  },
  "Shoulders": {
    "1": "Machine Shoulder Press",
    "2": "Seated Dumbbell Lateral Raise",
    "3": "Machine Shoulder Press",
    "4": "Machine Reverse Fly",
    "5": "Seated Dumbbell Front Raise",
    "6": "Machine Reverse Fly"
  },
  "Obliques": {
    "1": "Plank"
  },
  "Quadriceps": {
    "1": "Dumbbell Walking Lunge",
    "2": "Leg Press (Glute Focus)",
    "3": "Leg Press (Quad Focus)",
    "4": "Leg Press (Inner Thighs)",
    "5": "Leg Extension",
    "6": "Lying Leg Curl (Inner Focus)",
    "7": "Lying Leg Curl (Outer Focus)",
    "8": "Lying Leg Curl (Entire)"
  },
  "Glutes": {
    "1": "Leg Press (Glute Focus)",
    "2": "Kettlebell RDL",
    "3": "Kettlebell Glute Bridge",
    "4": "Kettlebell Side-Lying Kickback",
    "5": "Kettlebell Sumo Squat",
    "6": "Kettlebell Sumo Squat"
  },
  "Forearms": {
    "1": "Reverse Grip Curls",
    "2": "Wrist Curls",
    "3": "Reverse Wrist Curls",
    "4": "Dumbbell Radial Deviation",
    "5": "Dumbbell Ulnar Deviation",
    "6": "Wrist Rotations"
  },
  "Calves": {
    "1": "Standing Calf Raise (Inner)",
    "2": "Standing Calf Raise (Outer)",
    "3": "Standing Calf Raise (Entire)"
  },
  "Biceps": {
    "1": "Standing Dumbbell Curl",
    "2": "Incline Dumbbell Curl",
    "3": "Single-Arm Dumbbell Preacher Curl",
    "4": "Seated Dumbbell Curl",
    "5": "EZ Bar Preacher Curl"
  },
  "Back": {
    "1": "Seated Cable Row (Mid Back Focus)",
    "2": "Seated Cable Row (Upper Back Focus)",
    "3": "Seated Cable Row (Lats Focus)",
    "4": "Barbell Row",
    "5": "Lat Pulldown (Upper Lats Focus)",
    "6": "Lat Pulldown (Lower Lats Focus)",
    "7": "Lat Pulldown (Entire Lats Focus)",
    "8": "Underhand Lat Pulldown (Lower Lats Focus)"
  },
  "Abs": {
    "1": "Reverse Crunches (Lower Abs)",
    "2": "Crunches (Upper Abs)",
    "3": "Alternating V-Ups (Full Abs)",
    "5": "Lying Leg Twists (Abdominals)"
  }
};

const uploadsFile = path.join(__dirname, 'uploads', 'uploads.json');

let metadata = JSON.parse(fs.readFileSync(uploadsFile, 'utf8'));
let updatedCount = 0;

metadata = metadata.map(item => {
  if (item.muscle && item.slot) {
    const muscleMap = mapping[item.muscle];
    if (muscleMap && muscleMap[item.slot.toString()]) {
      console.log(`Updating ${item.muscle} slot ${item.slot} -> ${muscleMap[item.slot.toString()]}`);
      item.title = muscleMap[item.slot.toString()];
      updatedCount++;
    }
  }
  return item;
});

fs.writeFileSync(uploadsFile, JSON.stringify(metadata, null, 2));
console.log(`Successfully updated ${updatedCount} titles.`);
