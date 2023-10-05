exports = async function({ body }) {
  const patientCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Patient");

  try {
    // Convertir le corps de la requête JSON en objet JavaScript
    const newPatient = JSON.parse(body.text());

    // Vérifier si le champ "name" existe dans la collection "Patient"
    const existingPatient = await patientCollection.findOne({ name: newPatient.name });

    if (existingPatient) {
      // Vérifier si le champ "statuts" n'est pas vide dans le patient existant
      if (existingPatient.statuts) {
        return { status: 'fail', message: 'Cette patiente a un dossier non clôturé.' };
      }
    }

    // Si le patient n'existe pas ou si le champ "statuts" est vide, insérer le nouveau patient
    const insertResult = await patientCollection.insertOne(newPatient);

    // Vérifier si l'insertion a réussi
    if (insertResult.insertedId) {
      return {
        status: 'success',
        message: 'Patient créé avec succès.',
        insertedId: insertResult.insertedId
      };
    } else {
      return { status: 'fail', message: 'Échec de la création du patient.' };
    }
  } catch (error) {
    return { status: 'error', message: `Erreur lors du traitement de la requête : ${error.message}` };
  }
};
