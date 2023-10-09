const jwt = require('jsonwebtoken');

exports = async function({ body }) {
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

  try {
    // Convert the JSON request body to a JavaScript object
    const requestBody = JSON.parse(body.text());

    // Extract the email and password from the request body
    const email = requestBody.email;
    const password = requestBody.password;

    // Search for the user by email
    const user = await usersCollection.findOne({ email: email });

    if (user) {
      // User found, check the password
      if (user.passe === password) {
        // Password is correct, generate a JWT token
        const token = jwt.sign(
          {
            sub: user._id.toString(), // User's unique identifier
            // Add any additional claims here
          },
          kobotaofele_signkey1, // Replace with your secret key for signing the token
          { expiresIn: '1h' } // Token expiration time
        );

        // Authentication successful, return the JWT token
        return {
          status: 'success',
          token: token
        };
      } else {
        // Incorrect password, authentication failed
        return { status: 'fail', message: 'Incorrect password.' };
      }
    } else {
      // User not found, authentication failed
      return { status: 'fail', message: 'User not found.' };
    }
  } catch (error) {
    console.error("Error: " + error.message);
    return { status: 'error', message: 'Error processing the request.' };
  }
};
