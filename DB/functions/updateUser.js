exports = async function(userToUpdate, nameOldUsers) {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");
    const ObjectId = BSON.ObjectId;

    try {
        // Convert nameOldUsers to a string
        nameOldUsers = nameOldUsers.toString();

        // Convert userToUpdate to an object
        userToUpdate = JSON.parse(userToUpdate);

        // Define the update data based on userToUpdate
        const updateData = {};

        // Extract fields from userToUpdate and updateData if they are not empty
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

        // Update the user document in the "Users" collection based on user_name
        const updateResult = await usersCollection.updateOne(
            { user_name: nameOldUsers },
            { $set: updateData }
        );

        if (updateResult.modifiedCount === 1) {
            // Find and return the updated user document
            const updatedUser = await usersCollection.findOne({ user_name: userToUpdate.user_name });
            return updatedUser;
        } else {
            throw new Error("Échec de la mise à jour de l'utilisateur. Veuillez vérifier les données fournies.");
        }
    } catch (error) {
        return error.message;
    }
};
