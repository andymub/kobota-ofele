exports = async function({ query, headers, body, response }) {
  const jwt = require('jsonwebtoken');
  const nodemailer = require("nodemailer");
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

  try {
    // Convertir le corps de la requête JSON en objet JavaScript
    const userEmail = JSON.parse(body.text());

    // Assurez-vous que le corps de la requête contient l'e-mail
    if (!userEmail.email) {
      response.setStatusCode(400);
      return { status: 'fail', message: 'Veuillez fournir une adresse e-mail.' };
    }

    const email = userEmail.email;

    // Vérifier si l'e-mail est bien formé
    if (!validateEmail(email)) {
      response.setStatusCode(400);
      return { status: 'fail', message: 'Adresse e-mail invalide.' };
    }

    // Rechercher l'utilisateur par e-mail
    const user = await usersCollection.findOne({ email: email });

    if (user) {
      // Générer un mot de passe aléatoire de 6 caractères
      const newPassword = generateRandomPassword(6);

      // Mettez à jour le mot de passe de l'utilisateur dans la base de données
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { passe: newPassword } }
      );

      // Envoyer le nouveau mot de passe par e-mail
      sendPasswordResetEmail(email, newPassword);

      return { status: 'success', message: 'Un nouveau mot de passe a été envoyé à votre adresse e-mail.' };
    } else {
      response.setStatusCode(404);
      return { status: 'fail', message: 'Cette adresse e-mail n\'est pas enregistrée dans le système.' };
    }
  } catch (error) {
    response.setStatusCode(500);
    console.error("Erreur : " + (error ? error.message : 'error is undefined'));
    return { status: 'error', message: 'Erreur lors du traitement de la requête.' + (error ? error.message : '') };
  }
};

// Fonction de validation de l'e-mail
function validateEmail(email) {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

// Fonction de génération de mot de passe aléatoire
function generateRandomPassword(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let newPassword = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    newPassword += characters.charAt(randomIndex);
  }
  return newPassword;
}

// Fonction d'envoi d'e-mail
function sendPasswordResetEmail(email, password) {
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
    subject: "Réinitialisation de mot de passe",
    text: `Votre nouveau mot de passe est : ${password}`,
    html: `<p>Votre nouveau mot de passe est : <strong>${password}</strong></p>`
  };

  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.error("Erreur lors de l'envoi de l'e-mail : " + error.message);
    } else {
      console.log("E-mail de réinitialisation de mot de passe envoyé : %s", info.messageId);
    }
  });
}
