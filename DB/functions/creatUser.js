exports = async function() {
    const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

    // The username you want to check
    const usernameToCheck = "Alice"; // Replace with the username you want to check

    // Check if the username already exists in the database
    const existingUser = await usersCollection.findOne({ user_name: usernameToCheck });

    if (existingUser) {
        return "Cet utilisateur existe déjà.";
    } else {    
        // Les données de l'utilisateur à insérer
        const newUser = {
            user_name: "Alice",
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
    }
};
