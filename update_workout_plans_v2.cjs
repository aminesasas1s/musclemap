const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data.js');
const dataContent = fs.readFileSync(dataPath, 'utf8');

const newWorkoutPlans = [
  {
    id: 1,
    title: 'Monday',
    emoji: '💪',
    goal: 'Gain Muscle',
    goalDescription: 'Chest & Triceps',
    targetMuscle: 'Chest',
    level: 'Intermediate',
    durationWeeks: 1,
    durationMinutes: 60,
    daysPerWeek: 6,
    workoutTime: '50-60 min',
    equipment: ['Barbell', 'Machine', 'Cable'],
    exercises: ['Flat Barbell Bench Press', 'Incline Barbell Bench Press', 'Pec Deck Machine Fly', 'Standing Cable Fly', 'Cable Tricep Pushdown', 'Overhead Cable Tricep Extension', 'Dumbbell Tricep Kickback'],
    rating: 4.8,
    calories: 580,
    completion: 85,
    progressLabel: 'Active',
    description: 'Push day: Build Chest Strength & Size',
    tags: ['Push', 'Upper Body', 'Hypertrophy'],
    weeks: [
      {
        week: 1,
        days: [
          {
            day: 1,
            title: 'Chest & Triceps',
            estimatedTime: 55,
            exercises: [
              { exerciseId: 1, sets: 4, reps: 10, rest: 90 }, // Flat Barbell Bench Press
              { exerciseId: 2, sets: 3, reps: 12, rest: 75 }, // Incline Barbell Bench Press
              { exerciseId: 4, sets: 3, reps: 15, rest: 60 }, // Pec Deck Machine Fly
              { exerciseId: 41, sets: 3, reps: 15, rest: 60 }, // Standing Cable Fly
              { exerciseId: 33, sets: 3, reps: 12, rest: 60 }, // Cable Tricep Pushdown
              { exerciseId: 59, sets: 3, reps: 15, rest: 45 }, // Overhead Cable Tricep Extension
              { exerciseId: 58, sets: 2, reps: 15, rest: 45 }, // Dumbbell Tricep Kickback
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
    goalDescription: 'Back, Biceps & Traps',
    targetMuscle: 'Back',
    level: 'Intermediate',
    durationWeeks: 1,
    durationMinutes: 65,
    daysPerWeek: 6,
    workoutTime: '55-65 min',
    equipment: ['Barbell', 'Machine', 'Dumbbell'],
    exercises: ['Lat Pulldown (Upper Lats Focus)', 'Seated Cable Row (Lats Focus)', 'Barbell Row', 'Dumbbell Shrug', 'Standing Dumbbell Curl', 'Incline Dumbbell Curl', 'EZ Bar Preacher Curl'],
    rating: 4.9,
    calories: 610,
    completion: 88,
    progressLabel: 'Active',
    description: 'Pull day: Back Width & Thickness',
    tags: ['Pull', 'Upper Body', 'Hypertrophy'],
    weeks: [
      {
        week: 1,
        days: [
          {
            day: 1,
            title: 'Back, Biceps & Traps',
            estimatedTime: 60,
            exercises: [
              { exerciseId: 22, sets: 4, reps: 10, rest: 90 }, // Lat Pulldown (Upper Lats Focus)
              { exerciseId: 20, sets: 3, reps: 10, rest: 75 }, // Seated Cable Row (Lats Focus)
              { exerciseId: 21, sets: 3, reps: 10, rest: 90 }, // Barbell Row
              { exerciseId: 26, sets: 3, reps: 12, rest: 60 }, // Dumbbell Shrug
              { exerciseId: 28, sets: 3, reps: 10, rest: 60 }, // Standing Dumbbell Curl
              { exerciseId: 29, sets: 3, reps: 12, rest: 60 }, // Incline Dumbbell Curl
              { exerciseId: 32, sets: 2, reps: 12, rest: 60 }, // EZ Bar Preacher Curl
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
    goalDescription: 'Quads, Hamstrings, Glutes & Calves',
    targetMuscle: 'Legs',
    level: 'Intermediate',
    durationWeeks: 1,
    durationMinutes: 60,
    daysPerWeek: 6,
    workoutTime: '60 min',
    equipment: ['Machine', 'Dumbbell'],
    exercises: ['Leg Press (Quad Focus)', 'Dumbbell Walking Lunge', 'Leg Extension', 'Lying Leg Curl (Entire)', 'Standing Calf Raise (Entire)'],
    rating: 4.9,
    calories: 680,
    completion: 82,
    progressLabel: 'Active',
    description: 'Leg day: Complete lower body development',
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
              { exerciseId: 10, sets: 3, reps: 12, rest: 60 }, // Leg Extension
              { exerciseId: 54, sets: 3, reps: 12, rest: 60 }, // Lying Leg Curl
              { exerciseId: 13, sets: 4, reps: 20, rest: 45 }, // Standing Calf Raise
            ],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Thursday',
    emoji: '🔥',
    goal: 'Gain Muscle',
    goalDescription: 'Shoulders & Core',
    targetMuscle: 'Shoulders',
    level: 'Intermediate',
    durationWeeks: 1,
    durationMinutes: 55,
    daysPerWeek: 6,
    workoutTime: '50-55 min',
    equipment: ['Machine', 'Dumbbell', 'Bodyweight'],
    exercises: ['Machine Shoulder Press', 'Seated Dumbbell Lateral Raise', 'Machine Reverse Fly', 'Seated Dumbbell Front Raise', 'Reverse Crunches (Lower Abs)', 'Crunches (Upper Abs)', 'Plank'],
    rating: 4.7,
    calories: 520,
    completion: 80,
    progressLabel: 'Active',
    description: 'Shoulder and core day: Bigger Shoulders & Strong Core',
    tags: ['Shoulders', 'Core', 'Hypertrophy'],
    weeks: [
      {
        week: 1,
        days: [
          {
            day: 1,
            title: 'Shoulders & Core',
            estimatedTime: 55,
            exercises: [
              { exerciseId: 14, sets: 4, reps: 10, rest: 90 }, // Machine Shoulder Press
              { exerciseId: 15, sets: 4, reps: 12, rest: 60 }, // Seated Dumbbell Lateral Raise
              { exerciseId: 16, sets: 3, reps: 15, rest: 60 }, // Machine Reverse Fly
              { exerciseId: 17, sets: 3, reps: 12, rest: 60 }, // Seated Dumbbell Front Raise
              { exerciseId: 34, sets: 3, reps: 15, rest: 45 }, // Reverse Crunches
              { exerciseId: 35, sets: 3, reps: 20, rest: 45 }, // Crunches
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
    goalDescription: 'Biceps, Triceps & Forearms',
    targetMuscle: 'Arms',
    level: 'Intermediate',
    durationWeeks: 1,
    durationMinutes: 60,
    daysPerWeek: 6,
    workoutTime: '55-60 min',
    equipment: ['Dumbbell', 'Cable', 'Barbell'],
    exercises: ['Standing Dumbbell Curl', 'EZ Bar Preacher Curl', 'Seated Dumbbell Curl', 'Cable Tricep Pushdown', 'Overhead Cable Tricep Extension', 'Lying Dumbbell Tricep Extension', 'Wrist Curls', 'Reverse Wrist Curls'],
    rating: 4.6,
    calories: 480,
    completion: 78,
    progressLabel: 'Active',
    description: 'Arm Specialization: Complete Arm Growth',
    tags: ['Arms', 'Isolation', 'Specialization'],
    weeks: [
      {
        week: 1,
        days: [
          {
            day: 1,
            title: 'Arms',
            estimatedTime: 60,
            exercises: [
              { exerciseId: 28, sets: 3, reps: 10, rest: 60 }, // Standing Dumbbell Curl
              { exerciseId: 32, sets: 3, reps: 12, rest: 60 }, // EZ Bar Preacher Curl
              { exerciseId: 31, sets: 3, reps: 12, rest: 60 }, // Seated Dumbbell Curl
              { exerciseId: 33, sets: 3, reps: 10, rest: 60 }, // Cable Tricep Pushdown
              { exerciseId: 59, sets: 3, reps: 12, rest: 60 }, // Overhead Cable Tricep Extension
              { exerciseId: 56, sets: 3, reps: 12, rest: 60 }, // Lying Dumbbell Tricep Extension
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
    goalDescription: 'Full Body Strength',
    targetMuscle: 'Full Body',
    level: 'Advanced',
    durationWeeks: 1,
    durationMinutes: 70,
    daysPerWeek: 6,
    workoutTime: '60-70 min',
    equipment: ['Barbell', 'Machine', 'Kettlebell'],
    exercises: ['Flat Barbell Bench Press', 'Barbell Row', 'Leg Press (Quad Focus)', 'Machine Shoulder Press', 'Kettlebell RDL', 'Standing Calf Raise (Entire)', 'Alternating V-Ups (Full Abs)'],
    rating: 4.8,
    calories: 750,
    completion: 84,
    progressLabel: 'Active',
    description: 'Full body power + conditioning: Strength & Conditioning',
    tags: ['Full Body', 'Power', 'Conditioning'],
    weeks: [
      {
        week: 1,
        days: [
          {
            day: 1,
            title: 'Full Body Strength',
            estimatedTime: 65,
            exercises: [
              { exerciseId: 1, sets: 3, reps: 8, rest: 90 }, // Flat Barbell Bench Press
              { exerciseId: 21, sets: 3, reps: 8, rest: 90 }, // Barbell Row
              { exerciseId: 8, sets: 3, reps: 10, rest: 90 }, // Leg Press
              { exerciseId: 14, sets: 3, reps: 10, rest: 90 }, // Machine Shoulder Press
              { exerciseId: 48, sets: 3, reps: 12, rest: 75 }, // Kettlebell RDL
              { exerciseId: 13, sets: 3, reps: 15, rest: 45 }, // Standing Calf Raise
              { exerciseId: 36, sets: 3, reps: 15, rest: 45 }, // Alternating V-Ups
            ],
          },
        ],
      },
    ],
  }
];

const startIndex = dataContent.indexOf('export const workoutPlans = [');
const endIndex = dataContent.indexOf('const FAVORITES_KEY = ');

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = dataContent.substring(0, startIndex) + 
    'export const workoutPlans = ' + JSON.stringify(newWorkoutPlans, null, 2) + ';\n\n' + 
    dataContent.substring(endIndex);
  
  fs.writeFileSync(dataPath, newContent, 'utf8');
  console.log('Successfully updated workout plans with V2 mapping!');
} else {
  console.log('Failed to find workout plans array!');
}
