const db = require('../config/db');

const userModel = {};

userModel.createUser = async (userData, callback) => {
  const { username, email, birthday, phone_number, password, picture, name } = userData;

  db.none(
    'INSERT INTO users (username, email, birthday, phone_number, password, picture, name) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [username, email, birthday, phone_number, password, picture, name]
  )
    .then(() => {
      callback(null, { username, email, birthday, phone_number, picture, name });
    })
    .catch((err) => {
      callback(err, null);
    });
};

userModel.getUserById = (userId, callback) => {
  db.oneOrNone('SELECT id, username, email, birthday, phone_number, picture, name FROM users WHERE id = $1', [userId])
    .then((row) => {
      callback(null, row);
    })
    .catch((err) => {
      callback(err, null);
    });
};

userModel.updateUser = (userId, updatedUserData, callback) => {
  const { username, name, email, birthday, phone_number, picture } = updatedUserData;
  db.none(
    'UPDATE users SET username = $1, name = $2, email = $3, birthday = $4, phone_number = $5, picture = $6 WHERE id = $7',
    [username, name, email, birthday, phone_number, picture, userId]
  )
    .then(() => {
      callback(null, { id: userId, name, username, email, birthday, phone_number, picture });
    })
    .catch((err) => {
      callback(err, null);
    });
};

userModel.deleteUser = (userId, callback) => {
  db.none('DELETE FROM users WHERE id = $1', [userId])
    .then(() => {
      callback(null);
    })
    .catch((err) => {
      callback(err);
    });
};

userModel.findByUsername = (username, callback) => {
  db.oneOrNone('SELECT id, username, name, password, email, birthday, phone_number, picture FROM users WHERE username = $1', [username])
    .then((row) => {
      callback(null, row);
    })
    .catch((err) => {
      callback(err, null);
    });
};

userModel.countAllUsers = async () => {
  try {
    const query = 'SELECT COUNT(*) FROM users';
    const result = await db.query(query);
    return { totalAllUsers: result[0].count };
  } catch (error) {
    throw error;
  }
};

userModel.getAllUsers = async (offset, limit) => {
  try {
    const query = `SELECT id, username, name, email, birthday, phone_number, picture FROM users ORDER BY id LIMIT $1 offset $2`;
    const rows = await db.query(query, [limit, offset]);
    return rows;
  } catch (error) {
    throw error;
  }
};

userModel.searchUsers = async (field, value) => {
  try {
    const query = `SELECT id, username, name, email, birthday, phone_number, picture FROM users WHERE ${field} ILIKE '%' || $1 || '%'`;
    const rows = await db.query(query, [value]);
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = userModel;
