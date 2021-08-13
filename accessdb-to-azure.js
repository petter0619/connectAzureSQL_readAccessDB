const { Sequelize } = require('sequelize');

// Database config
const userName = '<username>';
const password = '<passowrd>';
const hostName = '<host>';
const sampleDbName = '<database>';

const sequelize = new Sequelize(sampleDbName, userName, password, {
    dialect: 'mssql',
    host: hostName,
    port: 1433, // Default port
    logging: false, // disable logging; default: console.log
    dialectOptions: {
        encrypt: true,
        requestTimeout: 30000 // timeout = 30 seconds
    }
});

// SampleData Model
const AccessSampleTable = sequelize.define('AccessSampleTable', {
    // Model attributes are defined here
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    createdAt: {
        type: Sequelize.DATE,
    },
    updatedAt: {
        type: Sequelize.DATE,
    },
    // Non-auto ones...
    OldId: {
        type: Sequelize.INTEGER,
    },
    OrderDate: {
        type: Sequelize.DATE,
    },
    Region: {
        type: Sequelize.STRING,
    },
    Rep: {
        type: Sequelize.STRING,
    },
    Item: {
        type: Sequelize.STRING,
    },
    Units: {
        type: Sequelize.INTEGER,
    },
    UnitCost: {
        type: Sequelize.FLOAT,
    },
    TotalCost: {
        type: Sequelize.FLOAT,
    },
  }, {
    // Other model options go here
    tableName: 'AccessSampleTable'
});

// SampleCustomers JOINED WITH SampleOrders Model
const AccessSampleJoinTable = sequelize.define('AccessSampleJoinTable', {
    // Model attributes are defined here
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    createdAt: {
        type: Sequelize.DATE,
    },
    updatedAt: {
        type: Sequelize.DATE,
    },
    // Non-auto ones...
    CustomerID: {
        type: Sequelize.INTEGER,
    },
    FirstName: {
        type: Sequelize.STRING,
    },
    Age: {
        type: Sequelize.INTEGER,
    },
    Amount: {
        type: Sequelize.FLOAT,
    },
    OrderDate: {
        type: Sequelize.DATE,
    },
  }, {
    // Other model options go here
    tableName: 'AccessSampleJoinTable'
});

// Bulk add function
const azureSqlBulkCreate = async (rowArray, model) => {
    /* await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.close(); */

    await model.sync();
    const response = await model.bulkCreate(rowArray);
    console.log(response.length);
}

// Get the adodb module
var ADODB = require('node-adodb');
ADODB.debug = true;

// Connect to the MS Access DB
const accdbInRoot = 'SampleDB.accdb';
const mdbInRoot = 'SampleDB.mdb';
var accdbConnection = ADODB.open(`Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${accdbInRoot};Persist Security Info=False;`);
var mdbConnection = ADODB.open(`Provider=Microsoft.Jet.OLEDB.4.0;Data Source=${mdbInRoot};`);

async function query(connection) {
    try {
        // ------ SampleData Table (straight transfer) ------
        /*
        const data = await connection.query('SELECT * FROM SampleData;');
        const json = JSON.stringify(data, null, 2);
        const azureData = data.map(accessRow => {
            accessRow.OldId = accessRow.ID;
            delete accessRow.ID;
            return accessRow;
        });
        azureSqlBulkCreate(azureData, AccessSampleTable);
        */
        
        // ----- SampleCustomer & SampleOrders Table (JOIN > Transfer) -----

        // ------ Method 1: T-SQL ------
        const sql_query = 'SELECT A.ID, A.FirstName, A.Age, B.Amount, B.OrderDate FROM SampleCustomers A INNER JOIN SampleOrders B ON A.ID = B.Customer_ID;';
        const data = await connection.query(sql_query);

        const azureJoinData = data.map(accessRow => {
            accessRow.CustomerID = accessRow.ID;
            delete accessRow.ID;
            return accessRow;
        });
        azureSqlBulkCreate(azureJoinData, AccessSampleJoinTable);

        // ------ Method 2: Javascript ------
        /* const sampleCustomersData = await connection.query('SELECT * FROM SampleCustomers;');
        const sampleOrdersData = await connection.query('SELECT * FROM SampleOrders;');
        
        const newAzureTable = sampleOrdersData.map(order => {
            const matchingCustomer = sampleCustomersData.find(customer => customer.ID === order.Customer_ID);
            return {
                CustomerID: order.Customer_ID,
                FirstName: matchingCustomer.FirstName || null,
                Age: matchingCustomer.Age || null,
                Amount: order.Amount,
                OrderDate: order.OrderDate,
            }
        });

        azureSqlBulkCreate(newAzureTable, AccessSampleJoinTable); */

    } catch (error) {
        console.error(error);
    }
}
       
query(mdbConnection);

const exampleAccessObj = {
    ID: 43,
    OrderDate: '2021-12-20T23:00:00Z',
    Region: 'Central',
    Rep: 'Andrews',
    Item: 'Binder',
    Units: 28,
    UnitCost: 4.99,
    TotalCost: 139.72
}
