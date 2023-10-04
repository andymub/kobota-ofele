exports = async function(updatedDocument) {
  const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");

  try {
    // Assurez-vous que le document contient le champ "establishment_name" pour l'identifier
    if (!updatedDocument.establishment_name) {
      return { message: "Le champ 'establishment_name' est manquant dans le document mis à jour." };
    }

    // Mettre à jour le document dans la collection en utilisant son "establishment_name"
    const updateResult = await establishmentCollection.updateOne(
      { establishment_name: updatedDocument.establishment_name },
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
