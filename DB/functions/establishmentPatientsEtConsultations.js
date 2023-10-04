exports = async function({ body }) {
  try {
    // Extraire le champ 'establishment_name' du corps de la requête JSON
    const establishmentName = body;

    // Rechercher le document dans la collection en utilisant le nom de l'établissement
    const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");
    const document = await establishmentCollection.findOne({ establishment_name: establishmentName });

    if (!document) {
      return { message: `Établissement non trouvé avec le nom : ${establishmentName}` };
    }

    // Vérifier si le document a le champ 'list_consultations'
    if (document.list_consultations && Array.isArray(document.list_consultations)) {
      const listConsultations = document.list_consultations;

      // Nombre d'éléments dans la liste 'list_consultations'
      const consultationCount = listConsultations.length;

      // Liste du contenu de 'list_consultations'
      const consultations = listConsultations.map(consultation => consultation.details);

      // Nombre de patients uniques dans 'list_consultations'
      const uniquePatients = new Set();
      listConsultations.forEach(consultation => {
        if (consultation.patient_name) {
          uniquePatients.add(consultation.patient_name);
        }
      });
      const uniquePatientCount = uniquePatients.size;

      // Retourner les résultats
      return {
        consultationCount: consultationCount,
        consultations: consultations,
        uniquePatientCount: uniquePatientCount
      };
    } else {
      return { message: "Le document ne contient pas de champ 'list_consultations' ou il n'est pas une liste." };
    }
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { message: "Une erreur s'est produite lors du traitement du document." };
  }
};
