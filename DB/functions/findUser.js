exports = async function(name) {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

    try {
        // Assurer que le paramètre "name" est une chaîne de caractères
        name = name.toString();

        // Afficher le nom recherché
        console.log("Recherche de l'utilisateur : " + name);

        // Effectuer la recherche par nom dans la collection "Users"
        const user = await usersCollection.findOne({ user_name: name });

        if (user) {
            // Si un utilisateur correspondant est trouvé, le retourner
            return user;
        } else {
            // Si aucun utilisateur n'est trouvé, retourner un message d'erreur avec le nom entre astérisques
            return { message: `Utilisateur *${name}* non trouvé` };
        }
    } catch (error) {
        // En cas d'erreur, retourner un message d'erreur
        console.error("Erreur : " + error.message);
        return { message: error.message };
    }
};
