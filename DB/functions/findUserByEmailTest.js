exports = async function(passedEmail) {
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

  // Assurez-vous que passedEmail est une chaîne de caractères (string)
  if (typeof passedEmail !== 'string') {
    return { message: "L'e-mail passé n'est pas une chaîne de caractères valide." };
  }
  
  try {
    // Recherche d'un utilisateur par e-mail (sensible à la casse)
    const user = await usersCollection.findOne({ email: passedEmail });
    
    if (user) {
      // Si un utilisateur avec cet e-mail est trouvé, retournez-le
      return user;
    } else {
      return { message: "Aucun utilisateur trouvé avec l'e-mail recherché : " + passedEmail };
    }
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { message: "Erreur lors de la recherche de l'utilisateur." };
  }
}
