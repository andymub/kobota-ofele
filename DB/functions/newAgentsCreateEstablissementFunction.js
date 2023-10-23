exports = async function (managerId, agentId, body) {
  const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

  // Vérifier si l'utilisateur agentId est autorisé à ajouter un établissement
  const agent = await usersCollection.findOne({ _id: BSON.ObjectID(agentId) });

  // Vérifier si l'utilisateur agentId est agent ou un Admin (vous pouvez personnaliser cette vérification)
  if (!agent || (agent.fonction !== "agent" && agent.fonction !== "Admin")) {
    return { message: "Utilisateur non autorisé à ajouter un établissement." };
  }

  // Créer un nouvel établissement avec les données du corps de la requête
  const establishment = {
    establishment_name: body.establishment_name,
    adress: body.adress,
    contact: body.contact,
    services: body.services,
    establishment_type: body.establishment_type,
    list_consultations: body.list_consultations,
    validation_acces: true, // Mettre par défaut à true
    list_pharmacy: body.list_pharmacy,
    createdBy: agentId, // L'utilisateur(agent) qui a ajouté cet établissement
    agent: managerId,
  };

  // Insérer le nouvel établissement dans la collection Establishment
  const result = await establishmentCollection.insertOne(establishment);

  if (result.insertedId) {
    // L'établissement a été créé avec succès

    // Trouver le gérant dans la collection Users par ID (managerId)
    const manager = await usersCollection.findOne({ _id: BSON.ObjectID(managerId) });

    if (manager && manager.email) {
      // Utilisez le service SMTP pour envoyer un e-mail
      // envoi d'e-mail configuration SMTP)
      const transporter = nodemailer.createTransport({
        service: 'votre_service_email', //c'est notre nom de domaine
        // exemple pour Gmail, nous utiliserons 'smtp.gmail.com'
        auth: {
          user: 'votre_email', //mettre email du projet
          pass: 'votre_mot_de_passe_email' //le password 
        }
      });

      const subject = "Bienvenue sur notre plateforme";
      const message = `Vous êtes désormais le gérant de ${body.establishment_name}. Utilisez ces identifiants pour vous connecter: 
      Identifiant: ${manager.email}
      Mot de passe: (il a été envoyé dans un e-mail )`; // lors de la création du User

      transporter.sendMail({
        from: 'votre_email', //Merci de mettre l'émail du projet stp
        to: manager.email,
        subject: subject,
        text: message
      }, (error, info) => {
        if (error) {
          console.error(error);
          return { message: "Échec de l'envoi de l'e-mail au gérant." };
        } else {
          console.log('Email envoyé : ' + info.response);
          // Éventuellement, vous pouvez effectuer d'autres actions après l'envoi de l'e-mail.
        }
      });
    } 

    return {
      message: "L'établissement a été créé avec succès, et un e-mail a été envoyé au gérant.",
      establishment: establishment,
    };
  } else {
    return { message: "Échec de la création de l'établissement." };
  }
};
