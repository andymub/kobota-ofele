exports = async function({ body }) {
  const patientCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Patient");

  try {
    const requestBody = JSON.parse(body.text());
    const phoneOrName = requestBody.phoneOrName;

    // Vérifier si la valeur ressemble à un numéro de téléphone
    if (phoneOrName.match(/^\+?\d{10,}$/)) {
      // Supprimer le préfixe "+" s'il existe
     // const phoneNumber = phoneOrName.replace(/^\+/, "");
      // Recherche par numéro de téléphone
      const patientByPhone = await patientCollection.findOne({ phone: phoneNumber });

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
