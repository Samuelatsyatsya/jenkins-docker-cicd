import { Sequelize } from 'sequelize';
import AWS from 'aws-sdk';

// Configure AWS SDK region
AWS.config.update({ region: process.env.AWS_REGION });

const secretsManager = new AWS.SecretsManager();

// Function to get DB credentials from Secrets Manager
async function getDbCredentials(secretName) {
  try {
    const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    
    if ('SecretString' in data) {
      return JSON.parse(data.SecretString);
    }
    
    throw new Error('Secret has no string value');
  } catch (error) {
    console.error('Error fetching database credentials:', error.message);
    throw error;
  }
}

// Initialize Sequelize
async function initializeSequelize() {
  const secretName = process.env.DB_SECRET_NAME;
  
  if (!secretName) {
    throw new Error('DB_SECRET_NAME environment variable is not set');
  }

  const creds = await getDbCredentials(secretName);

  const sequelize = new Sequelize(
    creds.dbname,
    creds.username,
    creds.password,
    {
      host: creds.host,
      port: creds.port,
      dialect: 'mysql',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
      }
    }
  );

  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    throw error;
  }
}

// Create the sequelize instance
const sequelize = await initializeSequelize();

// Test connection function (what server.js needs)
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection test successful.');
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error.message);
    return false;
  }
};

// Export for named imports
export { sequelize };

// Export as default for compatibility
export default sequelize;
