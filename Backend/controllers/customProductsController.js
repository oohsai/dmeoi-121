const pool = require('../db'); // Import the MySQL connection pool

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  const { role } = req.user; // Assuming the user role is stored in req.user (e.g., after JWT auth)

  if (role !== 'Admin') {
    return res.status(403).json({ message: 'Permission denied. Admin access required.' });
  }

  next(); // Allow admins to proceed
};

// Create a new custom product (Admin only)
// const createCustomProduct = (req, res) => {
//   const { customProductName, sizeID, ingredients } = req.body; // ingredients should be an array of { ingredientID, quantity }

//   if (!customProductName || !sizeID || !ingredients || !ingredients.length) {
//     return res.status(400).json({ message: 'Custom product name, size, and ingredients are required.' });
//   }

//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error('Database connection error:', err);
//       return res.status(500).send('Database connection error');
//     }

//     connection.beginTransaction(async (transactionErr) => {
//       if (transactionErr) {
//         connection.release();
//         console.error('Transaction error:', transactionErr);
//         return res.status(500).send('Transaction error');
//       }

//       try {
//         // Insert into CustomProduct table
//         const [customProductResult] = await connection.query(
//           'INSERT INTO CustomProduct (CustomProductName, SizeID) VALUES (?, ?)',
//           [customProductName, sizeID]
//         );

//         const customProductID = customProductResult.insertId;

//         // Insert each ingredient into CustomProductIngredients table
//         for (const ingredient of ingredients) {
//           await connection.query(
//             'INSERT INTO CustomProductIngredients (CustomProductID, IngredientID, Quantity) VALUES (?, ?, ?)',
//             [customProductID, ingredient.ingredientID, ingredient.quantity]
//           );
//         }

//         connection.commit();
//         res.status(201).json({ message: 'Custom product created successfully', customProductID });
//       } catch (error) {
//         connection.rollback();
//         console.error('Error creating custom product:', error);
//         res.status(500).send('Error creating custom product');
//       } finally {
//         connection.release();
//       }
//     });
//   });
// };

const createCustomProduct = async (req, res) => {
  try {
      const { name, description, price, size, ingredients, category, available } = req.body;

      if (!name || !price) {
          return res.status(400).json({ message: "Name and price are required." });
      }

      const newProduct = {
          name,
          description,
          price,
          size,
          ingredients,
          category,
          available
      };

      // Simulate DB Save (Replace with actual DB logic)
      res.status(201).json({ success: true, message: "Custom product created!", data: newProduct });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Update a custom product (Admin only)
const updateCustomProduct = (req, res) => {
  const { id } = req.params;
  const { customProductName, sizeID, ingredients } = req.body;

  if (!customProductName || !sizeID || !ingredients || !ingredients.length) {
    return res.status(400).json({ message: 'Custom product name, size, and ingredients are required.' });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).send('Database connection error');
    }

    connection.beginTransaction(async (transactionErr) => {
      if (transactionErr) {
        connection.release();
        console.error('Transaction error:', transactionErr);
        return res.status(500).send('Transaction error');
      }

      try {
        // Update CustomProduct table
        await connection.query(
          'UPDATE CustomProduct SET CustomProductName = ?, SizeID = ? WHERE CustomProductID = ?',
          [customProductName, sizeID, id]
        );

        // Delete existing ingredients for this custom product
        await connection.query('DELETE FROM CustomProductIngredients WHERE CustomProductID = ?', [id]);

        // Insert updated ingredients into CustomProductIngredients table
        for (const ingredient of ingredients) {
          await connection.query(
            'INSERT INTO CustomProductIngredients (CustomProductID, IngredientID, Quantity) VALUES (?, ?, ?)',
            [id, ingredient.ingredientID, ingredient.quantity]
          );
        }

        connection.commit();
        res.json({ message: 'Custom product updated successfully' });
      } catch (error) {
        connection.rollback();
        console.error('Error updating custom product:', error);
        res.status(500).send('Error updating custom product');
      } finally {
        connection.release();
      }
    });
  });
};

// Delete a custom product (Admin only)
const deleteCustomProduct = (req, res) => {
  const { id } = req.params;

  pool.query(
    'DELETE FROM CustomProduct WHERE CustomProductID = ?',
    [id],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Database error');
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Custom product not found' });
      }

      res.json({ message: 'Custom product deleted successfully' });
    }
  );
};

// Get all custom products
const getAllCustomProducts = (req, res) => {
  pool.query(
    `SELECT 
      cp.CustomProductID, 
      cp.CustomProductName, 
      s.SizeDescription, 
      GROUP_CONCAT(i.IngredientName) AS Ingredients
    FROM 
      CustomProduct cp
    JOIN Sizes s ON cp.SizeID = s.SizeID
    JOIN CustomProductIngredients cpi ON cp.CustomProductID = cpi.CustomProductID
    JOIN Ingredients i ON cpi.IngredientID = i.IngredientID
    GROUP BY cp.CustomProductID`,
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Database error');
      }
      res.json(results);
    }
  );
};

// Get a custom product by ID
const getCustomProductById = (req, res) => {
  const { id } = req.params;

  pool.query(
    `SELECT 
      cp.CustomProductID, 
      cp.CustomProductName, 
      s.SizeDescription, 
      GROUP_CONCAT(i.IngredientName) AS Ingredients
    FROM 
      CustomProduct cp
    JOIN Sizes s ON cp.SizeID = s.SizeID
    JOIN CustomProductIngredients cpi ON cp.CustomProductID = cpi.CustomProductID
    JOIN Ingredients i ON cpi.IngredientID = i.IngredientID
    WHERE cp.CustomProductID = ?
    GROUP BY cp.CustomProductID`,
    [id],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Database error');
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Custom product not found' });
      }

      res.json(results[0]);
    }
  );
};









module.exports = {
  createCustomProduct,
  updateCustomProduct,
  deleteCustomProduct,
  getAllCustomProducts,
  getCustomProductById,
  isAdmin,  // Middleware for admin check
  
};
