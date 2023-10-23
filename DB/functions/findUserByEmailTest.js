exports = async function(email) {
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");
  
  try {
    // Recherche d'un utilisateur par e-mail (en utilisant la méthode de recherche insensible à la casse)
    const user = await usersCollection.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    
    if (user) {
      // Si un utilisateur avec cet e-mail est trouvé, retournez-le
      return user;
    } else {
      return { message: "Aucun utilisateur trouvé avec cet e-mail." };
    }
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { message: "Erreur lors de la recherche de l'utilisateur." };
  }
}
