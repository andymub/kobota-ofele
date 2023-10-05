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

    // Extraire les informations de consultation du dernier élément de la liste "consultations"
    const lastConsultation = patient.consultations[patient.consultations.length - 1];

    // Vérifier si le champ "pharmacy" est vide dans la prescription du dernier élément
    if (lastConsultation.prescription && lastConsultation.prescription.length > 0) {
      const lastPrescription = lastConsultation.prescription[lastConsultation.prescription.length - 1];

      if (!lastPrescription.pharmacy) {
        // Mettre à jour le champ "pharmacy" avec la nouvelle donnée
        lastPrescription.pharmacy = requestBody.newPharmacy;
      }
    }

    // Mettre à jour le patient dans la base de données
    await patientCollection.updateOne({ _id: patient._id }, { $set: { consultations: patient.consultations } });

    return { status: "success", message: "Prescription mise à jour avec succès." };
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { status: "error", message: "Erreur lors du traitement de la requête : " + error.message };
  }
};
