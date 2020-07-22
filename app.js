const createTable = async (pool, tableName) => {
    console.log('createTable');
    try {
        await pool.query(`
            CREATE TABLE ${tableName} (
                id serial NOT NULL, 
                name VARCHAR(50), 
                email VARCHAR(50)
            )
        `);
        return true;
    } catch(err) {
        console.log(err);
        return false;
    }
}

const insertData = async (pool, payload, tableName) => {
    console.log('insertData');
    try {
        await pool.query('BEGIN');
        await pool.query(`
            INSERT INTO ${tableName} (name, email) 
            VALUES(
                '${payload.name}', 
                '${payload.email}'
            )
        `);
        await pool.query('COMMIT');
        return true;
    } catch(err) {
        console.log(err);
        await pool.query('ROLLBACK');
        return false;
    }
}

const main = async () => {

    const { Pool, Client } = require('pg');
     
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'db',
        password: 'postgres',
        port: 5432
    });

    const tableName = 'table1';

    const payload = {
        name: 'Iam',
        email: 'myself@meyself.com'
    };

    if (!(await insertData(pool, payload, tableName))) {
        if (await createTable(pool, tableName)) {
            await insertData(pool, payload, tableName);
        }
    }

    // try {
    //     console.log('res:', await pool.query('SELECT * FROM social;'));
    // } catch(err) {
    //     console.log(err);
    // }

    await pool.end()

    process.exit(0);
}

main();
