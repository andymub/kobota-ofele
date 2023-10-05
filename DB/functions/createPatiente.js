exports = async function({ body }) {
  const patientCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Patient");

  try {
    // Convertir le corps de la requête JSON en objet JavaScript
    const newPatient = JSON.parse(body.text());

    // Insérer le nouveau patient dans la collection "Patient"
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
