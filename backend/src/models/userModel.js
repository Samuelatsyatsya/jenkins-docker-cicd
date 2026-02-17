import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50],
      is: /^[a-zA-Z0-9_]+$/ // Alphanumeric and underscores only
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  wins: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  losses: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  draws: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  total_games: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.wins + this.losses + this.draws;
    }
  },
  win_rate: {
    type: DataTypes.VIRTUAL,
    get() {
      const total = this.wins + this.losses + this.draws;
      return total > 0 ? ((this.wins / total) * 100).toFixed(1) : 0;
    }
  },
  last_active: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeSave: (user) => {
      user.last_active = new Date();
    }
  }
});

export default User;