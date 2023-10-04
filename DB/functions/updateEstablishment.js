exports = async function({ body }) {
  const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");

  try {
    // Extraire le champ "establishment_name" de la requête JSON
    const { establishment_name } = JSON.parse(body.text());

    if (!establishment_name) {
      return { message: "Le champ 'establishment_name' est manquant dans la requête JSON." };
    }

    // Mettre à jour le document dans la collection en utilisant le champ "establishment_name" comme identifiant
    const updateResult = await establishmentCollection.updateOne(
      { establishment_name: establishment_name },
      { $set: JSON.parse(body.text()) }
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
