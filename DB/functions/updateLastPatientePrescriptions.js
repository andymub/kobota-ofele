exports = async function({ body }) {
  const patientCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Patient");

  try {
    // Convertir le corps de la requête JSON en objet JavaScript
    const requestBody = JSON.parse(body.text());

    // Extraire le nom du patient de la requête JSON
    const patientName = requestBody.name;

    // Vérifier si le champ "statuts" est vide pour le patient spécifié
    const patient = await patientCollection.findOne({ name: patientName, statuts: "" });

    if (!patient) {
      return { status: "fail", message: "Le patient n'existe pas ou son dossier est déjà clôturé." };
    }

    // Extraire les informations de consultation du dernier élément
    const lastConsultation = patient.consultations[patient.consultations.length - 1];

    if (!lastConsultation) {
      return { status: "fail", message: "Aucune consultation n'a été trouvée pour ce patient." };
    }

    // Extraire la liste de noms de prescriptions à mettre à jour
    const prescriptionNamesToUpdate = requestBody.prescriptionNamesToUpdate;

    // Extraire la nouvelle donnée à mettre dans le champ "pharmacy"
    const newPharmacyData = requestBody.newPharmacyData;

    // Parcourir les noms de prescriptions à mettre à jour
    for (const prescriptionName of prescriptionNamesToUpdate) {
      // Rechercher la prescription dans la dernière consultation
      const prescriptionToUpdate = lastConsultation.prescription.find(
        (prescription) => prescription.nom === prescriptionName
      );

      if (prescriptionToUpdate) {
        // Mettre à jour le champ "pharmacy" si vide
        if (!prescriptionToUpdate.pharmacy) {
          prescriptionToUpdate.pharmacy = newPharmacyData;
        }
      }
    }

    // Mettre à jour le patient dans la base de données
    await patientCollection.updateOne(
      { _id: patient._id },
      { $set: { consultations: patient.consultations } }
    );

    return { status: "success", message: "Prescription mise à jour avec succès." };
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { status: "error", message: "Erreur lors du traitement de la requête : " + error.message };
  }
};
