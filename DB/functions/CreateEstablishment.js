exports = async function({ query, headers, body }, response) {
    const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

    try {
        // Convertir le corps de la requête JSON en objet JavaScript
        const newEstablishment = JSON.parse(body.text());

        // Insérer le nouvel établissement dans la collection "establishment"
        const insertResult = await establishmentCollection.insertOne(newEstablishment);

        // Vérifier si l'insertion a réussi
        if (insertResult.insertedId) {
            response.setStatusCode(201); // Code de réponse HTTP 201 pour une création réussie
            response.setBody(JSON.stringify({ message: "Établissement créé avec succès." }));

            // Vérifier si le champ "agent" n'est pas vide dans le nouvel établissement
            if (newEstablishment.agent) {
                // Rechercher l'utilisateur ayant le numéro de téléphone équivalent à "agent"
                const userToUpdate = await usersCollection.findOne({ phone: newEstablishment.agent });

                // Mettre à jour le champ "work_adress" de cet utilisateur avec la valeur de "establishment_name"
                if (userToUpdate) {
                    const updateResult = await usersCollection.updateOne(
                        { _id: userToUpdate._id },
                        { $set: { work_adress: newEstablishment.establishment_name } }
                    );

                    if (updateResult.modifiedCount === 1) {
                        console.log("Mise à jour de work_adress effectuée avec succès.");
                    } else {
                        console.error("Échec de la mise à jour de work_adress.");
                    }
                }
            }
        } else {
            response.setStatusCode(500); // Code de réponse HTTP 500 pour une erreur interne du serveur
            response.setBody(JSON.stringify({ message: "Échec de la création de l'établissement." }));
        }
    } catch (error) {
        response.setStatusCode(400); // Code de réponse HTTP 400 pour une requête incorrecte
        response.setBody(JSON.stringify({ message: `Erreur lors du traitement de la requête : ${error.message}` }));
    }
};
