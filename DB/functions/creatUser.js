exports = async function() {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");
    
    // Les données de l'utilisateur à insérer
    const newUser = {
        user_name: "nouvel_utilisateur",
        passe: "mot_de_passe",
        adress: {
            province: "nom_de_la_province",
            territoire: "nom_du_territoire",
            ville: "nom_de_la_ville",
            commune: "nom_de_la_commune",
            quartier: "nom_du_quartier",
            avenue_num: "numéro_de_l'avenue"
        },
        fonction: "fonction_de_l'utilisateur",
        validation_acces: true, // Converti en booléen
        work_adress: "adresse_de_travail",
        roles: "rôle_de_l'utilisateur"
    };

    // Insérer le nouvel utilisateur dans la collection "Users"
    const insertResult = await usersCollection.insertOne(newUser);

    // Vérifier si l'insertion a réussi
    if (insertResult.insertedId) {
        return "Utilisateur créé avec succès.";
    } else {
        return "Échec de la création de l'utilisateur.";
    }
};
