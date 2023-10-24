//recherche du patient par num de téléphone 
exports = async function(phoneNumber) {
  const patientsCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Patient");

  try {
    // Vérifier si phoneNumber est un numéro de téléphone valide soit c'est un 10 chiffre ou un numéro en +243
    const phoneRegex = /^(?:\+243\d{9}|\d{10})$/;
    if (!phoneRegex.test(phoneNumber)) {
      return { status: 'invalid', message: 'Numéro de téléphone invalide.' };
    }

    // Rechercher le patient par numéro de téléphone dans la collection
    const patient = await patientsCollection.findOne({ phone: phoneNumber });

    if (patient) {
      return patient;
    } else {
      return { status: 'not found', message: 'Patient non trouvé.' };
    }
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { status: 'error', message: 'Erreur lors de la recherche du patient.' };
  }
};