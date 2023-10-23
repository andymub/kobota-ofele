exports = async function(email, password) {
  const jwt = require('jsonwebtoken');
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

  try {
    const user = await usersCollection.findOne({ email: email });

    if (user) {
      if (user.passe === password) {
        //const secretKey = 'votre_clé_secrète'; 
        const secretKey = '231a58b00632c9c4d8ac02b268ca4caf8dd48fd020e3dffa72666523d860988f'; 

        const token = jwt.sign(
          {
            sub: user._id.toString(),
            email: user.email,
            user_name: user.user_name,
            fonction: user.fonction,
            access: user.validation_acces
          },
          secretKey,
          { expiresIn: '30d' }
        );

        return {
          status: 'success',
          email: user.email,
          user_name: user.user_name,
          fonction: user.fonction,
          access: user.validation_acces,
          token: token
        };
      } else {
        return { status: 'fail', message: 'Mot de passe incorrect.' };
      }
    } else {
      return { status: 'fail', message: 'Utilisateur non trouvé.' };
    }
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { status: 'error', message: 'Erreur lors du traitement de la requête.'+ error.message };
  }
}
