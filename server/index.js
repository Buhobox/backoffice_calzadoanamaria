const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3002;

app.use(cors({
  origin: 'http://localhost:3000'
}));

const sslCertPath = path.join(__dirname, 'DigiCertGlobalRootG2.crt.pem');

const dbConfig = {
  host: 'sotosoftflex.mysql.database.azure.com',
  user: 'paginaweb',
  password: 'Xytwe$689RS!',
  database: 'servidor ari4.0.ama',
  ssl: {
    ca: fs.readFileSync(sslCertPath),
  },
};

const connection = mysql.createConnection(dbConfig);

app.get('/api/items', (req, res) => {
  const query = `
    SELECT * 
    FROM pucapiview 
    ORDER BY Subcuentauxiliarnumero
  `;

  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});
