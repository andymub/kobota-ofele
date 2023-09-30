exports = async function(userToUpdate, IdOldUsers) {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");
    const ObjectId = BSON.ObjectId;
    // Convertir IdOldUsers en ObjectId
const idOldUsersObjectId = ObjectId(IdOldUsers);

    try {
        // Check if the provided IdOldUsers is a valid ObjectId (hexadecimal string)
      if (!/^[0-9a-fA-F]{24}$/.test(idOldUsersObjectId)) {
    throw new Error("Invalid ObjectId.");
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
 // Mettre à jour l'utilisateur dans la collection "Users" en utilisant l'IdOldUsers converti
const updateResult = await usersCollection.updateOne({ _id: idOldUsersObjectId }, { $set: updateData });


        if (updateResult.modifiedCount === 1) {
            // Find and return the updated user document
            const updatedUser = await usersCollection.findOne({ _id: BSON.ObjectId(IdOldUsers) });
            return `L'utilisateur "${updatedUser.user_name}" a été mis à jour avec succès.`;
        } else {
            throw new Error("Échec de la mise à jour de l'utilisateur. Veuillez vérifier les données fournies.");
        }
    } catch (error) {
        return error.message;
    }
};
