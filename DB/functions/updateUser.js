exports = async function(userToUpdate, IdOldUsers) {
    const mongodb = context.services.get("mongodb-atlas");
    const usersCollection = mongodb.db("kobotaDB").collection("Users");

    try {
        // Convertir IdOldUsers en ObjectId
        const idOldUsersObjectId = BSON.ObjectId(IdOldUsers);

        // Vérifier si IdOldUsers est un ObjectId valide
        if (!/^[0-9a-fA-F]{24}$/.test(idOldUsersObjectId)) {
            throw new Error("Invalid ObjectId.");
        }

        // ... Le reste de votre code de mise à jour ...

        // Mettre à jour l'utilisateur dans la collection "Users" en utilisant l'IdOldUsers converti
        const updateResult = await usersCollection.updateOne({ _id: idOldUsersObjectId }, { $set: updateData });

        // ... Le reste de votre code de mise à jour ...

        if (updateResult.modifiedCount === 1) {
            // ... Le reste de votre code ...
        } else {
            throw new Error("Échec de la mise à jour de l'utilisateur. Veuillez vérifier les données fournies.");
        }
    } catch (error) {
        return error.message;
    }
};
