exports = async function({ query, headers, body }) {
  const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

  // Extraire les paramètres du corps de la requête
  const { agentEmail, newEstablishment } = body;

  // Vérifier si l'utilisateur avec l'email agentEmail est autorisé à ajouter un établissement
  const agent = await usersCollection.findOne({ email: agentEmail });

  // Vérifier si l'utilisateur agentEmail est un agent ou un Admin (vous pouvez personnaliser cette vérification)
  if (!agent || (agent.role !== "Agent" && agent.role !== "Admin")) {
    return { message: "Utilisateur non autorisé à ajouter un établissement." };
  }

  // Créer un nouvel établissement avec les données du corps de la requête
  const establishment = {
    establishment_name: newEstablishment.establishment_name,
    adress: newEstablishment.adress,
    contact: newEstablishment.contact,
    services: newEstablishment.services,
    establishment_type: newEstablishment.establishment_type,
    list_consultations: newEstablishment.list_consultations,
    validation_acces: true, // Mettre par défaut à true
    list_pharmacy: newEstablishment.list_pharmacy,
    createdBy: agent._id, // L'utilisateur(agent) qui a ajouté cet établissement
    agent: newEstablishment.agentId, // Assurez-vous que le champ correct est utilisé
  };

  // Insérer le nouvel établissement dans la collection Establishment
  const result = await establishmentCollection.insertOne(establishment);

  if (result.insertedId) {
    // L'établissement a été créé avec succès

    // Trouver le gérant dans la collection Users par ID (newEstablishment.agentId)
    const manager = await usersCollection.findOne({ _id: BSON.ObjectID(newEstablishment.agentId) });

    if (manager && manager.email) {
      // Utilisez le service SMTP pour envoyer un e-mail
      const transporter = nodemailer.createTransport({
        host: "mail.proastuces.com",
        port: 465,
        secure: true,
        auth: {
          user: "no-reply@proastuces.com",
          pass: "Pol€*2023"
        }
      });

      const subject = "Bienvenue sur notre plateforme";
      const message = `Vous êtes désormais le gérant de ${newEstablishment.establishment_name}. Utilisez ces identifiants pour vous connecter: 
      Identifiant: ${manager.email}
      Mot de passe: (il a été envoyé dans un e-mail )`; // lors de la création du User

      transporter.sendMail({
        from: "no-reply@proastuces.com",
        to: manager.email,
        subject: subject,
        text: message
      }, (error, info) => {
        if (error) {
          console.error(error);
          return { message: "Échec de l'envoi de l'e-mail au gérant." };
        } else {
          console.log('Email envoyé : ' + info.messageId);
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
