const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data.js');
let content = fs.readFileSync(dataPath, 'utf8');

// Find the workoutPlans array
const match = content.match(/export const workoutPlans = (\[[\s\S]*?\]);/);
if (match) {
  let plans = JSON.parse(match[1]);
  
  const images = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop"
  ];

  plans = plans.map((plan, index) => {
    return {
      ...plan,
      coverImage: images[index % images.length],
      rating: (4.5 + Math.random() * 0.4).toFixed(1),
      reviews: Math.floor(Math.random() * 10000) + 5000,
      members: Math.floor(Math.random() * 20000) + 10000
    };
  });

  const newContent = content.replace(
    /export const workoutPlans = \[[\s\S]*?\];/, 
    `export const workoutPlans = ${JSON.stringify(plans, null, 2)};`
  );
  
  fs.writeFileSync(dataPath, newContent);
  console.log("Metadata added successfully!");
} else {
  console.log("Could not find workoutPlans");
}
