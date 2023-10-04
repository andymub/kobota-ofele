exports = async function({ body }) {
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

  try {
    // Convertir le corps de la requête JSON en objet JavaScript
    const requestBody = JSON.parse(body.text());

    // Extraire le nom d'utilisateur et le mot de passe du corps de la requête
    const username = requestBody.username;
    const password = requestBody.password;

    // Recherche de l'utilisateur par nom d'utilisateur et mot de passe
    const user = await usersCollection.findOne({ user_name: username, passe: password });

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
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { status: 'error', message: error.message }; // Retourner un message d'erreur
  }
};
