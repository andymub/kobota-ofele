exports = async function(name) {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

    try {
        // Vérifier si le paramètre "name" est une chaîne de caractères
          // Convertir "name" en une chaîne de caractères si ce n'est pas déjà le cas
        name = name.toString();

        if (typeof name !== 'string') {
            throw new Error("Le paramètre 'name' doit être une chaîne de caractères.");
        }

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
