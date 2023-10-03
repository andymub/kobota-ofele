exports = async function({ query, headers, body }, response) {
    const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("establishment");

    try {
        // Convertir le corps de la requête JSON en objet JavaScript
        const newEstablishment = JSON.parse(body.text());

        // Insérer le nouvel établissement dans la collection "establishment"
        const insertResult = await establishmentCollection.insertOne(newEstablishment);

        // Vérifier si l'insertion a réussi
        if (insertResult.insertedId) {
            response.setStatusCode(201); // Code de réponse HTTP 201 pour une création réussie
            response.setBody(JSON.stringify({ message: "Établissement créé avec succès." }));
        } else {
            response.setStatusCode(500); // Code de réponse HTTP 500 pour une erreur interne du serveur
            response.setBody(JSON.stringify({ message: "Échec de la création de l'établissement." }));
        }
    } catch (error) {
        response.setStatusCode(400); // Code de réponse HTTP 400 pour une requête incorrecte
        response.setBody(JSON.stringify({ message: `Erreur lors du traitement de la requête : ${error.message}` }));
    }
};
