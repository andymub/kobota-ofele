exports = async function({ phoneOrName }) {
  const patientCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Patient");
  
  // Vérifier si la donnée ressemble à un numéro de téléphone
  const isPhoneNumber = /^(?:\+243|00243)?\d{10}$/.test(phoneOrName);
  
  if (isPhoneNumber) {
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
};
