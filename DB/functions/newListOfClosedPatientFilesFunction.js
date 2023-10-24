exports = async function(establishmentPhone) {
  const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");
  const patientCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Patient");

  try {
    // Rechercher l'établissement par son numéro de téléphone (establishmentPhone)
    const establishment = await establishmentCollection.findOne({ "contact.phone": establishmentPhone });

    if (!establishment) {
      return { status: 'error', message: 'Établissement non trouvé.' };
    }

    // Compter les dossiers de patients clos
    let closedPatientFiles = 0;

    for (const consultation of establishment.list_consultations) {
      if (consultation.patient_name) {
        const patient = await patientCollection.findOne({ phone: consultation.patient_name });
        if (patient && (patient.status !== "" && patient.status !== null)) {
          closedPatientFiles++;
        }
      }
    }

    // Renvoyer le nombre de dossiers de patients clos
    return { status: 'success', count: closedPatientFiles };
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { status: 'error', message: 'Erreur lors du comptage des dossiers de patients clos.' };
  }
};
