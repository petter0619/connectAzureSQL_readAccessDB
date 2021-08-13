const { Connection, Request } = require("tedious");
var TYPES = require('tedious').TYPES;
const async = require('async');

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "<username>", // update me
      password: "<password>" // update me
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

function createSchema(callback) {
	console.log("Creating Schema");

	request = new Request(
		'CREATE SCHEMA TestSchema;',
		function(err) {
			if (err) {
				callback(err);
			} else {
				console.log('Schema created');
			}
		}
	);
	// Execute SQL statement
	connection.execSql(request);
}

function createTable(callback) {
	console.log("Creating table");

	request = new Request(
		'CREATE TABLE IF NOT EXISTS TestSchema.Employees (Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY, Name NVARCHAR(50), Location NVARCHAR(50));',
		function(err) {
			if (err) {
				callback(err);
			} else {
				console.log('Table creaetd');
			}
		}
	);
	// Execute SQL statement
	connection.execSql(request);
}

function Start(callback) {
	console.log('Starting...');
  callback(null, 'Jake', 'United States');
}

function Insert(name, location, callback) {
	console.log("Inserting '" + name + "' into Table...");

	request = new Request(
		'INSERT INTO TestSchema.Employees (Name, Location) OUTPUT INSERTED.Id VALUES (@Name, @Location);',
		function(err, rowCount, rows) {
			if (err) {
				callback(err);
			} else {
				console.log(rowCount + ' row(s) inserted');
				callback(null, 'Nikita', 'United States');
			}
		}
	);
	request.addParameter('Name', TYPES.NVarChar, name);
	request.addParameter('Location', TYPES.NVarChar, location);

	// Execute SQL statement
	connection.execSql(request);
}

function Update(name, location, callback) {
	console.log("Updating Location to '" + location + "' for '" + name + "'...");

	// Update the employee record requested
	request = new Request(
	'UPDATE TestSchema.Employees SET Location=@Location WHERE Name = @Name;',
	function(err, rowCount, rows) {
		if (err) {
			callback(err);
		} else {
			console.log(rowCount + ' row(s) updated');
			callback(null, 'Jared');
		}
	});
	request.addParameter('Name', TYPES.NVarChar, name);
	request.addParameter('Location', TYPES.NVarChar, location);

	// Execute SQL statement
	connection.execSql(request);
}

function Delete(name, callback) {
	console.log("Deleting '" + name + "' from Table...");

	// Delete the employee record requested
	request = new Request(
			'DELETE FROM TestSchema.Employees WHERE Name = @Name;',
			function(err, rowCount, rows) {
			if (err) {
					callback(err);
			} else {
					console.log(rowCount + ' row(s) deleted');
					callback(null);
			}
			});
	request.addParameter('Name', TYPES.NVarChar, name);

	// Execute SQL statement
	connection.execSql(request);
}

function Read(callback) {
	console.log('Reading rows from the Table...');

	// Read all rows from table
	request = new Request(
	'SELECT Id, Name, Location FROM TestSchema.Employees;',
	function(err, rowCount, rows) {
		if (err) {
			callback(err);
		} else {
			console.log(rowCount + ' row(s) returned');
			callback(null);
		}
	});

	// Print the rows read
	var result = "";
	request.on('row', function(columns) {
		columns.forEach(function(column) {
			if (column.value === null) {
				console.log('NULL');
			} else {
				result += column.value + " ";
			}
		});
		console.log(result);
		result = "";
	});

	// Execute SQL statement
	connection.execSql(request);
}

function Complete(err, result) {
	if (err) {
			console.error(err);
	} else {
			console.log("Done!");
	}
}

connection.on("connect", err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('connected');

	// Execute all functions in the array serially
    async.waterfall([
		Start,
		Insert,
		Update,
		Delete,
		Read
	], Complete)
  }
});

connection.connect();
