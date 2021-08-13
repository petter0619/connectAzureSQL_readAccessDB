// Get the adodb module
var ADODB = require('node-adodb');
ADODB.debug = true;

const fileInRoot = 'SampleDB.mdb'

// Connect to the MS Access DB
var connection = ADODB.open(`Provider=Microsoft.Jet.OLEDB.4.0;Data Source=${fileInRoot};`);

/*
.mdb files: 'Provider=Microsoft.Jet.OLEDB.4.0;Data Source=node-adodb.mdb;'
.accdb files: 'Provider=Microsoft.ACE.OLEDB.12.0;Data Source=node-adodb.accdb;Persist Security Info=False;'
*/

// StackOverflow: https://stackoverflow.com/questions/21426935/accessing-mdb-files-through-nodejs
// Pacakge NPM: https://www.npmjs.com/package/node-adodb

// Query the DB
/* connection
    .query('SELECT * FROM SampleData;')
    .then(data => {
        console.log(data);
    })
    .catch(err => console.error(err)); */

async function query() {
    try {
        const data = await connection.query('SELECT * FROM SampleData;');
        const json = JSON.stringify(data, null, 2);
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}
       
query();
