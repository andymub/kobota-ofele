exports = async function({ body }) {
    const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");

    try {
        // Extraire les données de la requête JSON
        const requestData = JSON.parse(body.text());

        // Extraire le nom de l'établissement de la requête JSON
        const establishmentName = requestData.establishment_name;

        // Extraire les données de mise à jour de la requête JSON
        const updatedData = requestData.updatedData;

        // Vérifier si les champs à mettre à jour ne sont pas vides ou nuls
        const updateData = {};

        if (updatedData.hospital_name != null && updatedData.hospital_name !== "") {
            updateData.hospital_name = updatedData.hospital_name;
        }

        // ... (autres champs à mettre à jour)

        // Mettre à jour l'établissement dans la collection en utilisant le nom de l'établissement
        const updateResult = await establishmentCollection.updateOne(
            { establishment_name: establishmentName },
            { $set: updateData }
        );

        if (updateResult.modifiedCount === 1) {
            // Si la mise à jour est réussie, retourner un message de succès
            return { message: `Mise à jour réussie pour l'établissement : ${establishmentName}` };
        } else {
            // Si aucun établissement n'est trouvé, retourner un message d'erreur avec le nom de l'établissement recherché
            return { message: `Établissement non trouvé avec le nom : ${establishmentName}` };
        }
    } catch (error) {
        // En cas d'erreur, retourner un message d'erreur
        console.error("Erreur : " + error.message);
        return { message: error.message };
    }
};
