exports = async function({ body }) {
  try {
    // Extraire le document depuis le corps de la requête
    const document = body;

    // Vérifier si le document a le champ 'list_consultations'
    if (document && document.list_consultations && Array.isArray(document.list_consultations)) {
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
