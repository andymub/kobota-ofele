exports = async function({ query, headers, body }, response) {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

    try {
        // Convertir le corps de la requête JSON en objet JavaScript
        const newUser = JSON.parse(body.text());

        // Vérifier si un utilisateur avec le même nom d'utilisateur ou le même email existe déjà
        const existingUser = await usersCollection.findOne({ $or: [{ user_name: newUser.user_name }, { email: newUser.email }] });

        if (existingUser) {
            if (existingUser.user_name === newUser.user_name) {
                response.setStatusCode(400); // Code de réponse HTTP 400 pour une requête incorrecte
                response.setBody(JSON.stringify({ message: "Cet utilisateur existe déjà." }));
            } else if (existingUser.email === newUser.email) {
                response.setStatusCode(400); // Code de réponse HTTP 400 pour une requête incorrecte
                response.setBody(JSON.stringify({ message: "Cet email est déjà utilisé." }));
            }
        } else {
            // Insérer le nouvel utilisateur dans la collection "Users"
            const insertResult = await usersCollection.insertOne(newUser);

            // Vérifier si l'insertion a réussi
            if (insertResult.insertedId) {
                response.setBody(JSON.stringify({ message: "Utilisateur créé avec succès." }));
            } else {
                response.setStatusCode(500); // Code de réponse HTTP 500 pour une erreur interne du serveur
                response.setBody(JSON.stringify({ message: "Échec de la création de l'utilisateur." }));
            }
        }
    } catch (error) {
        response.setStatusCode(400); // Code de réponse HTTP 400 pour une requête incorrecte
        response.setBody(JSON.stringify({ message: `Erreur lors du traitement de la requête : ${error.message}` }));
    }
};
