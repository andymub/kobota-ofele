exports = async function(phone, updatedData) {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

    try {
        // Convertir le numéro de téléphone en chaîne de caractères
        phone = phone.toString();

        // Définir les données de mise à jour en fonction de updatedData
        const updateData = {};

        if (updatedData.user_name != null && updatedData.user_name !== "") {
            updateData.user_name = updatedData.user_name;
        }

        if (updatedData.passe != null && updatedData.passe !== "") {
            updateData.passe = updatedData.passe;
        }

        if (updatedData.email != null && updatedData.email !== "") {
            updateData.email = updatedData.email;
        }

        if (updatedData.adress != null) {
            updateData.adress = updatedData.adress;
        }

        if (updatedData.fonction != null && updatedData.fonction !== "") {
            updateData.fonction = updatedData.fonction;
        }

        if (updatedData.validation_acces !== undefined) {
            updateData.validation_acces = updatedData.validation_acces;
        }

        if (updatedData.work_adress != null && updatedData.work_adress !== "") {
            updateData.work_adress = updatedData.work_adress;
        }

        if (updatedData.roles != null && updatedData.roles !== "") {
            updateData.roles = updatedData.roles;
        }

        // Mettre à jour l'utilisateur dans la collection en utilisant le numéro de téléphone
        const updateResult = await usersCollection.updateOne(
            { phone: phone },
            { $set: updateData }
        );

        if (updateResult.modifiedCount === 1) {
            // Si la mise à jour est réussie, retourner un message de succès avec le numéro de téléphone
            return { message: `Mise à jour réussie pour l'utilisateur avec le numéro de téléphone : ${phone}` };
        } else {
            // Si aucun utilisateur n'est trouvé, retourner un message d'erreur avec le numéro de téléphone recherché
            return { message: `Utilisateur non trouvé avec le numéro de téléphone : ${phone}` };
        }
    } catch (error) {
        // En cas d'erreur, retourner un message d'erreur
        console.error("Erreur : " + error.message);
        return { message: error.message };
    }
};
