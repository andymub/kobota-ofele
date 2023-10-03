exports = async function({ query, headers, body }, response) {
    try {
        // Vérifiez si le corps de la requête est défini et n'est pas vide
        if (!body) {
            response.setStatusCode(400); // Code de réponse HTTP 400 pour une requête incorrecte
            response.setBody(JSON.stringify({ message: "Le corps de la requête est vide ou non défini." }));
            return;
        }

        // Convertissez le corps de la requête JSON en objet JavaScript
        const requestBody = JSON.parse(body.text());

        // Vérifiez si l'objet contient la propriété "establishment_type"
        if (!requestBody.establishment_type) {
            // Si "establishment_type" n'est pas défini, listez tous les documents dans la collection
            const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");
            const allEstablishments = await establishmentCollection.find({}).toArray();
            response.setStatusCode(200);
            response.setBody(JSON.stringify(allEstablishments));
        } else {
            // Si "establishment_type" est défini, filtrez les documents par ce type
            const establishmentType = requestBody.establishment_type;
            const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");
            const filteredEstablishments = await establishmentCollection.find({ establishment_type: establishmentType }).toArray();
            response.setStatusCode(200);
            response.setBody(JSON.stringify(filteredEstablishments));
        }
    } catch (error) {
        response.setStatusCode(500); // Code de réponse HTTP 500 pour une erreur interne du serveur
        response.setBody(JSON.stringify({ message: `Erreur lors du traitement de la requête : ${error.message}` }));
    }
};
