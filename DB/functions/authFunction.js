exports = async function({ body }) {
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

  try {
    // Convertir le corps de la requête JSON en objet JavaScript
    const requestBody = JSON.parse(body.text());

    // Extraire l'e-mail et le mot de passe du corps de la requête
    const email = requestBody.email;
    const password = requestBody.password;

    // Rechercher l'utilisateur par e-mail
    const user = await usersCollection.findOne({ email: email });

    if (user) {
      // Utilisateur trouvé, vérifier le mot de passe
      if (user.passe === password) {
        // Authentification réussie, renvoyer tout le document de l'utilisateur
        return {
          status: 'success',
          user: user
        };
      } else {
        // Mot de passe incorrect, authentification échouée
        return { status: 'fail', message: 'Mot de passe incorrect.' };
      }
    } else {
      // Utilisateur non trouvé, authentification échouée
      return { status: 'fail', message: 'Utilisateur non trouvé.' };
    }
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { status: 'error', message: 'Erreur lors du traitement de la requête.' };
  }
};
