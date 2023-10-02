exports = async function(userToUpdate, nameOldUsers) {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");
    const ObjectId = BSON.ObjectId;

    try {
        // Convertir nameOldUsers en chaîne de caractères
        nameOldUsers = nameOldUsers.toString();

        // Convertir userToUpdate en objet
        userToUpdate = JSON.parse(userToUpdate);

        // Définir les données de mise à jour en fonction de userToUpdate
        const updateData = {};

        // Extraire les champs de userToUpdate et de updateData s'ils ne sont pas vides
        if (userToUpdate.new_address) {
            updateData["adress"] = userToUpdate.new_address;
        }

        if (userToUpdate.new_email) {
            updateData["email"] = userToUpdate.new_email;
        }

        if (userToUpdate.new_function) {
            updateData["fonction"] = userToUpdate.new_function;
        }

        if (userToUpdate.new_roles) {
            updateData["roles"] = userToUpdate.new_roles;
        }

        if (userToUpdate.new_validation_acces !== undefined) {
            updateData["validation_acces"] = userToUpdate.new_validation_acces;
        }

        if (userToUpdate.new_password) {
            updateData["passe"] = userToUpdate.new_password;
        }

        // Mettre à jour le document utilisateur dans la collection "Users" en utilisant user_name
        const updateResult = await usersCollection.updateOne(
            { user_name: nameOldUsers },
            { $set: updateData }
        );

        if (updateResult.modifiedCount === 1) {
            // Trouver et retourner le document utilisateur mis à jour
            const updatedUser = await usersCollection.findOne({ user_name: userToUpdate.user_name });
            return updatedUser;
        } else {
            throw new Error("Échec de la mise à jour de l'utilisateur. Veuillez vérifier les données fournies.");
        }
    } catch (error) {
        return error.message;
    }
};
