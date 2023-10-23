//dans la fonction deleteEstablishment 
//fonction va marquer un établissement comme supprimé en mettant à jour les champs validation_acces =false, deletedBy et //deletedAt :  je crois qu'il est plutôt sage de garder ces données et le rendre juste out of service pour les agents 

exports = async function (agentId, establishmentId) {
  const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

  // Vérifier si l'agent existe
  const agent = await usersCollection.findOne({ _id: BSON.ObjectID(agentId) });

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

  if (!establishment) {
    return { message: "Établissement non trouvé." };
  }

  // Mettre à jour l'établissement pour le marquer comme supprimé
  const updatedEstablishment = {
    $set: {
      validation_acces: false,
      deletedBy: agentId,
      deletedAt: new Date()
    }
  };

  const result = await establishmentCollection.updateOne({ _id: establishment._id }, updatedEstablishment);

  if (result.modifiedCount === 1) {
    return { status: 204, message: "Établissement marqué comme supprimé." };
  } else {
    return { message: "Erreur lors de la mise à jour de l'établissement." };
  }
};