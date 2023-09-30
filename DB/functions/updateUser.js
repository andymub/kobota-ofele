exports = async function(userToUpdate, IdOldUsers) {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

    // Check if the provided IdOldUsers is a valid ObjectId
    if (!BSON.ObjectId.isValid(IdOldUsers)) {
        return "Invalid ObjectId.";
    }

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

    // Mettre à jour l'utilisateur dans la collection "Users" en utilisant l'IdOldUsers
    const updateResult = await usersCollection.updateOne({ _id: BSON.ObjectId(IdOldUsers) }, { $set: updateData });

    if (updateResult.modifiedCount === 1) {
        // Find and return the updated user document
        const updatedUser = await usersCollection.findOne({ _id: BSON.ObjectId(IdOldUsers) });
        return updatedUser;
    } else {
        return "Échec de la mise à jour de l'utilisateur.";
    }
};
