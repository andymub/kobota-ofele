exports = async function({ body }) {
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");
  const bcrypt = pm.globals.get('bcrypt'); // Utilisez bcrypt depuis la variable globale

  try {
    // Convertir le corps de la requête JSON en objet JavaScript
    const requestBody = JSON.parse(body.text());

    // Extraire l'e-mail et le mot de passe du corps de la requête
    const email = requestBody.email;
    const password = requestBody.password;

    // Rechercher l'utilisateur par e-mail
    const user = await usersCollection.findOne({ email: email });

    if (user) {
      // Utilisateur trouvé, vérifier le mot de passe crypté
      const isPasswordMatch = await bcrypt.compare(password, user.passe);

      if (isPasswordMatch) {
        // Authentification réussie, retourner les données de l'utilisateur (à l'exception du mot de passe)
        delete user.passe; // Supprimez le mot de passe de la réponse pour des raisons de sécurité
        return {
          status: 'success',
          user: user
        };
      } else {
        // Mot de passe incorrect, authentification échouée
        return { status: 'fail' };
      }
    } else {
      // Utilisateur non trouvé, authentification échouée
      return { status: 'fail' };
    }
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { status: 'error', message: error.message }; // Retourner un message d'erreur
  }
};
