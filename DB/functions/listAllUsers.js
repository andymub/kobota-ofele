exports = async function() {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

    // Obtenir le nombre total de documents dans la collection
    const totalDocuments = await usersCollection.count();

    // Obtenir les noms, e-mails, rôles et validations d'accès de tous les utilisateurs
    const users = await usersCollection.find({}, { user_name: 1, email: 1, roles: 1, validation_acces: 1 }).toArray();

    return {
        totalDocuments: totalDocuments,
        users: users
    };
};
