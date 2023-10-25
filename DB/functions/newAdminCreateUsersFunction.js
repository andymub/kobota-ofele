const nodemailer = require('nodemailer');

exports = async function (adminId, newUser) {
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

 // Vérification que les champs obligatoires sont présents dans newUser
  if (!newUser) {
    return { message: "Les champs user_name, email et role sont obligatoires." };
  }

 
 // Vérification que le numéro de téléphone (phone--id) n'est pas déjà utilisé
const existingUser = await usersCollection.findOne({ id: newUser.phone });
if (existingUser) {
  return { message: "Un utilisateur avec le même numéro de téléphone existe déjà." };
}


  // Génération d'un mot de passe aléatoire s'il n'est pas fourni
  if (!newUser.passe) {
    newUser.passe = generateRandomPassword(6);
  }

   // Vérification que newUser.phone existe et attribuez-le à newUser.id
  if (newUser.phone !== undefined) {
    newUser.id = newUser.phone;
  } else {
    return { message: "Le numéro de téléphone est introuvable." };
  }

  // Champ createdBy avec l'adminId
  newUser.createdBy = adminId;

  // Enregistrement du nouvel utilisateur
  const result = await usersCollection.insertOne(newUser);

  if (result) {
    // Envoi de l'e-mail à l'utilisateur créé
    const emailResult = sendWelcomeEmail(newUser);
    if (emailResult) {
      return { message: "Utilisateur créé et email envoyé avec succès." };
    }
  }

  return { message: "Erreur lors de la création de l'utilisateur." };
};

// Fonction pour générer un mot de passe aléatoire
function generateRandomPassword(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

// Fonction pour envoyer un email de bienvenue
function sendWelcomeEmail(newUser) {
  // Créez un transporteur Nodemailer en utilisant vos informations d'authentification SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  // Définissez les informations de l'e-mail
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: newUser.email,
    subject: 'Bienvenue sur notre plateforme',
    text: `Bienvenue, ${newUser.user_name} ! Votre mot de passe temporaire est : ${newUser.passe}`,
  };

  // Envoyez l'e-mail
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
        reject(false);
      } else {
        console.log('E-mail de bienvenue envoyé :', info.response);
        resolve(true);
      }
    });
  });
}
