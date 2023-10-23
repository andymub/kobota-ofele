exports = async function (jwtToken, body) {
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

  // Vérifier si l'utilisateur existe
  const user = jwt.decode(jwtToken); // Décoder le JWT pour obtenir les données de l'utilisateur

  if (!user) {
    return { message: "Utilisateur introuvable. JWT invalide." };
  }

  // Vérifier si l'utilisateur existe dans la collection
  const existingUser = await usersCollection.findOne({ _id: BSON.ObjectID(user.sub) });

  if (!existingUser) {
    return { message: "Utilisateur introuvable." };
  }

  // Vérifier que l'utilisateur actuel correspond à l'utilisateur à mettre à jour
  if (user.sub !== existingUser._id.toString()) {
    return { message: "Vous n'êtes pas autorisé à mettre à jour cet utilisateur." };
  }

  // Extraire les champs du corps de la requête
  const { user_name, password, adress, fonction, validation_acces, work_adress, phone } = body;

  // Vérifier si les champs ne sont pas vides ou nuls et les mettre à jour si nécessaire
  if (user_name) {
    existingUser.user_name = user_name;
  }

  if (password) {
    existingUser.passe = password;
  }

  if (adress) {
    if (adress.province) {
      existingUser.adress.province = adress.province;
    }

    if (adress.ville) {
      existingUser.adress.ville = adress.ville;
    }

    if (adress.commune) {
      existingUser.adress.commune = adress.commune;
    }
  }

  if (fonction) {
    existingUser.fonction = fonction;
  }

  if (validation_acces != null) {
    existingUser.validation_acces = validation_acces;
  }

  if (work_adress) {
    existingUser.work_adress = work_adress;
  }

  if (phone) {
    existingUser.phone = phone;
  }

  // Mettre à jour le document utilisateur
  await usersCollection.updateOne({ _id: existingUser._id }, existingUser);

  return { message: "Utilisateur mis à jour avec succès.", user: existingUser };
};
