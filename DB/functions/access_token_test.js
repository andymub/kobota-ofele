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
        const secretKey = '2f75f2026b167d8c246761e71b81d539839fdc8d8cade94846691b59315d84df637dc458355d9812ba4cf49e71fd1af302ecca4167c8b56bcbe61ac935a64a36'; // Mettez à jour avec votre véritable clé secrète

        const token = jwt.sign(
          {
            sub: user._id.toString(), // User's unique identifier
            email: user.email,
            user_name: user.user_name,
            fonction: user.fonction,
            access: user.validation_acces
          },
          secretKey, // Utilisez la variable de la clé secrète ici
          { expiresIn: '30d' } // Durée de validité du token
        );

        // Authentification réussie, retournez le jeton JWT
        return {
          status: 'success',
          email: user.email,
          user_name: user.user_name,
          fonction: user.fonction,
          access: user.validation_acces,
          token: token
        };
      } else {
        // Mot de passe incorrect, échec de l'authentification
        return { status: 'fail', message: 'Mot de passe incorrect.' };
      }
    } else {
      // Utilisateur non trouvé, échec de l'authentification
      return { status: 'fail', message: 'Utilisateur non trouvé.' };
    }
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { status: 'error', message: 'Erreur lors du traitement de la requête.' };
  }
};
