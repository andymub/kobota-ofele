exports = async function(passedEmail) {
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");
  
  try {
    // Vérifiez si passedEmail est une chaîne de caractères, sinon, convertissez-le
    const email = typeof passedEmail === 'string' ? passedEmail : passedEmail.toString();
    
    // Recherche d'un utilisateur par e-mail (sensible à la casse)
    const user = await usersCollection.findOne({ email: email });
    
    if (user) {
      // Si un utilisateur avec cet e-mail est trouvé, retournez-le
      return user;
    } else {
      return { message: "Aucun utilisateur trouvé avec l'e-mail recherché : " + email };
    }
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { message: "Erreur lors de la recherche de l'utilisateur." };
  }
}
