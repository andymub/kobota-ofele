exports = async function(establishment_type) {
    const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");

    try {
        // Créer une requête qui recherche des établissements en fonction du champ 'establishment_type'
        const query = {};

        if (establishment_type) {
            query.establishment_type = establishment_type;
        }

        // Utiliser la méthode find pour obtenir les documents correspondants à la requête
        const establishments = await establishmentCollection.find(query).toArray();

        return establishments;
    } catch (error) {
        // En cas d'erreur, retourner un message d'erreur
        console.error("Erreur : " + error.message);
        return { message: error.message };
    }
};
