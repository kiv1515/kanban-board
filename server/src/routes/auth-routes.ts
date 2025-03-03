import { Router, Request, Response } from 'express';
import User from '../models/user.js';
// import { sequelize } from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = Router();

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  
  try {
    console.log('Login attempt for username:', username);
    
    const user = await User.findOne({ 
      where: { username },
      logging: (sql) => console.log('Executed SQL:', sql)
    });
    
    console.log('User lookup result:', {
      found: !!user,
      username: username,
      timestampAttempt: new Date().toISOString()
    });
    
    if (!user) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }
    
    console.log('Attempting password verification');
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password verification result:', validPassword);
    
    if (!validPassword) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    if (!process.env.JWT_SECRET_KEY) {
      console.error('JWT_SECRET_KEY is not set!');
      res.status(500).json({ message: 'Server configuration error' });
      return;
    }

    try {
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username,
          iat: Math.floor(Date.now() / 1000)
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '2h' }
      );
      
      console.log('JWT token generated successfully');

      res.status(200).json({
        token,
        user: {
          id: user.id,
          username: user.username
        },
        expiresIn: '2h'
      });
      
    } catch (jwtError) {
      console.error('JWT generation error:', jwtError);
      res.status(500).json({ message: 'Error generating authentication token' });
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    });
  }
};

// // Test route
// router.get('/test-auth', async (_req: Request, res: Response) => {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connection OK');
    
//     const users = await User.findAll({
//       attributes: ['id', 'username', 'createdAt'],
//       raw: true
//     });
    
//     res.json({
//       dbConnection: 'OK',
//       usersCount: users.length,
//       users: users,
//       env: {
//         nodeEnv: process.env.NODE_ENV,
//         hasJwtSecret: !!process.env.JWT_SECRET_KEY
//       }
//     });
//   } catch (error) {
//     console.error('Test route error:', error);
//     res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
//   }
// });

router.post('/login', login);

export default router;