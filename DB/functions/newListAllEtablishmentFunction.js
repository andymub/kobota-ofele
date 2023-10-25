exports = async function({ query, headers, body }) {
  const establishmentCollection = context.services.get("mongodb-atlas").db("kobotaDB").collection("Establishment");

  try {
    const establishments = await establishmentCollection.find({}).toArray();

    return establishments;
  } catch (error) {
    console.error("Erreur : " + error.message);
    return { status: 'error', message: 'Erreur lors de la récupération des établissements.' };
  }
};