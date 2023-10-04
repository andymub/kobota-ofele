exports = async function ({ username, passe }) {
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

  // Recherche de l'utilisateur par nom d'utilisateur et mot de passe
  const user = await usersCollection.findOne({ user_name: username, passe: passe });

  if (user) {
    // Utilisateur trouvé, authentification réussie, retourner les données de l'utilisateur
    return {
      status: 'success',
      user: user
    };
  } else {
    // Utilisateur non trouvé, authentification échouée
    return { status: 'fail' };
  }
};
