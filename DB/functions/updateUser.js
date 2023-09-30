exports = async function(userToUpdate) {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

    // Extraire les valeurs des arguments passés
    const {
        user_name,
        new_address,
        new_email,
        new_function,
        new_roles,
        new_validation_acces,
        new_password
    } = userToUpdate;

    // Définir les modifications à apporter
    const updateData = {};

    // Vérifier chaque champ et les inclure s'ils ne sont pas vides ou nuls
    if (new_address !== null && new_address !== "") {
        updateData["adress"] = new_address;
    }

    if (new_email !== null && new_email !== "") {
        updateData["email"] = new_email;
    }

    if (new_function !== null && new_function !== "") {
        updateData["fonction"] = new_function;
    }

    if (new_roles !== null && new_roles !== "") {
        updateData["roles"] = new_roles;
    }

    if (new_validation_acces !== null && new_validation_acces !== "") {
        updateData["validation_acces"] = new_validation_acces;
    }

    if (new_password !== null && new_password !== "") {
        updateData["passe"] = new_password;
    }

    // Mettre à jour l'utilisateur dans la collection "Users"
    const updateResult = await usersCollection.updateOne({ user_name: user_name }, { $set: updateData });

    if (updateResult.modifiedCount === 1) {
        return "Utilisateur mis à jour avec succès.";
    } else {
        return "Échec de la mise à jour de l'utilisateur.";
    }
};
