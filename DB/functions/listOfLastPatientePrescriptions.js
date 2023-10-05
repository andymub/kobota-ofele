exports = async function({ body }) {
  const patientCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Patient");

  try {
    // Convertir le corps de la requête JSON en objet JavaScript
    const requestBody = JSON.parse(body.text());

    // Extraire le nom du patient de la requête JSON
    const patientName = requestBody.name;

    // Rechercher le patient par son nom
    const patient = await patientCollection.findOne({ name: patientName });

    if (!patient) {
      return { status: "fail", message: "Le patient n'a pas été trouvé." };
    }

    // Récupérer le dernier élément dans le tableau "consultations"
    const lastConsultation = patient.consultations[patient.consultations.length - 1];

    if (!lastConsultation) {
      return { status: "fail", message: "Aucune consultation trouvée pour ce patient." };
    }

    return { status: "success", lastConsultation: lastConsultation };
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { status: "error", message: "Erreur lors du traitement de la requête : " + error.message };
  }
};
