exports = async function({ body }) {
  const patientCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Patient");

  try {
    const requestBody = JSON.parse(body.text());

    // Vérification des données passées dans le paramètre
    if (!requestBody || !requestBody.name || !requestBody.updatedData || Object.keys(requestBody.updatedData).length === 0) {
      return { status: 'error', message: 'Données de mise à jour invalides.' };
    }

    const name = requestBody.name;
    const updatedData = requestBody.updatedData;

    // Recherche du patient par nom
    const patient = await patientCollection.findOne({ name: name, statuts: { $in: [null, ""] } });

    if (!patient) {
      return { status: 'error', message: 'Aucun dossier ouvert trouvé pour ce patient.' };
    }

    // Mise à jour des données du patient
    const updateResult = await patientCollection.updateOne(
      { _id: patient._id },
      { $set: updatedData }
    );

    if (!updateResult.matchedCount) {
      return { status: 'error', message: 'Échec de la mise à jour du patient.' };
    }

    return { status: 'success', message: 'Mise à jour du dossier réussie.' };
  } catch (error) {
    return { status: 'error', message: `Erreur lors du traitement de la requête : ${error.message}` };
  }
};
