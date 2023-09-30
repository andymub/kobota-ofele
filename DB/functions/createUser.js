exports = async function({ body }) {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

    try {
        // Convertir le corps de la requête JSON en objet JavaScript
        const newUser = JSON.parse(body.text());

        // Vérifier si un utilisateur avec le même nom d'utilisateur ou le même email existe déjà
        const existingUser = await usersCollection.findOne({ $or: [{ user_name: newUser.user_name }, { email: newUser.email }] });

        if (existingUser) {
            if (existingUser.user_name === newUser.user_name) {
                return "Cet utilisateur existe déjà.";
            } else if (existingUser.email === newUser.email) {
                return "Cet email est déjà utilisé.";
            }
        } else {
            // Insérer le nouvel utilisateur dans la collection "Users"
            const insertResult = await usersCollection.insertOne(newUser);

            // Vérifier si l'insertion a réussi
            if (insertResult.insertedId) {
                return "Utilisateur créé avec succès.";
            } else {
                return "Échec de la création de l'utilisateur.";
            }
        }
    } catch (error) {
        return `Erreur lors du traitement de la requête : ${error.message}`;
    }
};
