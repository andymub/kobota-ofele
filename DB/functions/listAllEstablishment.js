exports = async function() {
    const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");

    try {
        // Utiliser la méthode find pour obtenir tous les documents de la collection
        const allEstablishments = await establishmentCollection.find({}).toArray();

        return allEstablishments;
    } catch (error) {
        // En cas d'erreur, retourner un message d'erreur
        console.error("Erreur : " + error.message);
        return { message: error.message };
    }
};
