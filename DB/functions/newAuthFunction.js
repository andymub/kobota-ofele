exports = async function({ query, headers, body }) {
  const jwt = require('jsonwebtoken');
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

  try {
    // Convertir le corps de la requête JSON en objet JavaScript
    const authUser = JSON.parse(body.text());

    if (!authUser.email || !authUser.password) {
      response.setStatusCode(400); // Code de réponse HTTP 400 pour une requête incorrecte
      return { status: 'fail', message: 'Veuillez fournir une adresse e-mail, un mot de passe et un rôle.' };
    }

    const user = await usersCollection.findOne({ email: authUser.email });

    if (user) {
      if (user.passe === authUser.password) {
        const secretKey = '231a58b00632c9c4d8ac02b268ca4caf8dd48fd020e3dffa72666523d860988f';

       /* const token = jwt.sign(
          {
            sub: user._id.toString(),
            email: user.email,
            user_name: user.user_name,
            role: user.role,
            access: user.validation_acces
          },
          secretKey,
          { expiresIn: '30d' }
        );*/

        return {
          status: 'success',
          email: user.email,
          user_name: user.user_name,
          role: user.role,
          access: user.validation_acces,
         // token: token
        };
      } else {
         response.setStatusCode(401); // Code de réponse HTTP 401 pour une authentification incorrecte
        return { status: 'fail', message: 'Mot de passe incorrect.' };
      }
    } else {
      response.setStatusCode(404); // Code de réponse HTTP 404 pour utilisateur non trouvé
      return { status: 'fail', message: 'Utilisateur non trouvé.' };
    }
  } catch (error) {
    console.error("Erreur : " + (error ? error.message : 'error is undefined'));
    return { status: 'error', message: 'Erreur lors du traitement de la requête.' + (error ? error.message : '') };
  }
}
