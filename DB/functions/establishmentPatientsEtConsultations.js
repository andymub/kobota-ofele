exports = async function(establishmentName) {
  const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");

  try {
    // Recherchez le document d'établissement par son nom
    const establishment = await establishmentCollection.findOne({ establishment_name: establishmentName });

    if (!establishment) {
      return {
        message: `Établissement non trouvé avec le nom : ${establishmentName}`,
        consultationCount: 0,
        consultations: [],
        uniquePatientCount: 0
      };
    }

    const consultations = establishment.list_consultations || [];
    const consultationCount = consultations.length;

    // Créez un ensemble pour stocker les noms de patients uniques
    const uniquePatients = new Set();

    // Parcourez les consultations pour compter les patients uniques
    for (const consultation of consultations) {
      uniquePatients.add(consultation.patient_name);
    }

    const uniquePatientCount = uniquePatients.size;

    return {
      message: `Établissement trouvé avec le nom : ${establishmentName}`,
      consultationCount: consultationCount,
      consultations: consultations,
      uniquePatientCount: uniquePatientCount
    };
  } catch (error) {
    console.error("Erreur : " + error.message);
    return {
      message: "Une erreur s'est produite lors de la recherche de l'établissement.",
      consultationCount: 0,
      consultations: [],
      uniquePatientCount: 0
    };
  }
};
