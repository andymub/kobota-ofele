exports = async function({ body }) {
  const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");

  try {
    // Extraire les données de la requête JSON
    const requestData = body;

    // Extraire le nom de l'établissement de la requête JSON
    const establishmentName = requestData.establishment_name;

    // Vérifier si le document avec le nom d'établissement existe
    const existingDocument = await establishmentCollection.findOne({ establishment_name: establishmentName });

    if (!existingDocument) {
      // Si le document n'existe pas, retourner un message
      return { message: `Établissement non trouvé avec le nom : ${establishmentName}` };
    }

    // Vérifier si les champs à mettre à jour ne sont pas vides ou nuls
    const updateData = {};

    if (requestData.updatedData.establishment_name != null && requestData.updatedData.establishment_name !== "") {
      updateData.establishment_name = requestData.updatedData.establishment_name;
    }

    if (requestData.updatedData.adress) {
      updateData.adress = requestData.updatedData.adress;
    }

    if (requestData.updatedData.contact) {
      updateData.contact = requestData.updatedData.contact;
    }

    if (requestData.updatedData.services) {
      updateData.services = requestData.updatedData.services;
    }

    if (requestData.updatedData.establishment_type != null && requestData.updatedData.establishment_type !== "") {
      updateData.establishment_type = requestData.updatedData.establishment_type;
    }

    if (requestData.updatedData.list_consultations) {
      updateData.list_consultations = requestData.updatedData.list_consultations;
    }

    if (requestData.updatedData.validation_acces != null) {
      updateData.validation_acces = requestData.updatedData.validation_acces;
    }

    if (requestData.updatedData.list_pharmacy) {
      updateData.list_pharmacy = requestData.updatedData.list_pharmacy;
    }

    if (requestData.updatedData.createdBy) {
      updateData.createdBy = requestData.updatedData.createdBy;
    }

    if (requestData.updatedData.agent) {
      updateData.agent = requestData.updatedData.agent;
    }

    // Mettre à jour l'établissement dans la collection en utilisant le nom de l'établissement
    const updateResult = await establishmentCollection.updateOne(
      { establishment_name: establishmentName },
      { $set: updateData }
    );

    if (updateResult.modifiedCount === 1) {
      // Si la mise à jour est réussie, retourner un message de succès
      return { message: `Mise à jour réussie pour l'établissement : ${establishmentName}` };
    } else {
      // Si aucun établissement n'est trouvé, retourner un message d'erreur avec le nom de l'établissement recherché
      return { message: `Établissement non trouvé avec le nom : ${establishmentName}` };
    }
  } catch (error) {
    // En cas d'erreur, retourner un message d'erreur
    console.error("Erreur : " + error.message);
    return { message: error.message };
  }
};
