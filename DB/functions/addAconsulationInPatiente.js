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

    // Extraire les informations de consultation de la requête JSON
    const consultationData = {
      date: requestBody.date,
      type: requestBody.type,
      hospital: requestBody.hospital,
      prescription: requestBody.prescription
    };

    // Ajouter la consultation au tableau "consultations" du patient
    patient.consultations.push(consultationData);

    // Mettre à jour le patient dans la base de données
    await patientCollection.updateOne({ _id: patient._id }, { $set: { consultations: patient.consultations } });

    return { status: "success", message: "Consultation ajoutée avec succès." };
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { status: "error", message: "Erreur lors du traitement de la requête : " + error.message };
  }
};
