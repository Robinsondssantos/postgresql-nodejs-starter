const createTable = async (pool) => {
    console.log('createTable');
    try {
        await pool.query(`
            CREATE TABLE social (
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

const insertData = async (pool) => {
    console.log('insertData');
    try {
        await pool.query('BEGIN');
        await pool.query("INSERT INTO social (name, email) VALUES('eu', 'eu@eumesmo.com')");
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

    if (!(await insertData(pool))) {
        if (await createTable(pool)) {
            await insertData(pool);
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
