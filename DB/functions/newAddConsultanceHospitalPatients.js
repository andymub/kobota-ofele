/*
mettre à jour la collection patient et Establishment avec les données de la nouvelle consulation 
*/
exports = async function(patientId, establishmentId, type_consultation, description, liste_de_prescription)

{
  const patientsCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Patient");
  const establishmentsCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");

  try {
    // Rechercher le patient par numéro de téléphone (patientId)
    const patient = await patientsCollection.findOne({ phone: patientId });

    if (!patient) {
      return { status: 'error', message: 'Patient non trouvé.' };
    }

    // Vérifier si le champ "statuts" est vide
    if (!patient.statuts) {
      // Créer un objet de consultation
      const newConsultation = {
        type: type_consultation,
        hospital: establishmentId,
        date: new Date(),
        prescription: liste_de_prescription,
        details: description,
      };

      // Mettre à jour les consultations du patient
      patient.consultations.push(newConsultation);
      await patientsCollection.updateOne({ _id: patient._id }, { $set: { consultations: patient.consultations } });

      // Rechercher l'établissement par téléphone (establishmentId)
      const establishment = await establishmentsCollection.findOne({ phone: establishmentId });

      if (establishment && establishment.validation_acces === true) {
        // Ajouter la nouvelle consultation dans "list_consultations" de l'établissement
        const newEstablishmentConsultation = {
          date: newConsultation.date,
          patient_id: patientId,
          details: newConsultation.details,
        };

        if (!establishment.list_consultations) {
          establishment.list_consultations = [];
        }

        establishment.list_consultations.push(newEstablishmentConsultation);
        await establishmentsCollection.updateOne({ _id: establishment._id }, { $set: { list_consultations: establishment.list_consultations } });
      }

      return { status: 'success', message: `La consultation de la patiente ${patientId} a été enregistrée.` };
    } else {
      return { status: 'error', message: `Le statut de la patiente ${patientId} est déjà rempli.` };
    }
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { status: 'error', message: 'Erreur lors de la création de la consultation.' };
  }
};