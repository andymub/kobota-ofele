exports = async function (token) {
  const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

  // Obtenir l'ID de l'agent à partir du token
  const agentId = token.sub; // Assurez-vous que le token contient l'ID de l'agent

  // Vérifier si l'agent existe
  const agent = await usersCollection.findOne({ _id: BSON.ObjectID(agentId) });

  if (!agent) {
    return { message: "Agent non trouvé." };
  }

  if (agent.fonction !== "agent") {
    return { message: "Cet utilisateur n'est pas un agent." };
  }

  // Récupérer tous les établissements créés par cet agent, jos le num de l'agent est son ID unique , du coup je fais une récherche par phone 
  const establishments = await establishmentCollection.find({ "agent": agent.phone }).toArray();

  // les informations de géolocalisation que tu voulais , sont dans chaque établissement 

  return establishments;
};
