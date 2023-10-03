exports = async function({ body }) {
    const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");

    try {
        // Convertir le corps de la requête JSON en objet JavaScript
        const requestBody = JSON.parse(body.text());

        // Extraire la valeur du champ "establishment_type" du corps de la requête
        const establishmentType = requestBody.establishment_type;

        let query = {};

        if (establishmentType) {
            query = { establishment_type: establishmentType };
        }

        // Utiliser la méthode find avec la requête pour obtenir les documents correspondants
        const establishments = await establishmentCollection.find(query).toArray();

        return establishments;
    } catch (error) {
        // En cas d'erreur, retourner un message d'erreur
        console.error("Erreur : " + error.message);
        return { message: error.message };
    }
};
