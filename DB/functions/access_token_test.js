const jwt = require('jsonwebtoken');

exports = async function (email, password) {
  const usersCollection = context.services
    .get("mongodb-atlas")
    .db("kobotaDB")
    .collection("Users");

  // Recherche de l'utilisateur par email
  const user = await usersCollection.findOne({ email: email });

  if (user && user.passe === password) {
    // L'utilisateur est authentifié avec succès
    const token = jwt.sign(
      {
        sub: user._id.toString(),
        // Ajoutez d'autres claims personnalisés ici si nécessaire
      },
      '2f75f2026b167d8c246761e71b81d539839fdc8d8cade94846691b59315d84df637dc458355d9812ba4cf49e71fd1af302ecca4167c8b56bcbe61ac935a64a36', // Remplacez par votre clé secrète
      { expiresIn: '1h' } // Durée de validité du token
    );

    return {
      email: user.email,
      user_name: user.user_name,
      image: user.image,
      fonction: user.fonction,
      access: true,
      token: token,
    };
  } else {
    // Échec de l'authentification
    return { access: false };
  }
};
