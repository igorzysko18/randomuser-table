const bcrypt = require('bcrypt');
const axios = require('axios');
const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userModel = require('../models/usersModel');

exports.createUser = (req, res) => {
  let userData = req.body; 

  userModel.findByUsername(userData.username, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer login.' });
    }
    if (!user) {
      bcrypt.hash(userData.password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          return res.status(500).json({ message: 'Erro ao criar o usuário.' });
        }
    
        userData.password = hashedPassword;
    
        userModel.createUser(userData, (createErr, newUser) => {
          if (createErr) {
            return res.status(500).json({ message: 'Erro ao criar o usuário.' });
          }
          res.status(201).json(newUser);
        });
      });
    } else {
      return res.status(409).json({ message: 'Nome de usuário já cadastrado em nossa base.' });
    }
  });
};

exports.userLogin = (req, res) => {
  let { username, password } = req.body;

  if (username == 'admin' && password == '1fa4a686779030faee81425b575bd1fd') { 
    let token = jwt.sign({ username: username }, process.env.SECRET_KEY, { expiresIn: '1h' });
    return res.status(200).json({ message: 'Login bem-sucedido', token });
  }

  userModel.findByUsername(username, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer login.' });
    }
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    bcrypt.compare(password, user.password, (bcryptErr, passwordMatch) => {
      if (bcryptErr) {
        return res.status(500).json({ message: 'Erro ao verificar a senha.' });
      }

      if (passwordMatch) {
        let token = jwt.sign({ username: username }, process.env.SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login bem-sucedido', token });
      } else {
        return res.status(404).json({ message: 'Senha incorreta.' });
      }
    });
  });
};

exports.updateUser = (req, res) => {
  let userId = req.params.id; 
  let userData = req.body; 
  userModel.findByUsername(userData.username, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer login.' });
    }
    if (!user || user.id == userId) {
      userModel.updateUser(userId, userData, (err, updatedUser) => {
        if (err) {
           return res.status(500).json({ message: 'Erro ao atualizar o usuário.' });
        }
        res.status(200).json({ message: 'Usuário atualizado com sucesso.', updatedUser });
      });
    } else {
      return res.status(409).json({ message: 'Nome de Usuário já cadastrado.' });
    }
  })
};

exports.deleteUser = (req, res) => {
  let userId = req.params.id;

  userModel.deleteUser(userId, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao excluir o usuário.' });
    }
    res.status(200).json({ message: 'Usuário excluído com sucesso.' });
  });
};

exports.importUsers = async (req, res) => {
  try {

    const instance = await axios.create({
      headers: {
        'Connection': 'keep-alive'
      },
      httpAgent: new http.Agent({ keepAlive: true})
    });

    instance.defaults.timeout = 5000;

    const response = await instance.get('https://randomuser.me/api/?results=10');
    const users = response.data.results;

    for (const user of users) {
       let userData = {
        username: user.login.username,
        name: `${user.name.first} ${user.name.last}`,
        email: user.email,
        birthday: new Date(user.dob.date).toISOString().slice(0, 10),
        phone_number: user.phone,
        password: await bcrypt.hash(user.login.password, 10),
        picture: user.picture.thumbnail 
      };
    
      userModel.createUser(userData, (createErr, newUser) => {
        if (createErr) {
          console.error(createErr);
        }
      });

    }

    res.status(201).json({ message: 'Usuários importados com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao importar usuários.'  });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, pageSize = 20 } = req.query;
    const offset = (page - 1) * pageSize;
    const users = await userModel.getAllUsers(offset, pageSize);
    const { totalAllUsers } = await userModel.countAllUsers();

    res.status(200).json({totalAllUsers, users});
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter usuários.' });
  }
};

exports.getUserById = async (req, res) => {
  try {
 userModel.getUserById(req.params.id, (err, user) => {
      if (err) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      res.status(200).json(user);
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { field, value } = req.params;

    if (!field || !value) {
      return res.status(400).json({ error: 'Campos field e value são obrigatórios.' });
    }
    
    const users = await userModel.searchUsers(field, value);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};