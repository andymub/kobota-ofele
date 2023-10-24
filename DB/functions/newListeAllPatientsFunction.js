//ListAllPatient-ayant un dossier valide
exports = async function() {
  const patientsCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Patient");

//rechercher uniquement les patients ayant un dossier valide , where status est vide ou inexistant 
  try {
    const patients = await patientsCollection.find({ $or: [{ statuts: "" }, { statuts: { $exists: false } }] }).toArray();

    return patients; // Retoune la liste de patient avec dossier non clôturé 
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { status: 'error', message: 'Erreur lors de la récupération des patients.' };
  }
};
