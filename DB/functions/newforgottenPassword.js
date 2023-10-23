exports = async function(changeEvent) {
  const email = changeEvent.updateDescription.updatedFields.email;

  if (email) {
    // Recherchez l'utilisateur par e-mail
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");
    const user = await usersCollection.findOne({ email: email });

    if (user) {
      // Générez un token pour l'utilisateur (vous pouvez utiliser un package comme `jsonwebtoken`)
      const jwtToken = generateToken(user);

      // Configurez l'e-mail à envoyer
      const fromEmail = "votre@email.com"; // nous dévons avoir l'adress e-mail demandé dans le commentaire de la fonction 
//createuser ; on mettra le même ici 
      const toEmail = user.email; // Adresse e-mail de l'utilisateur
      const subject = "Réinitialisation de mot de passe";
      const resetPasswordLink = `https://votre-site.com/reset-password?token=${jwtToken}`;

      const textBody = `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetPasswordLink}`;
      const htmlBody = `<p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe : <a href="${resetPasswordLink}">${resetPasswordLink}</a></p>`;

      // Envoyez l'e-mail en utilisant le service SendGrid
      context.services
        .get("sendgrid")
        .send({
          to: toEmail,
          from: fromEmail,
          subject: subject,
          text: textBody,
          html: htmlBody,
        });

      return { message: "Un e-mail de réinitialisation a été envoyé à votre adresse." };
    } else {
      return { message: "Cette adresse e-mail n'est pas enregistrée dans le système." };
    }
  }

  return { message: "Aucune modification d'e-mail détectée." };
};