// je n'ai pas compris ce que tu demandais par cette fonctrion , j'ai donc imaginé cette suite 
/* GetUniquePatient va compter les documents dans la collection Patient, et retourner deux données ; 1- le nombre de document dans le collection  et 2-le  nombre de document unique en se basant sur le numéro de téléphone;deux documents ayant le même phone: "$phone" seront comptablisé comme un seul  , je crois que c'est bien comme ca que tu le voulais */

exports = async function() {
  const patientsCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Patient");

  try {
    // Compter le nombre total de documents dans la collection
    const totalPatientsCount = await patientsCollection.find({}).toArray();

    // Utiliser l'agrégation pour compter le nombre de documents uniques par numéro de téléphone
    const uniquePatientsCount = await patientsCollection.aggregate([
      {
        $group: {
          _id: "$phone",
          count: { $sum: 1 }
        }
      },
      {
        $count: "count"
      }
    ]).toArray();

    const result = {
      totalPatientsCount,
      uniquePatientsCount: uniquePatientsCount[0] ? uniquePatientsCount[0].count : 0
    };

    return result;
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { status: 'error', message: 'Erreur lors du comptage des patients.' };
  }
};
