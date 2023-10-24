/*
la fonction listAllClosedPatientFile réçoit l'id (num de téléphone)de l'établissement et 
elle va rechercher dans la collection Establishmentn le document qui correspond, 
dans son champs list_consultations; la fonction fait un compte de document clotûré, 
voici la procédure , une document est dit clôturé si objet dans list_consultations dont le champ patient_name est égale au 
champs 'phone' d'un document de la collection Patient et ce document(patient) doit impérativement avoir pour champs status 
différent de vide ou null.  si status n'est pas vide, donc le document n'est pas enclore clôturé
*/
exports = async function(establishmentPhone) {
  const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");
  const patientCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Patient");

  try {
    // Rechercher l'établissement par son numéro de téléphone (establishmentPhone)
    const establishment = await establishmentCollection.findOne({ "contact.phone": establishmentPhone });

    if (!establishment) {
      return { status: 'error', message: 'Établissement non trouvé.' };
    }

    // Compter les dossiers de patients clos
    let closedPatientFiles = 0;

    for (const consultation of establishment.list_consultations) {
      if (consultation.patient_name) {
        const patient = await patientCollection.findOne({ phone: consultation.patient_name });
        if (patient && (patient.status !== "" && patient.status !== null)) {
          closedPatientFiles++;
        }
      }
    }

    // Renvoyer le nombre de dossiers de patients clos
    return { status: 'success', count: closedPatientFiles };
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { status: 'error', message: 'Erreur lors du comptage des dossiers de patients clos.' };
  }
};
