exports = async function({ body, response }) {
  try {
    // Convertir le corps de la requête JSON en objet JavaScript
    const { userEmail, newUser } = JSON.parse(body.text());

    // Accéder à la collection "Users"
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

    // Rechercher l'utilisateur par e-mail
    const existingUser = await usersCollection.findOne({ email: userEmail });

    if (!existingUser) {
      // Si l'utilisateur n'existe pas, renvoyez une réponse d'erreur
      response.setStatusCode(404); // Code de réponse HTTP 404 (Non trouvé)
      return { message: "Utilisateur non trouvé." };
    }

    // Mettre à jour les données de l'utilisateur
    const updateResult = await usersCollection.updateOne({ _id: existingUser._id }, { $set: newUser });

    if (updateResult.matchedCount === 1) {
      // La mise à jour a réussi
      return { message: "Utilisateur mis à jour avec succès." };
    } else {
      // La mise à jour a échoué
      response.setStatusCode(500); // Code de réponse HTTP 500 (Erreur interne du serveur)
      return { message: "Échec de la mise à jour de l'utilisateur." };
    }
  } catch (error) {
    response.setStatusCode(400); // Code de réponse HTTP 400 (Mauvaise requête)
    return { message: `Erreur lors du traitement de la requête : ${error.message}` };
  }
};
