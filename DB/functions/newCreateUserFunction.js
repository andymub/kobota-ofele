exports = async function createUser(email, user_name, role, phone) {
  // Vérifier si le numéro de téléphone est vide
  if (!phone) {
    return { status: 'error', message: 'Numéro de téléphone introuvable' };
  }

  // Générer un mot de passe aléatoire
  const motDePasseAleatoire = genererMotDePasseAleatoire(6);

  try {
    // Obtenez l'ID de l'utilisateur créé
    const userId = phone; // Vous devrez obtenir l'ID de l'utilisateur autrement

    // Ajoutez des données personnalisées à l'utilisateur
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");
    const nouvelUtilisateur = {
      _id: userId,
      email: email,
      user_name: user_name,
      role: role, // Remplacement de "fonction" par "role"
      validation_acces: true,
      passe: motDePasseAleatoire,
      phone: phone // Ajouter le numéro de téléphone ici également
    };

    await usersCollection.insertOne(nouvelUtilisateur);

    return { status: 'success', message: 'Utilisateur créé avec succès' };
  } catch (erreur) {
    return { status: 'error', message: 'Erreur lors de la création de l\'utilisateur.' };
  }
};

function genererMotDePasseAleatoire(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const passwordArray = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    passwordArray.push(characters.charAt(randomIndex));
  }

  return passwordArray.join('');
}
