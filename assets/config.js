/* =====================================================
   RÉGLAGES DU SITE — modifie seulement ce fichier
   (utilisé par toutes les pages)
   ===================================================== */
window.CONFIG = {
  whatsapp: "212614325435",   // numéro international, sans + ni 0
  paypal: "",                 // (ancien) nom PayPal.me, plus utilisé

  // Liens de paiement PayPal (créés dans PayPal > Liens de paiement), en euros
  paiement: {
    essentiel: "https://www.paypal.com/ncp/payment/ZUNFLACXXH466",   // 19,50 € (50% de 39 €)
    vitrine:   "https://www.paypal.com/ncp/payment/9MXHFU36FJUPU",   // 39,50 € (50% de 79 €)
    entretien: "https://www.paypal.com/ncp/payment/2JD7M23GEVF8Y",   // 9 € / mois
    libre:     "https://www.paypal.com/ncp/payment/WL5KWKHW6LW3Q"    // montant libre (devis, options, solde)
  },

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

  // Estimateur de prix (page d'accueil) — prix en euros (€), modifiables
  estimateur: {
    formules: { essentiel: 39, vitrine: 79, plateforme: 249 },
    pagesIncluses: { essentiel: 1, vitrine: 4, plateforme: 6 },
    pageEnPlus: 10,
    options: {
      multilingue: 20,   // site en 2 ou 3 langues
      reservation: 30,   // prise de rendez-vous / réservation
      catalogue: 20,     // catalogue produits ou menu détaillé
      animations: 15,    // animations premium (voir le Labo)
      logo: 15,          // logo simple
      express: 20        // livraison accélérée
    },
    entretienMois: 9
  }
};
