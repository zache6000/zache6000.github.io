(function () {
  var s = document.getElementById("cstate");
  function upd() { if (!s) return; var c = window.BBConsent && BBConsent.get(); s.textContent = c === "yes" ? "Vous avez accepté : vos préférences sont gardées sur cet appareil." : c === "no" ? "Vous avez refusé : aucune préférence n'est gardée." : "Vous n'avez pas encore fait de choix : rien n'est gardé pour l'instant."; }
  upd(); document.addEventListener("bb:consent", upd);
  var w = document.getElementById("wipe"), n = document.getElementById("wipen");
  if (w) w.addEventListener("click", function () { BBConsent.clearDevice().then(function () { n.textContent = "C'est fait : plus aucune donnée de Babora sur cet appareil."; }); });
})();
