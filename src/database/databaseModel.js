const db_path = 'src/database/personalFinance.db'

const dbModels = {
    "tables":[
        {
            "tableName": "users",
            "columns":[
                {"name": "id", "type": "INTEGER", "primary": true, "autoincrement": true},
                {"name": "name", "type": "TEXT", "notnull": true},
                {"name": "password", "type": "TEXT", "notnull": true},
                {"name": "createdAt", "type": "REAL", "notnull": true}
            ]
        },
        {
            "tableName": "categories",
            "columns":[
                {"name": "id", "type": "INTEGER", "primary": true, "autoincrement": true},
                {"name": "name", "type": "TEXT", "notnull": true},
                {"name": "subcategories", "type": "TEXT"},
                {"name": "createdAt", "type": "REAL", "notnull": true}
            ]
        },
        {
            "tableName": "registers",
            "columns":[
                {"name": "id", "type": "INTEGER", "primary": true, "autoincrement": true},
                {"name": "description", "type": "TEXT", "notnull": true},
                {"name": "value", "type": "REAL", "notnull": true},
                {"name": "category", "type": "text", "notnull": true},
                {"name": "subcategory", "type": "text", "notnull": true},
                {"name": "timestamp", "type": "REAL", "notnull": true},
                {"name": "createdAt", "type": "REAL", "notnull": true}
            ]
        },
        {
            "tableName": "cashflow",
            "columns":[
                {"name": "id", "type": "INTEGER", "primary": true, "autoincrement": true},
                {"name": "description", "type": "TEXT", "notnull": true},
                {"name": "value", "type": "REAL", "notnull": true},
                {"name": "timestamp", "type": "TEXT", "notnull": true}, //W1M7Y24
                {"name": "createdAt", "type": "REAL", "notnull": true}
            ]
        }
    ]
}


module.exports = {
    dbModels,
    db_path
}