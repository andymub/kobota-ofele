exports = async function(updatedDocument) {
  const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");

  try {
    // Assurez-vous que le document contient un champ "_id" pour identifier le document à mettre à jour
    if (!updatedDocument._id) {
      return { message: "Le champ '_id' est manquant dans le document mis à jour." };
    }

    // Mettre à jour le document dans la collection en utilisant son "_id"
    const updateResult = await establishmentCollection.updateOne(
      { _id: updatedDocument._id },
      { $set: updatedDocument }
    );

    if (updateResult.modifiedCount === 1) {
      // Si la mise à jour est réussie, retourner un message de succès
      return { message: "Mise à jour réussie." };
    } else {
      // Si aucun document n'a été mis à jour, retourner un message d'erreur
      return { message: "Aucun document n'a été mis à jour." };
    }
  } catch (error) {
    // En cas d'erreur, retourner un message d'erreur
    console.error("Erreur : " + error.message);
    return { message: "Une erreur s'est produite lors de la mise à jour du document." };
  }
};
