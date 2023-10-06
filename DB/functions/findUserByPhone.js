exports = async function({ body }) {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

    try {
        // Extraire le numéro de téléphone du corps de la requête JSON
        const requestBody = JSON.parse(body.text());
        const phone = requestBody.phone;

        // Vérifier si "phone" est défini avant de le convertir en chaîne de caractères
        if (phone !== undefined) {
            const phoneNumber = phone.toString();

            // Échapper le caractère "+" dans le numéro de téléphone
            const escapedPhoneNumber = phoneNumber.replace("+", "\\+");

            // Effectuer la recherche insensible à la casse par numéro de téléphone dans la collection "Users"
            const user = await usersCollection.findOne({ phone: { $regex: new RegExp(escapedPhoneNumber, 'i') } });

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
