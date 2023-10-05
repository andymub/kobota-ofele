exports = async function({ body }) {
  const patientCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Patient");

  try {
    // Convertir le corps de la requête JSON en objet JavaScript
    const requestBody = JSON.parse(body.text());

    // Extraire le nom du patient de la requête JSON
    const patientName = requestBody.name;

    // Rechercher le patient par nom
    const patient = await patientCollection.findOne({ name: patientName });

    if (!patient) {
      return { status: "fail", message: "Le patient n'existe pas." };
    }

    // Obtenir la liste des consultations du patient
    const consultations = patient.consultations;

    if (consultations.length === 0) {
      return { status: "fail", message: "Aucune consultation n'a été enregistrée pour ce patient." };
    }

    // Obtenir la dernière consultation
    const lastConsultation = consultations[consultations.length - 1];

    // Vérifier si la dernière consultation a une prescription
    if (!lastConsultation.prescription) {
      lastConsultation.prescription = [];
    }

    // Extraire le nom et la nouvelle donnée à mettre dans le champ "pharmacy"
    const newName = requestBody.newName;

    // Ajouter la nouvelle donnée dans la prescription de la dernière consultation
    lastConsultation.prescription.push({ nom: newName, pharmacy: "" });

    // Mettre à jour le patient dans la base de données
    await patientCollection.updateOne({ _id: patient._id }, { $set: { consultations: consultations } });

    return { status: "success", message: "Prescription mise à jour avec succès." };
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { status: "error", message: "Erreur lors du traitement de la requête : " + error.message };
  }
};
