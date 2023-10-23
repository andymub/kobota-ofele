exports = async function (agentId, establishmentId) {
  const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

  // Vérifier si l'agent existe
  //const agent = await usersCollection.findOne({ _id: BSON.ObjectID(agentId });
    const agent = await usersCollection.findOne({ _id: BSON.ObjectID(agentId) });//correctioin par ici ...

  if (!agent) {
    return { message: "Agent non trouvé." };
  }

  if (agent.fonction !== "agent") {
    return { message: "Cet utilisateur n'est pas un agent." };
  }

  // Rechercher l'établissement en fonction de l'ID de l'agent et de l'ID de l'établissement
  const establishment = await establishmentCollection.findOne({
    _id: BSON.ObjectID(establishmentId),
    agent: agentId
  });

  if (establishment) {
    return establishment;
  } else {
    return { message: "Établissement non trouvé." };
  }
};