Projet podcast-builder

un input pour le theme choisi

un bouton 
afficher 7 questions de podcast

un bouton 
afficher deux prenoms d'intervenants
un bouton 

afficher 
les personnalités de chaque intervenant un pour et l'autre contre




donne une premiere page
en pur HTML CSS avec bootstrap

je veux une interface simple


inspire toi du desing du projet llm-connector

# prompt
je veux un seul tableau avec les prenoms et personnalités
et un seul bouton prenom personnalité

# prompt
tres bien par contre je veux que les resultats soient afficher sous forme de tableau

# prompt
rajoute trois boutons 
generer les dialogues
generer les voix
generer les video

# Prompt
je veux le input et les 5 boutons en haut dans un seul card

# Prompt
je veux 

sur une ligne
input 
generer questions
generer intervenants et personnalites

sur une ligne
generer dialogues
generer voix
generer videos

# Prompt
je veux par contre 4 questions au lieu de 7
a gauche je veux dans une colonne
les intervenants et dessous les questions

et a droite je veux une collone avec les dialogues generes

# Prompt
je veux que 
les 3 buttons

generer dailogues voix videos

soient au dessus de la colonne de droite des dialogues generes

# Prompt
Je veux que Afficher 4 questions
soient remplaces par un button et une zone de saisie du nombre de questions


<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <title>llm-connector</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #f9f9f9;
      --text: #212529;
      --card-bg: #ffffff;
      --input-bg: #e9ecef;
      --accent: #0d6efd;
    }

    .dark-mode {
      --bg: #121212;
      --text: #f1f1f1;
      --card-bg: #1e2a38;
      --input-bg: #2a3b4d;
      --accent: #00c9a7;
    }

    html,
    body {
      min-height: 100%;
      background-color: var(--bg);
      color: var(--text);
      font-family: "Roboto", sans-serif;
    }

    body {
      display: flex;
      flex-direction: column;
    }

    .container {
      flex: 1;
      background-color: var(--bg);
    }

    h1 {
      font-weight: 800;
      font-size: 2.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }

    .card {
      background-color: var(--card-bg);
      border: none;
      border-radius: 1rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .form-control,
    .form-select,
    textarea {
      background-color: var(--input-bg);
      color: var(--text);
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 0.5rem;
    }

    .form-control:focus,
    .form-select:focus,
    textarea:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
    }

    label {
      font-weight: 600;
    }

    textarea {
      resize: vertical;
      min-height: 160px;
    }

    .loading {
      position: absolute;
      top: 50%;
      right: 1rem;
      transform: translateY(-50%);
    }

    .small-text {
      font-size: 0.75rem;
      opacity: 0.8;
    }

    .btn-group-responsive {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .progress-bar {
      background-color: var(--accent);
    }

    .toggle-mode {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 999;
    }

    @media (max-width: 576px) {
      .toggle-mode {
        top: auto;
        bottom: 1rem;
        right: 1rem;
      }

      .container {
        padding-top: 3rem;
      }

      h1 {
        font-size: 1.75rem;
      }

      .btn-group-responsive {
        flex-direction: column;
        align-items: stretch;
      }
    }

    html.dark-mode,
    body.dark-mode {
      background-color: var(--bg) !important;
    }

    .audio-disabled {
      pointer-events: none;
      opacity: 0.6;
    }
  </style>
</head>

<body>

  <button class="btn btn-sm btn-outline-secondary toggle-mode" onclick="toggleTheme()">Toggle thème</button>

  <div class="container p-2">
    <h1 class="text-center text-primary">llm-connector</h1>

    <div class="row g-3 mb-4">
      <div class="col-12 col-lg-3">
        <label class="form-label">Nom / Titre</label>
        <input type="text" class="form-control text-start">
      </div>
      <div class="col-12 col-lg-3">
        <label class="form-label">Type</label>
        <select class="form-select">
          <option selected value="biography">Biographie de réalisateur</option>
          <option value="summary">Résumé de film</option>
        </select>
      </div>
      <div class="col-12 col-lg-3">
        <label class="form-label">Style</label>
        <select class="form-select">
          <option value="casual">Décontracté</option>
          <option value="cinematic">Cinématographique</option>
          <option value="dialog">Dialogué</option>
          <option value="dramatic">Dramatique</option>
          <option value="emotional">Émotionnel</option>
          <option value="historical">Historique</option>
          <option value="humorous">Humoristique</option>
          <option value="inspirational">Inspirant</option>
          <option value="interview">Interview fictive</option>
          <option value="marketing">Marketing</option>
          <option value="minimal">Minimaliste</option>
          <option value="narrative">Narratif</option>
          <option value="neutral" selected>Neutre</option>
          <option value="poetic">Poétique</option>
          <option value="press">Journalistique</option>
          <option value="satirical">Satirique</option>
          <option value="scientific">Scientifique</option>
          <option value="technical">Technique</option>
        </select>
      </div>
      <div class="col-12 col-lg-3">
        <label class="form-label">Longueur</label>
        <select class="form-select">
          <option value="short">Courte</option>
          <option value="medium" selected>Moyenne</option>
          <option value="long">Longue</option>
        </select>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-md-6">
        <div class="card p-4">
          <div class="d-flex justify-content-between align-items-center mb-3 btn-group-responsive">
            <button class="btn btn-primary">Générer avec ChatGPT</button>
            <button class="btn btn-outline-primary">Réinitialiser</button>
            <span class="badge bg-primary">Texte Ok ✓</span>
            <span class="text-primary small-text ms-auto">Réponse en 1.2s</span>
          </div>
          <div class="position-relative">
            <textarea class="form-control">Résultat généré ici...</textarea>
            <div class="loading">
              <div class="spinner-border text-primary" role="status" style="width: 1.5rem; height: 1.5rem;">
                <span class="visually-hidden">Chargement...</span>
              </div>
            </div>
            <div class="mt-3">
              <div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 75%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card p-4 m-1">
          <div class="d-flex justify-content-between align-items-center mb-3 btn-group-responsive">
            <button class="btn btn-success">Générer avec Claude</button>
            <button class="btn btn-outline-success">Réinitialiser</button>
            <span class="badge bg-success">Texte Ok ✓</span>
            <span class="text-success small-text ms-auto">Réponse en 1.5s</span>
          </div>
          <div class="position-relative">
            <textarea class="form-control">Résultat généré ici...</textarea>
            <div class="loading">
              <div class="spinner-border text-success" role="status" style="width: 1.5rem; height: 1.5rem;">
                <span class="visually-hidden">Chargement...</span>
              </div>
            </div>
            <div class="mt-3">
              <div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" style="width: 75%">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    function toggleTheme() {
      document.body.classList.toggle('dark-mode');
      document.documentElement.classList.toggle('dark-mode');
    }
  </script>

</body>

</html>
