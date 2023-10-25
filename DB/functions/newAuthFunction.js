exports = async function({ query, headers, body }) {
  const jwt = require('jsonwebtoken');
  const usersCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Users");

  // Assurez-vous que le corps de la requête contient les champs email, password et role
  if (!body.email || !body.password || !body.role) {
    return { status: 'fail', message: 'Veuillez fournir une adresse e-mail, un mot de passe et un rôle.' };
  }

  try {
    const user = await usersCollection.findOne({ email: body.email });

    if (user) {
      if (user.passe === body.password) {
        const secretKey = '231a58b00632c9c4d8ac02b268ca4caf8dd48fd020e3dffa72666523d860988f';

        const token = jwt.sign(
          {
            sub: user._id.toString(),
            email: user.email,
            user_name: user.user_name,
            role: user.role, // Modifiez "role" au lieu de "fonction" si c'est le champ correct
            access: user.validation_acces
          },
          secretKey,
          { expiresIn: '30d' }
        );

        return {
          status: 'success',
          email: user.email,
          user_name: user.user_name,
          role: user.role, // Modifiez "role" au lieu de "fonction" ici aussi
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
    console.error("Erreur : " + (error ? error.message : 'error is undefined'));
    return { status: 'error', message: 'Erreur lors du traitement de la requête.' + (error ? error.message : '') };
  }
}
