const nodemailer = require("nodemailer");

exports = async function createUser(email, user_name, role, phone) {
  if (!phone) {
  return { status: 'error', message: `Numéro de téléphone introuvable. Paramètre 'phone' reçu : ${phone}` }; // il est où ce fichu phone .....
}

  // Générer un mot de passe aléatoire
  const motDePasseAleatoire = genererMotDePasseAleatoire(6);

  try {
    // Ajoutez des données personnalisées à l'utilisateur
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");
    const nouvelUtilisateur = {
      email: email,
      user_name: user_name,
      role: role,
      validation_acces: true,
      passe: motDePasseAleatoire,
      phone: phone
    };

    const result = await usersCollection.insertOne(nouvelUtilisateur);

    if (result && result.insertedId) {
      // Envoi de l'e-mail de bienvenue
      // TODO : À Changer pour l'e-mail professionnel de kobota
      const transporter = nodemailer.createTransport({
        host: "mail.proastuces.com",
        port: 465,
        secure: true,
        auth: {
          user: "no-reply@proastuces.com",
          pass: "Pol€*2023"
        }
      });

      const message = {
        from: "no-reply@proastuces.com",
        to: email,
        subject: "Bienvenue sur notre plateforme kobota Ofele",
        text: `Bienvenue, ${user_name}!\nVotre nom d'utilisateur est : ${email}\nVotre mot de passe temporaire est : ${motDePasseAleatoire}`,
        html: `<p>Bienvenue, ${user_name}!</p><p>Votre nom d'utilisateur est : ${email}</p><p>Votre mot de passe temporaire est : ${motDePasseAleatoire}</p>`
      };

      const info = await transporter.sendMail(message);

      console.log("E-mail de bienvenue envoyé : %s", info.messageId);

      return { status: 'success', message: 'Utilisateur créé avec succès et e-mail de bienvenue envoyé.' };
    } else {
      return { status: 'error', message: 'Erreur lors de la création de l\'utilisateur.' };
    }
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
