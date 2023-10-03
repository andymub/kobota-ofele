exports = async function() {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

    try {
        // Utiliser la méthode find pour obtenir les documents avec le champ "work_adress" vide ou inexistant
        const usersWithEmptyWorkAdress = await usersCollection.find({ $or: [{ work_adress: "" }, { work_adress: { $exists: false } }] }).toArray();

        return usersWithEmptyWorkAdress;
    } catch (error) {
        // En cas d'erreur, retourner un message d'erreur
        console.error("Erreur : " + error.message);
        return { message: error.message };
    }
};