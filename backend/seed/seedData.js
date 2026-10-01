import { seedDatabase as seedUsers } from './seedPart1.js';
import { seedContent as seedPaths } from './seedPart2.js';
import { seedResources } from './seedResources.js';
import { seedTasks } from './seedTasks.js';
import { seedChallenges } from './seedChallenges.js';
import { seedQuizzesAndBadges } from './seedQuizzesAndBadges.js';
import { connectDB } from '../config/db.js';

export const runFullSeed = async () => {
  console.log('🚀 Initializing CodeQuest Full Dataset Seed...');
  await connectDB();
  await seedUsers();
  await seedPaths();
  await seedResources();
  await seedTasks();
  await seedChallenges();
  await seedQuizzesAndBadges();
  console.log('✨ All 10 Students, 5 Paths, 20 Resources, 20 Tasks, Quizzes, Challenges, and 15 Badges seeded successfully!');
};

// If run directly via node seed/seedData.js
if (process.argv[1].endsWith('seedData.js')) {
  runFullSeed().then(() => {
    console.log('Seed completed.');
    process.exit(0);
  }).catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}