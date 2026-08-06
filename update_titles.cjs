const fs = require('fs');
const path = require('path');

const mapping = {
  "ch1.mp4": "Flat Barbell Bench Press",
  "ch2.mp4": "Incline Barbell Bench Press",
  "ch3.mp4": "High-to-Low Cable Fly",
  "ch4.mp4": "Pec Deck Machine Fly",
  "ch5.mp4": "Low-to-High Cable Fly",
  "ch6.mp4": "Low-to-High Cable Fly",
  "ch7.mp4": "Standing Cable Fly",
  "ch1_2.mp4": "Flat Barbell Bench Press",
  "ch2_2.mp4": "Incline Barbell Bench Press",
  "ch3_2.mp4": "High-to-Low Cable Fly",
  "ch4_2.mp4": "Pec Deck Machine Fly",
  "ch5_2.mp4": "Low-to-High Cable Fly",
  "ch6_2.mp4": "Low-to-High Cable Fly",
  "ch7_2.mp4": "Standing Cable Fly",
  "trap1.mp4": "Behind the Back Barbell Shrug",
  "trap2.mp4": "Single-Arm Behind the Back Dumbbell Shrug",
  "trap3.mp4": "Overhead Barbell Shrug",
  "trap4.mp4": "Dumbbell Shrug",
  "trap5.mp4": "Leaning Dumbbell Shrug",
  "tricep1.mp4": "Cable Tricep Pushdown",
  "tricep2.mp4": "Lying Dumbbell Tricep Extension",
  "tricep3.mp4": "Standing Overhead Dumbbell Tricep Extension",
  "tricep4.mp4": "Dumbbell Tricep Kickback",
  "tricep5.mp4": "Overhead Cable Tricep Extension",
  "sh1.mp4": "Machine Shoulder Press",
  "sh2.mp4": "Seated Dumbbell Lateral Raise",
  "sh3.mp4": "Machine Shoulder Press",
  "sh4.mp4": "Machine Reverse Fly",
  "sh5.mp4": "Seated Dumbbell Front Raise",
  "sh6.mp4": "Machine Reverse Fly",
  "o1.mp4": "Plank",
  "leg1.mp4": "Dumbbell Walking Lunge",
  "leg2.mp4": "Leg Press (Glute Focus)",
  "leg3.mp4": "Leg Press (Quad Focus)",
  "leg 4.mp4": "Leg Press (Inner Thighs)",
  "leg5.mp4": "Leg Extension",
  "leg6.mp4": "Lying Leg Curl (Inner Focus)",
  "leg7.mp4": "Lying Leg Curl (Outer Focus)",
  "leg8.mp4": "Lying Leg Curl (Entire)",
  "g1.mp4": "Leg Press (Glute Focus)",
  "g2.mp4": "Kettlebell RDL",
  "g3.mp4": "Kettlebell Glute Bridge",
  "g4.mp4": "Kettlebell Side-Lying Kickback",
  "g6.mp4": "Kettlebell Sumo Squat",
  "f1.mp4": "Reverse Grip Curls",
  "f2.mp4": "Wrist Curls",
  "f3.mp4": "Reverse Wrist Curls",
  "f4.mp4": "Dumbbell Radial Deviation",
  "f5.mp4": "Dumbbell Ulnar Deviation",
  "f6.mp4": "Wrist Rotations",
  "cl1.mp4": "Standing Calf Raise (Inner)",
  "cl2.mp4": "Standing Calf Raise (Outer)",
  "cl3.mp4": "Standing Calf Raise (Entire)",
  "bicep1.mp4": "Standing Dumbbell Curl",
  "bicep2.mp4": "Incline Dumbbell Curl",
  "biceps3.mp4": "Single-Arm Dumbbell Preacher Curl",
  "bicep4.mp4": "Seated Dumbbell Curl",
  "bicep5.mp4": "EZ Bar Preacher Curl",
  "back1.mp4": "Seated Cable Row (Mid Back Focus)",
  "back2.mp4": "Seated Cable Row (Upper Back Focus)",
  "back3.mp4": "Seated Cable Row (Lats Focus)",
  "back4.mp4": "Barbell Row",
  "back5.mp4": "Lat Pulldown (Upper Lats Focus)",
  "back 6.mp4": "Lat Pulldown (Lower Lats Focus)",
  "back7.mp4": "Lat Pulldown (Entire Lats Focus)",
  "back8.mp4": "Underhand Lat Pulldown (Lower Lats Focus)",
  "a1.mp4": "Reverse Crunches (Lower Abs)",
  "a2.mp4": "Crunches (Upper Abs)",
  "a3.mp4": "Alternating V-Ups (Full Abs)",
  "a5.mp4": "Lying Leg Twists (Abdominals)"
};

const uploadsFile = path.join(__dirname, 'uploads', 'uploads.json');

let metadata = JSON.parse(fs.readFileSync(uploadsFile, 'utf8'));
let updatedCount = 0;

metadata = metadata.map(item => {
  // item.title is currently something like "leg 4.mp4"
  // Let's check if we have a match in the mapping
  
  if (item.title && mapping[item.title]) {
    console.log(`Updating ${item.title} -> ${mapping[item.title]}`);
    item.title = mapping[item.title];
    updatedCount++;
  } else if (item.originalName && mapping[item.originalName]) {
    console.log(`Updating (via originalName) ${item.originalName} -> ${mapping[item.originalName]}`);
    item.title = mapping[item.originalName];
    updatedCount++;
  } else {
    // try to match lowercase or something just in case
    const lowerTitle = item.title ? item.title.toLowerCase() : "";
    const lowerMatch = Object.keys(mapping).find(k => k.toLowerCase() === lowerTitle);
    if (lowerMatch) {
      console.log(`Updating (case-insensitive) ${item.title} -> ${mapping[lowerMatch]}`);
      item.title = mapping[lowerMatch];
      updatedCount++;
    }
  }
  return item;
});

fs.writeFileSync(uploadsFile, JSON.stringify(metadata, null, 2));
console.log(`Successfully updated ${updatedCount} titles.`);
