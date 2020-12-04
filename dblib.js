
require("dotenv").config();

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const getTotalRecords = () => {
    sql = "SELECT COUNT(*) FROM car";
    return pool.query(sql)
        .then(result => {
            return {
                msg: "success",
                totRecords: result.rows[0].count
            }
        })
        .catch(err => {
            return {
                msg: `Error: ${err.message}`
            }
        });
};

const insertCar = (car) => {
    
    if (car instanceof Array) {
        params = car;
    } else {
        params = Object.values(car);
    };

    const sql = `INSERT INTO car (carvin, carmake, carmodel, carmileage)
                 VALUES ($1, $2, $3, $4)`;

    return pool.query(sql, params)
        .then(res => {
            return {
                trans: "success", 
                msg: `car id ${params[0]} successfully inserted`
            };
        })
        .catch(err => {
            return {
                trans: "fail", 
                msg: `Error on insert of car id ${params[0]}.  ${err.message}`
            };
        });
};


const findCar = (car) => {
    

    var i = 1;
    params = [];
    sql = "SELECT * FROM car WHERE true";


    if (car.carvin !== "") {
        params.push(parseInt(car.carvin));
        sql += ` AND carvin = $${i}`;
        i++;
    };
    if (car.carmake !== "") {
        params.push(`${car.carmake}%`);
        sql += ` AND UPPER(carmake) LIKE UPPER($${i})`;
        i++;
    };
    if (car.carmodel !== "") {
        params.push(`${car.carmodel}%`);
        sql += ` AND UPPER(carmodel) LIKE UPPER($${i})`;
        i++;
    };
    if (car.carmileage !== "") {
        params.push(parseFloat(car.carmileage));
        sql += ` AND carmileage >= $${i}`;
        i++;
    };

    sql += ` ORDER BY carvin`;

     console.log("sql: " + sql);
     console.log("params: " + params);

    return pool.query(sql, params)
        .then(result => {
            return { 
                trans: "success",
                result: result.rows
            }
        })
        .catch(err => {
            return {
                trans: "Error",
                result: `Error: ${err.message}`
            }
        });
};

module.exports.findCar = findCar;
module.exports.insertCar = insertCar;
module.exports.getTotalRecords = getTotalRecords;