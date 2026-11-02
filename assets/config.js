/* =====================================================
   RÉGLAGES DU SITE — modifie seulement ce fichier
   (utilisé par toutes les pages)
   ===================================================== */
window.CONFIG = {
  whatsapp: "212614325435",   // numéro international, sans + ni 0
  paypal: "",                 // nom PayPal.me (vide = bouton "bientôt disponible")

  // Places de projets ce mois-ci
  projetsParMois: 3,
  projetsReserves: 1,         // mets à jour quand tu acceptes un projet

  // Heures où tu réponds aux messages (affichées sur le site, en direct)
  // 0 = dimanche, 1 = lundi ... 6 = samedi. null = pas de réponse ce jour-là
  reponses: {
    0: null,
    1: ["17:00", "22:00"],
    2: ["17:00", "22:00"],
    3: ["14:00", "22:00"],
    4: ["17:00", "22:00"],
    5: ["15:00", "22:00"],
    6: ["10:00", "20:00"]
  },
  email: "",                  // adresse email du studio (vide = bouton email caché)

  // Estimateur de prix (page d'accueil) — prix en DH, modifiables
  estimateur: {
    formules: { essentiel: 600, vitrine: 1200, plateforme: 3500 },
    pagesIncluses: { essentiel: 1, vitrine: 4, plateforme: 6 },
    pageEnPlus: 150,
    options: {
      multilingue: 300,   // site en 2 ou 3 langues
      reservation: 400,   // prise de rendez-vous / réservation
      catalogue: 300,     // catalogue produits ou menu détaillé
      animations: 250,    // animations premium (voir le Labo)
      logo: 200,          // logo simple
      express: 300        // livraison accélérée
    },
    entretienMois: 150
  }
};
