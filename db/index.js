import mysql from "mysql";

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'avatar',
    database: 'transaction',
    port: '3306',
});

let dbFunction = {};
dbFunction.helper = {};

dbFunction.helper.query = (select, table, where = null, limit = null, order = null) => {
    let Where, Limit, Order = null;

    if (where) Where = ` WHERE ${where}`;
    if (limit) Limit = ` LIMIT ${limit}`;
    if (order) Order = ` ORDER BY ${order}`;

    const Query = `SELECT ${select} FROM ${table} ${Where ? Where : ''} ${Limit ? Limit : ''} ${Order ? Order : ''}`;

    return new Promise((resolve, reject) => {
        pool.query(Query, (err, results) => {
            if (err) return reject(err);

            if (limit === 1) results = results[0];
            return resolve(results);
        })
    });
}

dbFunction.helper.exists = (table, where) => {
    const Query = `SELECT EXISTS(SELECT * FROM ${table} WHERE ${where})`;

    return new Promise((resolve, reject) => {
        pool.query(Query, (err, results) => {
            if (err) return reject(err);

            return resolve(results);
        })
    })
}

dbFunction.helper.insert = (table, data) => {
    let Keys = '';
    let Values = '';
    for (const key in data) {
        if (Keys.length > 0) Keys += ',';
        Keys += key;

        if (!data[key]) data[key] = "NULL";

        if (Values.length > 0) Values += ',';
        if (typeof data[key] === "number" || data[key] === "NULL") Values += data[key];
        if (typeof data[key] === "string" && data[key] !== "NULL") Values += `"${data[key]}"`;
    }

    const Query = `INSERT INTO ${table} (${Keys}) VALUES (${Values})`;

    return new Promise((resolve, reject) => {
        pool.query(Query, (err, results) => {
            if (err) return reject(err);

            return resolve(results.affectedRows > 0 ? results.insertId : false);
        })
    })
}

dbFunction.helper.update = (table, data, where) => {
    let Data = '';
    for (const key in data) {
        if (!data[key]) data[key] = "NULL";

        if (Data.length > 0) Data += ',';
        if (typeof data[key] === "number" || data[key] === "NULL") Data += `${key}=${data[key]}`;
        if (typeof data[key] === "string" && data[key] !== "NULL") Data += `${key}='${data[key]}'`;
    }

    const Query = `UPDATE ${table} SET ${Data} WHERE ${where}`;

    return new Promise((resolve, reject) => {
        pool.query(Query, (err, results) => {
            if (err) return reject(err);

            return resolve(results.affectedRows > 0);
        })
    })
}

dbFunction.helper.delete = (table, where) => {
    const Query = `DELETE FROM ${table} WHERE ${where}`;

    return new Promise((resolve, reject) => {
        pool.query(Query, (err, results) => {
            if (err) return reject(err);

            return resolve(results.affectedRows > 0);
        })
    })
}

export default dbFunction;