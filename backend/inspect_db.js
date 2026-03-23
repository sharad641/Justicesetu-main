const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const db = new sqlite3.Database('d:/a2/1styear/Justicesetu-main/Justicesetu-main/backend/database.sqlite');

async function run() {
  const query = (sql) => new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  try {
    const data = {};
    data.users = await query('SELECT id, name, email, role FROM Users');
    data.cases = await query('SELECT * FROM Cases');
    data.consultations = await query('SELECT * FROM Consultations');
    
    fs.writeFileSync('db_output.json', JSON.stringify(data, null, 2));
    console.log('Data written to db_output.json');
  } catch (err) {
    console.error(err);
  } finally {
    db.close();
  }
}
run();
