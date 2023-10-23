exports = async function (adminId, newUser) {
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");
  
  // Vérification que les champs obligatoires sont présents dans le newUser
  if (!newUser.user_name || !newUser.email || !newUser.fonction) {
    return { message: "Les champs user_name, email et fonction sont obligatoires." };
  }
  
  // Vérification que l'email et le user_name ne sont pas déjà utilisés dans le collection User
  const existingUser = await usersCollection.findOne({ $or: [{ email: newUser.email }, { user_name: newUser.user_name }] });
  if (existingUser) {
    return { message: "Un utilisateur avec le même email ou le même user_name existe déjà." };
  }
  
  // Génération d'un mot de passe aléatoire s'il n'est pas fourni 
//je proposes que le systéme génére un passe pour ce user, il le récevra par émail , vérifier si pass est vide et là on générer un pass , bref ...
  if (!newUser.passe) {
    newUser.passe = generateRandomPassword();
  }
  
  //champ createdBy avec l'adminId
  newUser.createdBy = adminId;
  
  // Enregistrement du nouvel utilisateur
  const result = await usersCollection.insertOne(newUser);
  
  if (result) {
    // Envoi de l'email à l'utilisateur créé
//le focntion sendWelcomeEmaile , féra l'envoie du message de bienvenue au user avec son email et pass inclus 
    const emailResult = sendWelcomeEmail(newUser);
    if (emailResult) {
      return { message: "Utilisateur créé et email envoyé avec succès." };
    }
  }
  
  return { message: "Erreur lors de la création de l'utilisateur." };
};

// Fonction pour générer un mot de passe aléatoire
function generateRandomPassword() {
  const length = 6;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

// Fonction pour envoyer un email de bienvenue
// Fonction pour envoyer un email de bienvenue
function sendWelcomeEmail(newUser) {
  // Créez un transporteur Nodemailer en utilisant vos informations d'authentification SMTP
  const transporter = nodemailer.createTransport({
    host: 'votre_host_smtp', // Par ex 'smtp.gmail.com' pour gmail 
    port: 587, // Port SMTP
    secure: false, 
    auth: {
      user: 'votre_email', // Votre adresse e-mail prof
      pass: 'votre_mot_de_passe', // Votre mot de passe
    },
  });

  // Définissez les informations de l'e-mail
  const mailOptions = {
    from: 'votre_email', // Votre adresse e-mail
    to: newUser.email, // L'adresse e-mail de l'utilisateur créé
    subject: 'Bienvenue sur notre plateforme',
    text: `Bienvenue, ${newUser.user_name} ! Votre mot de passe temporaire est : ${newUser.passe}`,
  };

  // Envoyez l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
      return false;
    } else {
      console.log('E-mail de bienvenue envoyé :', info.response);
      return true;
    }
  });
}