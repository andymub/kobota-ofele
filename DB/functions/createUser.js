exports = async function() {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

    // Les données du nouvel utilisateur à insérer
    const newUser = {
        user_name: "Alice77", // Remplacez par le nom d'utilisateur que vous souhaitez insérer
        passe: "mot_de_passe",
        email: "aliceTest@gmail.com", // Remplacez par l'email que vous souhaitez insérer
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
};
