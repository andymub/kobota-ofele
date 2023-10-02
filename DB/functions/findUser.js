exports = async function(name) {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

    try {
        // Afficher le nom recherché
        console.log("Recherche de l'utilisateur : " + name);

        // Effectuer la recherche par nom dans la collection "Users"
        const user = await usersCollection.findOne({ user_name: name });

        if (user) {
            // Si un utilisateur correspondant est trouvé, le retourner
            return user;
        } else {
            // Si aucun utilisateur n'est trouvé, retourner un message d'erreur
            return { message: "Utilisateur non trouvé" };
        }
    } catch (error) {
        // En cas d'erreur, retourner un message d'erreur
        console.error("Erreur : " + error.message);
        return { message: error.message };
    }
};
