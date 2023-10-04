exports = async function({ body }) {
  const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");

  try {
    // Extraire les données de la requête JSON
    const requestData = JSON.parse(body.text());

    // Extraire le nom de l'établissement de la requête JSON
    const establishmentName = requestData.establishment_name;

    // Extraire la variable booléenne de la requête JSON
    const validationAccess = requestData.validation_acces;

    // Vérifier si le document avec le nom d'établissement existe
    const existingDocument = await establishmentCollection.findOne({ establishment_name: establishmentName });

    if (!existingDocument) {
      // Si le document n'existe pas, retourner un message d'erreur
      return { message: `Établissement non trouvé avec le nom : ${establishmentName}` };
    }

    // Mettre à jour le champ "validation_acces" avec la valeur booléenne
    const updateResult = await establishmentCollection.updateOne(
      { establishment_name: establishmentName },
      { $set: { validation_acces: validationAccess } }
    );

    if (updateResult.modifiedCount === 1) {
      // Si la mise à jour est réussie, retourner un message en fonction de la valeur booléenne
      if (validationAccess) {
        return { message: `Établissement ${establishmentName} est activé(e).` };
      } else {
        return { message: `Établissement ${establishmentName} est désactivé(e).` };
      }
    } else {
      // Si aucun document n'a été mis à jour, retourner un message d'erreur
      return { message: `Aucun document n'a été mis à jour pour l'établissement : ${establishmentName}` };
    }
  } catch (error) {
    // En cas d'erreur, retourner un message d'erreur
    console.error("Erreur : " + error.message);
    return { message: "Une erreur s'est produite lors de la mise à jour du document." };
  }
};
