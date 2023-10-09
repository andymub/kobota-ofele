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
          'UWaNHq1sR+3HEYyrcqO1MLa4zgtR9mYHW/wRYNsBzKRlqBMUD8U3sLUS0+j2RsN2tfNV4rQhhxfcmNmDldk94EOtDiAxg8By6YUod0fXIgWGykeb7VYg5s/NzS1UTTe8Fj7ddB522HwR3iCz97sF3H2oUW0MFYtJr9eF61MG+ZHbaw4FWeqGwqc9W0is/Q4ceLzBR3ndS+gsT/5sdMVpAt+oVa0Z08WG0BCRJrFyJhcxOkC2UGGGQVxcGUHS/ICP5zgWcOp3/iDswC6MBkl3W1T4BFmGyrBhjArGWaCwo2ae0/Z0rvSkeERgF4+AMFNRIjAYEcERFUhG1kgwL1/vAw==', // Replace with your secret key for signing the token
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
