const mysql = require('mysql');
const { GoogleAuth } = require('google-auth-library');

const googleAuth = new GoogleAuth({
  keyFilename: './cloud-computing-382208-77dd0a6ce1c4.json',
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

// Function to create a connection pool
async function createConnectionPool() {
  const client = await googleAuth.getClient();
  const accessToken = await client.getAccessToken();

  const pool = mysql.createPool({
    connectionLimit: 10,
    user: process.env.CLOUD_SQL_USERNAME,
    database: process.env.CLOUD_SQL_DATABASE_NAME,
    host: '35.189.67.2',
    //host: '127.0.0.1',
    port: 3306,
    ssl: {
      rejectUnauthorized: false,
    },
    authSwitchHandler: (data, cb) => {
      if (data.pluginName === 'dialog') {
        cb(null, Buffer.from(accessToken + '\0'));
      }
    },
  });

  return pool;
}

// Function to get all orase from the database
async function getAllOrase() {
  const pool = await createConnectionPool();

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      connection.query('SELECT * FROM orasedb.orase', (error, results) => {
        connection.release();
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  });
}

async function postOrase(nume, tara, latitude, longitude) {
    const pool = await createConnectionPool();
  
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }
  
        const query = 'INSERT INTO orasedb.orase (nume, tara, latitude, longitude) VALUES (?, ?, ?, ?)';
        connection.query(query, [nume, tara, latitude, longitude], (error, results) => {
          connection.release();
          if (error) {
            reject(error);
            return;
          }
          resolve(results.insertId);
        });
      });
    });
  }
  async function putOrase(id, nume, tara, latitude, longitude) {
    const pool = await createConnectionPool();
  
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }
  
        const query = 'UPDATE orasedb.orase SET nume = ?, tara = ?, latitude = ?, longitude = ? WHERE oras_id = ?';
        connection.query(query, [nume, tara, latitude, longitude, id], (error, results) => {
          connection.release();
          if (error) {
            reject(error);
            return;
          }
          resolve(results.changedRows > 0);
        });
      });
    });
  }

async function deleteOrase(id) {
    const pool = await createConnectionPool();
  
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }
        const query = 'DELETE FROM orasedb.orase WHERE oras_id = ?';
        connection.query(query, [id], (error, results) => {
          connection.release();
          if (error) {
            // Return an error if there was a problem executing the query
            reject(error);
            return;
          }
          // Resolve with a boolean indicating whether a record was deleted or not
          resolve(results.affectedRows > 0);
        });
      });
    });
  }

module.exports = { createConnectionPool, getAllOrase, postOrase, putOrase, deleteOrase };