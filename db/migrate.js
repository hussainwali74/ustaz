const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

(async () => {

    const db = await sqlite.open({
        filename: './db/database.db',
        driver: sqlite3.Database
    })

    await db.migrate({
        migrationsPath: "./db/migrations"
    })
})()
