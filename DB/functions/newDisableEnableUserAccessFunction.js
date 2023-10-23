//newAccess est un boolean
//userId c'est le numéro de téléphone du user
exports = async function (userId, newAccess) {
  if (userId && newAccess !== null) {
    const usersCollection = context.services
      .get("mongodb-atlas")
      .db("kobotaDB")
      .collection("Users");

    try {
      // Recherche du document utilisateur ayant le même ID
      const user = await usersCollection.findOne({ phone: userId });

      if (user) {
        // Mettre à jour le champ validation_acces avec la nouvelle valeur
        await usersCollection.updateOne(
          { phone: userId },
          { $set: { validation_acces: newAccess } }
        );

	//Retourner accès valide si newAccess est true et si c'est le pas , on retourne un message invalide 
        return {
          message: `L'utilisateur ${user.user_name} a maintenant ${
            newAccess ? "un accès valide" : "un accès non valide"
          }.`,
        };
      } else {
        return { message: "Utilisateur non trouvé." };
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'accès de l'utilisateur :", error);
      return { status: "error", message: "Erreur lors de la mise à jour de l'accès de l'utilisateur." };
    }
  } else {
    return { message: "Paramètres non valides." };
  }
};