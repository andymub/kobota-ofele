exports = async function({ body }) {
  const patientCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Patient");
  const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");

  try {
    const requestBody = JSON.parse(body.text());

    const name = requestBody.name;
    const prescriptionNamesToUpdate = requestBody.prescriptionNamesToUpdate;
    const newPharmacyData = requestBody.newPharmacyData;

    // Recherche du patient par nom
    const patient = await patientCollection.findOne({ name: name });

    if (!patient) {
      return { status: 'error', message: 'Patient introuvable.' };
    }

    // Mise à jour des prescriptions
    if (patient.consultations && Array.isArray(patient.consultations)) {
      const consultations = patient.consultations;

      for (const consultation of consultations) {
        if (consultation.prescription && Array.isArray(consultation.prescription)) {
          for (const prescription of consultation.prescription) {
            if (prescriptionNamesToUpdate.includes(prescription.nom) && !prescription.pharmacy) {
              prescription.pharmacy = newPharmacyData;
            }
          }
        }
      }

      // Mise à jour du patient
      const updateResult = await patientCollection.updateOne(
        { _id: patient._id },
        { $set: { consultations: consultations } }
      );

      if (!updateResult.matchedCount) {
        return { status: 'error', message: 'Échec de la mise à jour du patient.' };
      }
    }

    // Recherche de l'établissement par nom
    const establishment = await establishmentCollection.findOne({ establishment_name: newPharmacyData });

    if (establishment && establishment.list_pharmacy && Array.isArray(establishment.list_pharmacy)) {
      const today = new Date().toISOString().split('T')[0];

      establishment.list_pharmacy.push({
        date: today,
        patient_name: name,
        product_sell: prescriptionNamesToUpdate
      });

      // Mise à jour de l'établissement
      const updateEstablishmentResult = await establishmentCollection.updateOne(
        { _id: establishment._id },
        { $set: { list_pharmacy: establishment.list_pharmacy } }
      );

      if (!updateEstablishmentResult.matchedCount) {
        return { status: 'error', message: 'Échec de la mise à jour de l\'établissement.' };
      }
    }

    return { status: 'success', message: 'Prescription mise à jour avec succès.' };
  } catch (error) {
    return { status: 'error', message: `Erreur lors du traitement de la requête : ${error.message}` };
  }
};
