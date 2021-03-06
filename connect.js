const { Connection, Request } = require("tedious");

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "<username>", // update me
      password: "<passowrd>" // update me
    },
    type: "default"
  },
  server: "<server>", // update me
  options: {
    database: "<database>", //update me
    encrypt: true
  }
};

/* 
    //Use Azure VM Managed Identity to connect to the SQL database
    const connection = new Connection({
    server: process.env["db_server"],
    authentication: {
        type: 'azure-active-directory-msi-vm',
    },
    options: {
        database: process.env["db_database"],
        encrypt: true,
        port: 1433
    }
});
    //Use Azure App Service Managed Identity to connect to the SQL database
    const connection = new Connection({
    server: process.env["db_server"],
    authentication: {
        type: 'azure-active-directory-msi-app-service',
    },
    options: {
        database: process.env["db_database"],
        encrypt: true,
        port: 1433
    }
});

*/

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('connected');
  }
});

connection.connect();
