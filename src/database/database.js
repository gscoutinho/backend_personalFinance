const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { db_path, dbModels } = require('./databaseModel.js');

async function connect() {
    return open({
        filename: db_path,
        driver: sqlite3.Database
    });
}

async function initDatabase() {
    const db = await connect()

    for (const table of dbModels.tables) {
        const exists = await checkTableExists(db, table.tableName)
        if (!exists) {
            await createTableFromModel(db, table)
        }
    }
    return db
}

async function checkTableExists(db, tableName) {
    return !!(await db.get(`SELECT name from sqlite_master WHERE type='table' AND name=?`, [tableName]))
}

async function createTableFromModel(db, table) {
    const columns = table.columns.map(col => {
        let colDef = `${col.name} ${col.type}`;
        if (col.primary) colDef += ` PRIMARY KEY`;
        if (col.autoincrement) colDef += ` AUTOINCREMENT`;
        if (col.notnull) colDef += ` NOT NULL`;
        return colDef;
    }).join(', ');

    const createTableSQL = `CREATE TABLE IF NOT EXISTS ${table.tableName} (${columns})`;
    await db.run(createTableSQL);
    console.log(`Table created or already exists: ${table.tableName}`);
}

async function dbInsertUser(db, user) {
    try {
        const createdAt = Date.now();
        const result = await db.run(
            `INSERT INTO users (name, password, createdAt) VALUES (?, ?, ?)`,
            [user.name, user.password, createdAt]
        );
        console.log('User created:', user);
        return { ...user, createdAt, id: result.lastID };
    } catch (err) {
        console.error('Error on creating new user:', err.message);
        throw err;  // Propaga o erro para ser tratado no nível superior
    }
}

async function dbInsertRegister(db, reg) {
    try {
        const createdAt = Date.now()
        const result = await db.run(
            `INSERT INTO registers (description, value, category, subcategory, timestamp, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
            [reg.description, reg.value, reg.category, reg.subcategory, reg.timestamp, createdAt]
        )
        console.log('reg created: ', reg)
        return { ...reg, createdAt, id: result.lastID }
    } catch (error) {
        console.error('Error in insert a register:', error.message)
        throw error
    }
}

async function dbInsertCategory(db, cat) {
    try {
        const createdAt = Date.now()
        const result = await db.run(
            `INSERT INTO categories (name, subcategories, createdAt) VALUES (?, ?, ?)`,
            [cat.name, cat.subcategories, createdAt]
        )
        console.log('cat created', cat)
        return { ...cat, createdAt, id: result.lastID }
    } catch (error) {
        console.error('Error on insert category:', error.message)
    }
}

async function dbSelect(db, table, filters) {
    try {
        const row = await db.get(`SELECT * FROM ${table} ${filters}`);
        console.log('Query successful:', row);
        return row;
    } catch (err) {
        console.error('Error in querying database:', err.message);
        throw err;  // Propaga o erro para ser tratado no nível superior
    }
}

async function dbUpdate(db, table, id, updates) {
    try {
        const setClauses = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updates)

        values.push(id)

        const result = await db.run(
            `UPDATE ${table} SET ${setClauses} WHERE id = ?`, values
        )
        console.log(`Record updated in table ${table} : `, id)
        return result
    } catch (error) {
        console.error(`Error in updating table ${table}: `, error.message)
        throw error
    }
}

async function dbDelete(db, table, id) {
    try {
        const result = await db.run(
            `DELETE FROM ${table} WHERE id = ?`, [id]
        )
        console.log(`Record deleted from ${table}: `, id)
    } catch (error) {
        console.error(`Error in deleting record form ${table} item ${id}: `, error.message)
    }
}

module.exports = {
    connect,
    initDatabase,
    dbInsertCategory,
    dbInsertRegister,
    dbInsertUser,
    dbSelect,
    dbUpdate,
    dbDelete
}