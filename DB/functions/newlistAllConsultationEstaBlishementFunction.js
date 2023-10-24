//on passe phone de l'établissement ID 
exports = async function(phone) {
  const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");

  try {
    // Rechercher l'établissement par numéro de téléphone id (phone)
   // const establishment = await establishmentCollection.findOne({ phone: phone });
   const establishment = await establishmentCollection.findOne({ "contact.phone": phone });


    if (!establishment) {
      return { status: 'error', message: 'Établissement non trouvé.' };
    }

    // Renvoyer le tableau de consultations (list_consultations)
    return { status: 'success', consultations: establishment.list_consultations };
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { status: 'error', message: 'Erreur lors de la recherche des consultations de l\'établissement.' };
  }
};