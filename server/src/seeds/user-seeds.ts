import User from '../models/user.js';

export const seedUsers = async () => {
  try {
    const users = await User.bulkCreate([
      { username: 'JollyGuru', password: 'password' },
      { username: 'SunnyScribe', password: 'password' },
      { username: 'RadiantComet', password: 'password' },
    ], {
      individualHooks: true, // This ensures password hashing runs
      returning: true // This returns the created records
    });

    console.log('Created users:', users.map(user => ({
      id: user.id,
      username: user.username,
      createdAt: user.createdAt
    })));

  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};