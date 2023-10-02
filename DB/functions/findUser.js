exports = async function({ query }) {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

    try {
        // Extraire le nom de l'utilisateur à partir des paramètres de requête (query)
        const name = query.name;

        // Convertir "name" en une chaîne de caractères si ce n'est pas déjà le cas
        const userName = name.toString();

        // Afficher le nom recherché
        console.log("Recherche de l'utilisateur : " + userName);

        // Effectuer la recherche par nom dans la collection "Users"
        const user = await usersCollection.findOne({ user_name: userName });

        if (user) {
            // Si un utilisateur correspondant est trouvé, le retourner
            return user;
        } else {
            // Si aucun utilisateur n'est trouvé, retourner un message d'erreur avec le nom entre astérisques
            return { message: `Utilisateur *${userName}* non trouvé` };
        }
    } catch (error) {
        // En cas d'erreur, retourner un message d'erreur
        console.error("Erreur : " + error.message);
        return { message: error.message };
    }
};
