const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: '', // Replace with your MySQL password
  database: 'aiis' // Replace with the name of your MySQL database
});

// Enable CORS middleware
app.use(cors());

// Parse incoming request bodies in JSON format
app.use(bodyParser.json());

///REGISTRATION OF USERS
app.post('/register', (req, res) => {
  const {
    aiis_pin,
    aiis_fullname,
    aiis_surname,
    aiis_email,
    aiis_password,
    aiis_gender,
    aiis_category,
    aiis_contact,
  } = req.body;

  const sql = 'INSERT INTO register (`aiis_pin`, `aiis_fullname`, `aiis_surname`, `aiis_email`, `aiis_password`, `aiis_gender`, `aiis_category`, `aiis_contact`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

  // Execute the SQL query with the provided user information
  connection.query(sql, [aiis_pin, aiis_fullname, aiis_surname, aiis_email, aiis_password, aiis_gender, aiis_category, aiis_contact], (err, result) => {
    if (err) {
      // Registration failed
      res.status(500).json({ message: 'Error during registration', error: err });
    } else {
      // Registration successful
      res.json({ message: 'success' });
    }
  });
});



//  ///HANDLE LOGIN OF USERS
app.post('/login', (req, res) => {
  const { aiis_fullname, aiis_password } = req.body;

  // Query the database to check if the user exists and the password is correct
  const query = `SELECT * FROM register  WHERE aiis_fullname = '${aiis_fullname}' AND aiis_password = '${aiis_password}' LIMIT 1`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ message: 'Failed To Login', error: err });
    }

    else {
      // User is authenticated, send a success response
      res.send({ message: 'success' });
    }
  });
});

///HANDLE PROFILE OF USERS
// app.get('/profile', (req, res) => {
//   const { Pin } = req.body;

//   // Query the database to check if the user exists and the password is correct
//   const query = `SELECT * FROM register  WHERE aiis_fullname = '${Pin}'`;
//   connection.query(query, (err, results) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Internal server error');
//       return;
//     }

//     if (results.length === 0) {
//       res.status(401).json({ message: 'Failed To Fetch', error: err });
//     }

//     else {
//       // User is authenticated, send a success response
//       res.send({ message: 'success', data: results });
//     }
//   });
// });


app.post('/profile', function (req, res) {
  const Pin = req.body.Pin; // Get the value of 'Pin' from the request body

  // Construct the SQL query with a WHERE clause to fetch the specific row
  const query = 'SELECT * FROM register WHERE aiis_fullname = ?';

  // Execute the query with the provided 'Pin' as a parameter
  connection.query(query, [Pin], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.status(500).send('Error fetching data');
    } else {
      if (rows.length > 0) {
        // If a row is found, send it as the API response
        res.send(rows[0]);
        console.log("Rows Found")
      } else {
        // If no row is found with the given 'Pin', send an appropriate response
        res.status(404).send('Row not found');
      }
    }
  });
});


app.get('/location', function (req, res) {
  // Construct the SQL query to fetch the specific row
  const query = 'SELECT * FROM location';

  // Execute the query
  connection.query(query, function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.status(500).send('Error fetching data');
    } else {
      if (rows.length > 0) {
        // If a row is found, create a new object with only the 'aiis_name' and 'aiis_coordinate' fields
        const result = rows.map(row => ({
          aiis_pin: row.aiis_pin,
          aiis_community: row.aiis_community,
          aiis_coordinate: row.aiis_coordinate
        }));

        // Send the new object as the API response
        res.send(JSON.stringify(rows));
        console.log("Rows Found")
      } else {
        // If no row is found, send an empty response
        res.status(404).send('Row not found');
      }
    }
  });
});



app.get('/approvals', function (req, res) {
  // Construct the SQL query to fetch the specific row
  const query = "SELECT * FROM livestockmarket WHERE status = 'Not Approved'";

  // Execute the query
  connection.query(query, function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.status(500).send('Error fetching data');
    } else {
      if (rows.length > 0) {
        // If a row is found, create a new object with only the 'aiis_name' and 'aiis_coordinate' fields
        const result = rows.map(row => ({
          aiis_name: row.aiis_name,
          aiis_coordinate: row.aiis_coordinate
        }));

        // Send the new object as the API response
        res.send(JSON.stringify(rows));
        console.log("Rows Found")
      } else {
        // If no row is found, send an empty response
        res.status(404).send('Row not found');
      }
    }
  });
});

app.get('/approved', function (req, res) {
  // Construct the SQL query to fetch the specific row
  const query = "SELECT * FROM livestockmarket WHERE status = 'Approved'";

  // Execute the query
  connection.query(query, function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.status(500).send('Error fetching data');
    } else {
      if (rows.length > 0) {
        // If a row is found, create a new object with only the 'aiis_name' and 'aiis_coordinate' fields
        const result = rows.map(row => ({
          aiis_name: row.aiis_name,
          aiis_coordinate: row.aiis_coordinate
        }));

        // Send the new object as the API response
        res.send(JSON.stringify(rows));
        console.log("Rows Found")
      } else {
        // If no row is found, send an empty response
        res.status(404).send('Row not found');
      }
    }
  });
});







// ///set approvals
// app.post('/setapprovals', (req, res) => {
//   const { status } = req.body;

//   const sql = 'UPDATE livestockmarket SET status = ? Where status = "Not Approved"';

//   // Execute the SQL query to update the status
//   connection.query(sql, [status], (err, result) => {
//     if (err) {
//       // Update failed
//       res.status(500).json({ message: 'Error during update', error: err });
//     } else {
//       // Update successful
//       res.json({ message: 'success' });
//     }
//   });
// });


// app.post('/setapprovals', (req, res) => {
//   const { id, status } = req.body;

