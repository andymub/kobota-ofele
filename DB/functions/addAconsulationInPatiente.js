exports = async function({ body }) {
  const patientCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Patient");

  try {
    // Convertir le corps de la requête JSON en objet JavaScript
    const requestBody = JSON.parse(body.text());

    // Extraire les données de la requête
    const patientName = requestBody.patient_name;
    const date = requestBody.date;
    const type = requestBody.type;
    const hospital = requestBody.hospital;
    const prescription = requestBody.prescription;

    // Vérifier si le champ "statuts" est vide
    const existingPatient = await patientCollection.findOne({ name: patientName, statuts: "" });

    if (existingPatient) {
      // Le patient existe et le champ "statuts" est vide, ajouter la consultation
      const newConsultation = {
        date: date,
        type: type,
        prescription: [
          {
            hospital: hospital,
            prescription: prescription
          }
        ]
      };

      // Ajouter la nouvelle consultation à la liste des consultations
      await patientCollection.updateOne(
        { _id: existingPatient._id },
        {
          $push: {
            consultations: newConsultation
          }
        }
      );

      return { status: 'success', message: 'Consultation ajoutée avec succès.' };
    } else {
      return { status: 'fail', message: 'Patient non trouvé ou le dossier est déjà clos.' };
    }
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { status: 'error', message: 'Erreur lors du traitement de la requête.' };
  }
};
