exports = async function({ body }) {
  const patientCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Patient");

  try {
    const requestBody = JSON.parse(body.text());
    const phoneOrName = requestBody.phoneOrName;

    if (!phoneOrName) {
      return { status: 'fail', message: 'Le paramètre phoneOrName est manquant ou vide.' };
    }

    // Vérifier si le paramètre ressemble à un numéro de téléphone
    if (/^(?:\+243|00243)?\d{10}$/.test(phoneOrName)) {
      // Recherche par numéro de téléphone
      const patientByPhone = await patientCollection.findOne({ phone: phoneOrName });

      if (patientByPhone) {
        return { status: 'success', patient: patientByPhone };
      } else {
        return { status: 'fail', message: 'Aucun patient trouvé avec ce numéro de téléphone.' };
      }
    } else {
      // Recherche par nom
      const patientByName = await patientCollection.findOne({ name: phoneOrName });

      if (patientByName) {
        return { status: 'success', patient: patientByName };
      } else {
        return { status: 'fail', message: 'Aucun patient trouvé avec ce nom.' };
      }
    }
  } catch (error) {
    return { status: 'error', message: `Erreur lors du traitement de la requête : ${error.message}` };
  }
};
