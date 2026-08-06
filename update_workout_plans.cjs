const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data.js');
const dataContent = fs.readFileSync(dataPath, 'utf8');

const newWorkoutPlans = [
  {
    id: 1,
    title: 'Monday',
    emoji: '🏋',
    goal: 'Gain Muscle',
    goalDescription: 'Chest & Triceps',
    targetMuscle: 'Chest',
    level: 'Intermediate',
    durationWeeks: 1,
    durationMinutes: 50,
    daysPerWeek: 6,
    workoutTime: '45–55 min',
    equipment: ['Barbell', 'Dumbbell', 'Machine'],
    exercises: ['Flat Barbell Bench Press', 'Incline Barbell Bench Press', 'Pec Deck Machine Fly', 'Cable Tricep Pushdown', 'Lying Dumbbell Tricep Extension', 'Overhead Cable Tricep Extension'],
    rating: 4.8,
    calories: 580,
    completion: 85,
    progressLabel: 'Active',
    description: 'Push day: Bench press, incline press, and triceps work for upper body strength and volume.',
    tags: ['Push', 'Upper Body', 'Hypertrophy'],
    weeks: [
      {
        week: 1,
        days: [
          {
            day: 1,
            title: 'Chest & Triceps',
            estimatedTime: 50,
            exercises: [
              { exerciseId: 1, sets: 4, reps: 8, rest: 90 }, // Flat Barbell Bench Press
              { exerciseId: 2, sets: 3, reps: 10, rest: 75 }, // Incline Barbell Bench Press
              { exerciseId: 4, sets: 3, reps: 12, rest: 60 }, // Pec Deck Machine Fly
              { exerciseId: 33, sets: 3, reps: 12, rest: 60 }, // Cable Tricep Pushdown
              { exerciseId: 56, sets: 3, reps: 12, rest: 45 }, // Lying Dumbbell Tricep Extension
              { exerciseId: 59, sets: 3, reps: 12, rest: 45 }, // Overhead Cable Tricep Extension
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Tuesday',
    emoji: '💪',
    goal: 'Gain Muscle',
    goalDescription: 'Back & Biceps',
    targetMuscle: 'Back',
    level: 'Intermediate',
    durationWeeks: 1,
    durationMinutes: 55,
    daysPerWeek: 6,
    workoutTime: '50–60 min',
    equipment: ['Barbell', 'Machine', 'Bodyweight'],
    exercises: ['Barbell Row', 'Lat Pulldown (Entire Lats Focus)', 'Seated Cable Row (Mid Back Focus)', 'Standing Dumbbell Curl', 'Incline Dumbbell Curl', 'EZ Bar Preacher Curl'],
    rating: 4.9,
    calories: 610,
    completion: 88,
    progressLabel: 'Active',
    description: 'Pull day: Heavy rows, lat pulldowns, and bicep curls for back width and arm development.',
    tags: ['Pull', 'Upper Body', 'Hypertrophy'],
    weeks: [
      {
        week: 1,
        days: [
          {
            day: 1,
            title: 'Back & Biceps',
            estimatedTime: 55,
            exercises: [
              { exerciseId: 21, sets: 4, reps: 10, rest: 75 }, // Barbell Row
              { exerciseId: 39, sets: 4, reps: 8, rest: 90 }, // Lat Pulldown (Entire)
              { exerciseId: 18, sets: 3, reps: 10, rest: 75 }, // Seated Cable Row (Mid Back)
              { exerciseId: 28, sets: 3, reps: 12, rest: 60 }, // Standing Dumbbell Curl
              { exerciseId: 29, sets: 3, reps: 10, rest: 60 }, // Incline Dumbbell Curl
              { exerciseId: 32, sets: 3, reps: 12, rest: 60 }, // EZ Bar Preacher Curl
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Wednesday',
    emoji: '🦵',
    goal: 'Gain Muscle',
    goalDescription: 'Legs',
    targetMuscle: 'Legs',
    level: 'Intermediate',
    durationWeeks: 1,
    durationMinutes: 60,
    daysPerWeek: 6,
    workoutTime: '55–65 min',
    equipment: ['Barbell', 'Machine', 'Dumbbell'],
    exercises: ['Leg Press (Quad Focus)', 'Dumbbell Walking Lunge', 'Kettlebell RDL', 'Lying Leg Curl (Entire)', 'Standing Calf Raise (Entire)'],
    rating: 4.9,
    calories: 680,
    completion: 82,
    progressLabel: 'Active',
    description: 'Leg day: Leg presses, lunges, and calf raises for lower body strength and mass.',
    tags: ['Legs', 'Lower Body', 'Hypertrophy'],
    weeks: [
      {
        week: 1,
        days: [
          {
            day: 1,
            title: 'Legs',
            estimatedTime: 60,
            exercises: [
              { exerciseId: 8, sets: 4, reps: 10, rest: 90 }, // Leg Press (Quad)
              { exerciseId: 6, sets: 3, reps: 12, rest: 75 }, // Dumbbell Walking Lunge
              { exerciseId: 48, sets: 3, reps: 10, rest: 75 }, // Kettlebell RDL
              { exerciseId: 54, sets: 3, reps: 12, rest: 60 }, // Lying Leg Curl
              { exerciseId: 13, sets: 4, reps: 15, rest: 45 }, // Standing Calf Raise
            ],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Thursday',
    emoji: '💎',
    goal: 'Gain Muscle',
    goalDescription: 'Shoulders & Abs',
    targetMuscle: 'Shoulders',
    level: 'Intermediate',
    durationWeeks: 1,
    durationMinutes: 55,
    daysPerWeek: 6,
    workoutTime: '50–60 min',
    equipment: ['Barbell', 'Dumbbell', 'Machine', 'Bodyweight'],
    exercises: ['Machine Shoulder Press', 'Seated Dumbbell Lateral Raise', 'Seated Dumbbell Front Raise', 'Reverse Crunches (Lower Abs)', 'Alternating V-Ups (Full Abs)', 'Plank'],
    rating: 4.7,
    calories: 520,
    completion: 80,
    progressLabel: 'Active',
    description: 'Shoulder and core day: Machine pressing, raises, and core work for shoulder stability and definition.',
    tags: ['Shoulders', 'Core', 'Balance'],
    weeks: [
      {
        week: 1,
        days: [
          {
            day: 1,
            title: 'Shoulders & Abs',
            estimatedTime: 55,
            exercises: [
              { exerciseId: 14, sets: 4, reps: 8, rest: 90 }, // Machine Shoulder Press
              { exerciseId: 15, sets: 3, reps: 15, rest: 60 }, // Seated Dumbbell Lateral Raise
              { exerciseId: 17, sets: 3, reps: 12, rest: 60 }, // Seated Dumbbell Front Raise
              { exerciseId: 34, sets: 3, reps: 15, rest: 45 }, // Reverse Crunches
              { exerciseId: 36, sets: 3, reps: 15, rest: 45 }, // Alternating V-Ups
              { exerciseId: 55, sets: 3, reps: 60, rest: 45 }, // Plank
            ],
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'Friday',
    emoji: '💪',
    goal: 'Gain Muscle',
    goalDescription: 'Arms',
    targetMuscle: 'Arms',
    level: 'Intermediate',
    durationWeeks: 1,
    durationMinutes: 50,
    daysPerWeek: 6,
    workoutTime: '45–55 min',
    equipment: ['Barbell', 'Dumbbell', 'Machine'],
    exercises: ['Single-Arm Dumbbell Preacher Curl', 'Seated Dumbbell Curl', 'Dumbbell Tricep Kickback', 'Standing Overhead Dumbbell Tricep Extension', 'Wrist Curls', 'Reverse Wrist Curls'],
    rating: 4.6,
    calories: 480,
    completion: 78,
    progressLabel: 'Active',
    description: 'Arm specialization day: Biceps, triceps, and forearms for complete arm development.',
    tags: ['Arms', 'Isolation', 'Specialization'],
    weeks: [
      {
        week: 1,
        days: [
          {
            day: 1,
            title: 'Arms',
            estimatedTime: 50,
            exercises: [
              { exerciseId: 30, sets: 3, reps: 10, rest: 75 }, // Preacher Curl
              { exerciseId: 31, sets: 3, reps: 10, rest: 60 }, // Seated Dumbbell Curl
              { exerciseId: 58, sets: 3, reps: 12, rest: 75 }, // Dumbbell Tricep Kickback
              { exerciseId: 57, sets: 3, reps: 12, rest: 60 }, // Standing Overhead Tricep Extension
              { exerciseId: 43, sets: 3, reps: 15, rest: 45 }, // Wrist Curls
              { exerciseId: 44, sets: 3, reps: 15, rest: 45 }, // Reverse Wrist Curls
            ],
          },
        ],
      },
    ],
  },
  {
    id: 6,
    title: 'Saturday',
    emoji: '🔥',
    goal: 'Strength',
    goalDescription: 'Full Body & Cardio',
    targetMuscle: 'Full Body',
    level: 'Advanced',
    durationWeeks: 1,
    durationMinutes: 70,
    daysPerWeek: 6,
    workoutTime: '65–75 min',
    equipment: ['Barbell', 'Bodyweight', 'Cardio'],
    exercises: ['High-to-Low Cable Fly', 'Underhand Lat Pulldown', 'Leg Press (Glute Focus)', 'Machine Reverse Fly', 'Lying Leg Twists'],
    rating: 4.8,
    calories: 750,
    completion: 84,
    progressLabel: 'Active',
    description: 'Full body power + conditioning: Heavy compound lifts followed by high-intensity cardio.',
    tags: ['Full Body', 'Power', 'Conditioning'],
    weeks: [
      {
        week: 1,
        days: [
          {
            day: 1,
            title: 'Full Body & Cardio',
            estimatedTime: 70,
            exercises: [
              { exerciseId: 3, sets: 4, reps: 10, rest: 90 }, // Cable Fly
              { exerciseId: 40, sets: 3, reps: 10, rest: 90 }, // Underhand Lat Pulldown
              { exerciseId: 7, sets: 3, reps: 10, rest: 90 }, // Leg Press (Glute Focus)
              { exerciseId: 16, sets: 3, reps: 10, rest: 75 }, // Machine Reverse Fly
              { exerciseId: 37, sets: 3, reps: 20, rest: 45 }, // Lying Leg Twists
            ],
          },
        ],
      },
    ],
  }
];

// Replace the workoutPlans array in dataContent
const startIndex = dataContent.indexOf('export const workoutPlans = [');
const endIndex = dataContent.indexOf('const FAVORITES_KEY = ');

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = dataContent.substring(0, startIndex) + 
    'export const workoutPlans = ' + JSON.stringify(newWorkoutPlans, null, 2) + ';\n\n' + 
    dataContent.substring(endIndex);
  
  fs.writeFileSync(dataPath, newContent, 'utf8');
  console.log('Successfully updated workout plans!');
} else {
  console.log('Failed to find workout plans array!');
}
