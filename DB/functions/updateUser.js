exports = async function({ body }) {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

    try {
        // Extraire les données de la requête JSON
        const requestData = JSON.parse(body.text());

        // Extraire le numéro de téléphone de la requête JSON
        const phone = requestData.phone.toString();

        // Extraire les données de mise à jour de la requête JSON
        const updatedData = requestData.updatedData;

        // Définir les données de mise à jour en fonction de updatedData
        const updateData = {
            // Mettez ici les champs que vous souhaitez mettre à jour
            user_name: updatedData.user_name,
            passe: updatedData.passe,
            // ... autres champs
        };

        // Mettre à jour l'utilisateur dans la collection en utilisant le numéro de téléphone
        const updateResult = await usersCollection.updateOne(
            { phone: phone },
            { $set: updateData }
        );

        if (updateResult.modifiedCount === 1) {
            // Si la mise à jour est réussie, retourner un message de succès
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
