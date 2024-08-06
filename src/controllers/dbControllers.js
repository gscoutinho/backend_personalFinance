const { query } = require('express');
const {
  connect,
  initDatabase,
  dbInsertCategory,
  dbInsertRegister,
  dbInsertUser,
  dbSelect,
  dbUpdate,
  dbDelete
} = require('../database/database.js')


async function getUser(req, res) {
  try {
    const db = await connect()
    const user = await dbSelect(db, 'users', `WHERE name='${req.body.name}'`);
    (await db).close()
    if (user !== undefined) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ "message": 'User does not exist' })
    }
  } catch (error) {
    res.status(500).json({ "error": `controller layer - ${error.message}` })
  }
}

async function createUser(req, res) {
  try {
    const newUserName = req.body.name
    const newUserPassword = req.body.password

    const db = await connect()
    const existingUser = await dbSelect(db, 'users', `WHERE name='${newUserName}'`)

    if (existingUser !== undefined) {
      res.status(403).json({ message: "User already exists in system" })
    } else {
      const newUser = await dbInsertUser(db, { name: newUserName, password: newUserPassword })
      res.status(200).json({ message: "User created succesfully." })
    }
    (await db).close()
  } catch (error) {
    res.status(500).json({ "error": `controller layer - ${error.message}` })
  }
}

async function createCategory(req, res) {
  try {
    const newCategoryName = req.body.name
    const newSubcategories = req.body.subcategories.map(i => i).join(', ')
    const db = await connect()
    const existingCategory = await dbSelect(db, 'categories', `WHERE name='${newCategoryName}'`)
    if (existingCategory !== undefined) {
      res.status(403).json({ message: "Category already exists in system" })
    } else {
      const newCategory = await dbInsertCategory(db, { name: newCategoryName, subcategories: newSubcategories })
      res.status(200).json({ message: "Category created successfully.", category: newCategory })
    }
    (await db).close()
  } catch (error) {
    res.status(500).json({ error: `controller layer - ${error.message}` })
  }
}

async function getCategory(req, res) {
  try {
    const db = await connect()
    if (req.query.type && req.query.type === "all") {
      const cats = await dbSelect(db, 'categories', '')
      res.status(201).json({ return: cats })
    }
    if (req.query.name && !req.query.type) {
      const cat = await dbSelect(db, 'categories', `WHERE name LIKE '%${req.query.name}%'`)
      if (cat !== undefined) {
        res.status(201).json({ return: cat })
      } else {
        res.status(404).json({ return: 'Category not found in database' })
      }
    }
    if (req.query.name && req.query.type === "2") {
      const queryCats = (req.query.name).split(',')
      const filter = `WHERE ` + queryCats.map(i => `name LIKE '%${i}%'`).join(' OR ')
      const cats = await dbSelect(db, 'categories', filter)
      if (cats !== undefined) {
        res.status(201).json({ return: cats })
      } else {
        res.status(404).json({ return: "Categories not found in database" })
      }
    }
    await db.close()
  } catch (error) {
    res.status(500).json({ error: `controller layer - ${error.message}` })
  }
}

module.exports = {
  getUser,
  createUser,
  createCategory,
  getCategory
}

// exports.getAllPessoas = (req, res) => {
//   db.all('SELECT * FROM pessoas', [], (err, rows) => {
//     if (err) {
//       res.status(500).send(err.message);
//     } else {
//       res.json(rows);
//     }
//   });
// };

// exports.addPessoa = (req, res) => {
//   const { nome, idade } = req.body;
//   if (!nome || !idade) {
//     res.status(400).send('Nome e idade são obrigatórios');
//     return;
//   }
//   const insert = 'INSERT INTO pessoas (nome, idade) VALUES (?, ?)';
//   db.run(insert, [nome, idade], function (err) {
//     if (err) {
//       res.status(500).send(err.message);
//     } else {
//       res.status(201).json({ id: this.lastID });
//     }
//   });
// };

// exports.getPessoaById = (req, res) => {
//   const id = req.params.id;
//   db.get('SELECT * FROM pessoas WHERE id = ?', [id], (err, row) => {
//     if (err) {
//       res.status(500).send(err.message);
//     } else if (!row) {
//       res.status(404).send('Pessoa não encontrada');
//     } else {
//       res.json(row);
//     }
//   });
// };

// exports.updatePessoaById = (req, res) => {
//   const id = req.params.id;
//   const { nome, idade } = req.body;
//   if (!nome || !idade) {
//     res.status(400).send('Nome e idade são obrigatórios');
//     return;
//   }
//   const update = 'UPDATE pessoas SET nome = ?, idade = ? WHERE id = ?';
//   db.run(update, [nome, idade, id], function (err) {
//     if (err) {
//       res.status(500).send(err.message);
//     } else if (this.changes === 0) {
//       res.status(404).send('Pessoa não encontrada');
//     } else {
//       res.status(200).send('Pessoa atualizada com sucesso');
//     }
//   });
// };

// exports.deletePessoaById = (req, res) => {
//   const id = req.params.id;
//   const del = 'DELETE FROM pessoas WHERE id = ?';
//   db.run(del, id, function (err) {
//     if (err) {
//       res.status(500).send(err.message);
//     } else if (this.changes === 0) {
//       res.status(404).send('Pessoa não encontrada');
//     } else {
//       res.status(200).send('Pessoa deletada com sucesso');
//     }
//   });
// };
