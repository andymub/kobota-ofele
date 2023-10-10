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
      '231a58b00632c9c4d8ac02b268ca4caf8dd48fd020e3dffa72666523d860988f', // Remplacez par votre clé secrète
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
