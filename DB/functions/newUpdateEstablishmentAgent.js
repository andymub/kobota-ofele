exports = async function (agentId, establishmentId, newEstablishmentData) {
  const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

  // Vérifier si l'agent existe
 // const agent = await usersCollection.findOne({ _id: BSON.ObjectID(agentId });
 const agent = await usersCollection.findOne({ _id: BSON.ObjectID(agentId) });

  if (!agent) {
    return { message: "Agent non trouvé." };
  }

  if (agent.fonction !== "agent") {
    return { message: "Cet utilisateur n'est pas un agent." };
  }

  // Vérifier si les nouvelles données ne sont ni vides ni nulles
  if (!newEstablishmentData || Object.keys(newEstablishmentData).length === 0) {
    return { message: "Aucune donnée valide fournie pour la mise à jour." };
  }

  // Vérifier si l'établissement existe
  const existingEstablishment = await establishmentCollection.findOne({ _id: BSON.ObjectID(establishmentId) });

  if (!existingEstablishment) {
    return { message: "Établissement non trouvé." };
  }

  // Mettre à jour les informations de l'établissement avec les nouvelles données
  const updateResult = await establishmentCollection.updateOne(
    { _id: BSON.ObjectID(establishmentId) },
    { $set: newEstablishmentData }
  );

  if (updateResult.matchedCount === 1) {
    return { message: `Établissement "${existingEstablishment.establishment_name}" mis à jour.` };
  } else {
    return { message: "Établissement non mis à jour." };
  }
};