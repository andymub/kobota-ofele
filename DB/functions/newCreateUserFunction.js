// Créez la fonction createUser dans Realm
exports = async function createUser(email, user_name, fonction) {
  // Générez un mot de passe aléatoire
  const motDePasseAleatoire = genererMotDePasseAleatoire();

  try {
    // Utilisez les services d'authentification intégrés pour créer un utilisateur
    const newUser = await context.services.auth.createUser({
      email: email,
      password: motDePasseAleatoire,
    });

    // Obtenez l'ID de l'utilisateur créé
    const userId = newUser.id;

    // Ajoutez des données personnalisées à l'utilisateur
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");
    const nouvelUtilisateur = {
      _id: userId,
      email: email,
      user_name: user_name,
      fonction: fonction,
      validation_acces: true,
      passe: motDePasseAleatoire,
    };

    await usersCollection.insertOne(nouvelUtilisateur);

    // Envoyez un e-mail à l'utilisateur avec ses informations de connexion
    if (['agent', 'admin'].includes(fonction)) {
      // on peux utiliser un service d'e-mails tiers ou un service de notification pour envoyer des e-mails.
      // Ici, je suppose que via ton idéejos , tu voulais utiliser un service tiers qui envoie des e-mails.
      // Configurez le service d'e-mails  et remplacez les valeurs ci-dessous par celui de l'Email du domaine du projet .

      const emailService = context.services.get("your-email-service"); //ici , mettre le service si c'était gmail , on mettrait 'smtp.gmail.com'
      emailService.send({
        to: email,
        from: "votre_email", //par ici , vous allez mettre l'email du projet kobota, je ne sais pas si Balkis l'a déjà , bref ....
        subject: "Identifiants de connexion", //
        text: `Votre nom d'utilisateur est : ${email}\nVotre mot de passe temporaire est : ${motDePasseAleatoire}`,
      });
    }

    return { status: 'success', message: 'Utilisateur créé avec succès' };
  } catch (erreur) {
    return { status: 'error', message: 'Erreur lors de la création de l\'utilisateur.' };
  }
};
