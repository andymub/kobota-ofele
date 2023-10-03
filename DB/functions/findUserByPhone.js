exports = async function({ query }) {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

    try {
        // Extraire le numéro de téléphone de la requête (query)
        const phone = query.phone;

        // Vérifier si "phone" est défini avant de le convertir en chaîne de caractères
        if (phone !== undefined) {
            const phoneNumber = phone.toString();
            
            // Afficher le numéro de téléphone recherché
            console.log("Recherche de l'utilisateur par numéro de téléphone : " + phoneNumber);

            // Effectuer la recherche par numéro de téléphone dans la collection "Users"
            const user = await usersCollection.findOne({ phone: phoneNumber });

            if (user) {
                // Si un utilisateur correspondant est trouvé, le retourner
                return user;
            } else {
                // Si aucun utilisateur n'est trouvé, retourner un message d'erreur avec le numéro de téléphone entre astérisques
                return { message: `Utilisateur avec le numéro de téléphone *${phoneNumber}* non trouvé` };
            }
        } else {
            // Si "phone" est indéfini, retourner un message d'erreur
            return { message: "Le paramètre 'phone' est indéfini." };
        }
    } catch (error) {
        // En cas d'erreur, retourner un message d'erreur
        console.error("Erreur : " + error.message);
        return { message: error.message };
    }
};