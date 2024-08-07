const { query } = require('express');
const {
  connect,
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
    if (existingCategory.length > 0){
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
      if (cat.length > 0) {
        res.status(201).json({ return: cat })
      } else {
        res.status(404).json({ return: 'Category not found in database' })
      }
    }
    if (req.query.name && req.query.type === "2") {
      const queryCats = (req.query.name).split(',')
      const filter = `WHERE ` + queryCats.map(i => `name LIKE '%${i}%'`).join(' OR ')
      const cats = await dbSelect(db, 'categories', filter)
      if (cats.length > 0) {
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

async function createReg(req, res){
try {
  const db = await connect()
  const reg = {
    description: req.body.description,
    value: req.body.value,
    category: req.body.category,
    subcategory: req.body.subcategory,
    timestamp: Date.parse(req.body.timestamp)
  }
  const newReg = await dbInsertRegister(db, reg)
  if(newReg) {
    res.status(201).json({
      message: "Reg created successfully.",
      reg: newReg
    })
  }else{
    res.status(500).json({error: `unable to insert reg into database`})
  }

  await db.close()
} catch (error) {
  res.status(500).json({error: `controller layer - ${error.message}`})
}
}
async function getRegsAll(req, res){
  try {
    if(req.params.id !== "all"){
      throw new Error('Invalid params')
    }
    const db = await connect()
    const regs = await dbSelect(db, 'registers', '')
    if (regs.length > 0) {
      res.status(201).json({return: regs})
    }else{
      res.status(404).json({return: 'Registers not found in database.'})
    }
    await db.close()
  } catch (error) {
    res.status(500).json({error: `controller layer - ${error.message}`})
  }
}
async function getRegs(req, res){
  try {
    const db = await connect()

    const filterPeriod = req.query.period 
    ? `WHERE timestamp >= ${Date.parse(req.query.startDate)} AND timestamp <= ${Date.parse(req.query.endDate)}` 
    : ""
    
    const filterValue = req.query.betweenValue
    ? `AND WHERE value >= ${req.query.lowValue} AND value <= ${req.query.highValue}`
    : req.query.lssgtrValue
    ? `AND WHERE value ${req.query.operator} ${req.query.filterValue}`
    : ""

    const filterCategory = req.query.category
    ? `AND WHERE category=${req.query.catValue}`
    : req.query.categories
    ? `AND WHERE ` + (req.query.categoriesValue).split(',').map(i => `category LIKE '%${i}%'`).join(' OR ')
    : ""

    const filterSubCategories = req.query.subcategory
    ? `AND WHERE subcategory = ${req.query.subcategoryValue}`
    : req.query.subcategories
    ? `AND WHERE ` + (req.query.subcategoriesValue).split(',').map(i => `subcategory LIKE '%${i}%'`).join(' OR ')
    : ""

    const filter = filterPeriod + 
    filterValue + 
    filterCategory +  
    filterSubCategories

    if(req.query.filter){
      const regs = await dbSelect(db, 'registers', filter)
      if (regs.length > 0) {
        res.status(201).json({return: regs})
      }else{
        res.status(404).json({return: 'Registers not found in database.'})
      }
    }else{
      throw new Error(`code 400 - bad input from client`)
    }
    await db.close()
  } catch (error) {
    res.status(500).json({error: `controller layer - ${error.message}`})
  }
}

module.exports = {
  getUser,
  createUser,
  createCategory,
  getCategory,
  createReg,
  getRegs,
  getRegsAll
}