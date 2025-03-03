import sequelize from './db.js';
import User from './user.js';
import { TicketFactory } from './ticket.js';

// Initialize models
const Ticket = TicketFactory(sequelize);

// Define associations
const initializeAssociations = () => {
  User.hasMany(Ticket, {
    foreignKey: 'assignedUserId',
    as: 'tickets'
  });
  
  Ticket.belongsTo(User, {
    foreignKey: 'assignedUserId',
    as: 'assignedUser'
  });
};

// Set up associations
initializeAssociations();

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Run the connection test
testConnection();

export { sequelize, User, Ticket };