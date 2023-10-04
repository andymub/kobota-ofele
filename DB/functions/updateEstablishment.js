exports = async function({ body }) {
  const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");

  try {
    // Extraire le champ "establishment_name" de la requête JSON
    const { establishment_name, updatedData } = JSON.parse(body.text());

    if (!establishment_name || !updatedData) {
      return { message: "Le champ 'establishment_name' ou 'updatedData' est manquant dans la requête JSON." };
    }

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

    // Mettre à jour le document dans la collection en utilisant le champ "establishment_name" comme identifiant
    const updateResult = await establishmentCollection.updateOne(
      { establishment_name: establishment_name },
      { $set: updateData }
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
