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

    // Extraire les données de mise à jour de la requête JSON
    const updatedData = requestData.updatedData;

    // Vérifier si les champs à mettre à jour ne sont pas vides ou nuls
    const updateData = {};

    if (updatedData.establishment_name != null && updatedData.establishment_name !== "") {
      updateData.establishment_name = updatedData.establishment_name;
    }

    if (updatedData.adress) {
      updateData.adress = updatedData.adress;
    }

    if (updatedData.contact) {
      updateData.contact = updatedData.contact;
    }

    if (updatedData.services) {
      updateData.services = updatedData.services;
    }

    if (updatedData.establishment_type != null && updatedData.establishment_type !== "") {
      updateData.establishment_type = updatedData.establishment_type;
    }

    if (updatedData.list_consultations) {
      updateData.list_consultations = updatedData.list_consultations;
    }

    if (updatedData.validation_acces != null) {
      updateData.validation_acces = updatedData.validation_acces;
    }

    if (updatedData.list_pharmacy) {
      updateData.list_pharmacy = updatedData.list_pharmacy;
    }

    if (updatedData.createdBy) {
      updateData.createdBy = updatedData.createdBy;
    }

    if (updatedData.agent) {
      updateData.agent = updatedData.agent;
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