//   // First, select the records with the specified ID and status "Not Approved"
//   const selectSql = 'SELECT * FROM livestockmarket WHERE status = "Not Approved"';

//   connection.query(selectSql, [id], (err, selectResult) => {
//     if (err) {
//       res.status(500).json({ message: 'Error during select', error: err });
//     } else if (selectResult.length === 0) {
//       res.status(404).json({ message: 'Record not found or status is not "Not Approved"' });
//     } else {
//       // Record found and status is "Not Approved," now update its status
//       const updateSql = 'UPDATE livestockmarket SET status = ?  Where status = "Not Approved"';

//       connection.query(updateSql, [status, id], (err, updateResult) => {
//         if (err) {
//           res.status(500).json({ message: 'Error during update', error: err });
//         } else {
//           res.json({ message: 'Update successful' });
//         }
//       });
//     }
//   });
// });

app.post('/setapprovals', (req, res) => {
  const { id } = req.body; // Assuming you have an "id" to identify the record

  const sql = 'UPDATE livestockmarket SET status = "Approved" WHERE id = ? AND status = "Not Approved"';

  // Execute the SQL query to update the status of the specific record
  connection.query(sql, [id], (err, result) => {
    if (err) {
      // Update failed
      res.status(500).json({ message: 'Error during update', error: err });
    } else {
      // Update successful
      res.json({ message: 'Success' });
    }
  });
});






// app.post('/setapprovals', (req, res) => {
//   const { id, status } = req.body;

//   const sql = 'UPDATE livestockmarket SET status = ? WHERE status = "Not Approved"';

//   // Execute the SQL query to update the status
//   connection.query(sql, [status, id], (err, result) => {
//     if (err) {
//       // Update failed
//       res.status(500).json({ message: 'Error during update', error: err });
//     } else {
//       // Check if any rows were affected by the update
//       if (result.affectedRows == 0) {
//         res.status(404).json({ message: 'Row not found' });
//       } else {
//         // Update successful
//         res.json({ message: 'success' });
//       }
//     }
//   });
// });










//DELETE DipRecord
// app.post("/deleteDipRecord", function (req, res) {
//   const { postId } = req.body; // Get the value of 'Pin' from the request body
//   console.log("UI TO SERVER " + postId);
//   // Construct the SQL query with a WHERE clause to fetch the specific row
//   const query = "DELETE FROM livestockmarket WHERE id = ?";

//   // Execute the query with the provided 'Pin' as a parameter
//   connection.query(query, [postId], function (error, results) {
//     if (error) {
//       console.log(error);
//       res.status(500).send("Error deleting data");
//     } else {
//       if (results.affectedRows > 0) {
//         // If a row is deleted, send a success response
//         res.json({ message: "Row deleted successfully" });
//         console.log("Row Deleted");
//       } else {
//         // If no row is found with the given 'aiis_id', send an appropriate response
//         res.status(404).json({ message: "Row not found" });
//       }
//     }
//   });
// });




app.get('/unverified', function (req, res) {
  // Construct the SQL query to fetch the specific row
  const query = 'SELECT * FROM location WHERE status = "Not Verified"';

  // Execute the query
  connection.query(query, function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.status(500).send('Error fetching data');
    } else {
      if (rows.length > 0) {
        // If a row is found, create a new object with only the 'aiis_name' and 'aiis_coordinate' fields
        const result = rows.map(row => ({
          aiis_pin: row.aiis_pin,
          aiis_community: row.aiis_community,
          aiis_coordinate: row.aiis_coordinate
        }));

        // Send the new object as the API response
        res.send(JSON.stringify(rows));
        console.log("Rows Found")
      } else {
        // If no row is found, send an empty response
        res.status(404).send('Row not found');
      }
    }
  });
});


app.get('/verified', function (req, res) {
  // Construct the SQL query to fetch the specific row
  const query = 'SELECT * FROM location WHERE status = "Verified"';

  // Execute the query
  connection.query(query, function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.status(500).send('Error fetching data');
    } else {
      if (rows.length > 0) {
        // If a row is found, create a new object with only the 'aiis_name' and 'aiis_coordinate' fields
        const result = rows.map(row => ({
          aiis_pin: row.aiis_pin,
          aiis_community: row.aiis_community,
          aiis_coordinate: row.aiis_coordinate,
          date: row.date
        }));

        // Send the new object as the API response
        res.send(JSON.stringify(rows));
        console.log("Rows Found")
      } else {
        // If no row is found, send an empty response
        res.status(404).send('Row not found');
      }
    }
  });
});




// app.post('/setverification', (req, res) => {
//   const { aiis_id } = req.body; // Assuming you have an "id" to identify the record

//   const sql = 'UPDATE location SET status = "Verified" WHERE aiis_id = ? AND status = "Not Verified"';

//   // Execute the SQL query to update the status of the specific record
//   connection.query(sql, [aiis_id], (err, result) => {
//     if (err) {
//       // Update failed
//       res.status(500).json({ message: 'Error during update', error: err });
//     } else {
//       // Update successful
//       res.json({ message: 'Success' });
//     }
//   });
// });

app.post('/setverification', (req, res) => {
  const { aiis_id } = req.body; // Assuming you have an "aiis_id" to identify the record

  // Define a query to update the status to "Verified" and set the "date" field to the current date and time
  const sql = 'UPDATE location SET status = "Verified", date = NOW() WHERE aiis_id = ? AND status = "Not Verified"';

  // Execute the SQL query to update the status and "date" field of the specific record
  connection.query(sql, [aiis_id], (err, result) => {
    if (err) {
      // Update failed
      res.status(500).json({ message: 'Error during update', error: err });
    } else {
      // Update successful
      res.json({ message: 'Success' });
    }
  });
});













// Start the server
const PORT = 1392; // Replace with the desired port number
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});