exports = async function({ query, headers, body }) {
  const usersCollection = context.services
    .get("mongodb-atlas")
    .db("kobotaDB")
    .collection("Users");

  try {
    // Recherche de tous les utilisateurs dont validation_acces est true 
//soit on recherche directement les utilistateur qui sont valide , soit tu as la liste de tous le document valide et non //valide 
    const validUsers = await usersCollection
      .find({ validation_acces: true })
      .toArray();

    return validUsers;
  } catch (error) {
    console.error("Erreur lors de la recherche des utilisateurs :", error);
    return { status: "error", message: "Erreur lors de la recherche des utilisateurs." };
  }
};