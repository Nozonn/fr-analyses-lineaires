// This file contains the JavaScript code that handles the interactive features of the website.

function createExcerptList() {
    const list = document.getElementById('excerpt-list');
    list.innerHTML = '';
    excerpts.forEach((ex, idx) => {
        const li = document.createElement('li');
        li.id = `excerpt-${idx}`;
        li.className = 'excerpts';

        let plan = [...ex.plan];
        plan.forEach((mv, i) => plan[i] = `Mouvement ${i + 1} : ${mv}`);

        li.innerHTML = `
            <span class="arrow" style="cursor:pointer;">&#9654;</span>
            <span class="excerpt-label">${ex.loc} - ${ex.title} - ${ex.author}</span>
            <div class="excerpt-details">
                <span style="color:green;"><strong>Problématique :</strong> <div>${ex.pbm + " ?"}</div></span><br>
                <span><strong>Plan :</strong> <div><span>${plan.join("</span><br><span style='margin-top:2px'>")}</span></div></span>
            </div>
        `;
        // Flèche pour déplier/replier
        const funcArrow = () => {
            const details = li.querySelector('.excerpt-details');
            const isOpen = details.style.display === 'block';
            details.style.display = isOpen ? 'none' : 'block';
            li.querySelector('.arrow').innerHTML = isOpen ? '&#9654;' : '&#9660;';
        }

        li.querySelector('.arrow').addEventListener('click', function () {
            const details = li.querySelector('.excerpt-details');
            const isOpen = details.style.display === 'block';
            details.style.display = isOpen ? 'none' : 'block';
            this.innerHTML = isOpen ? '&#9654;' : '&#9660;';
        });

        //li.querySelector('.arrow').addEventListener('click', funcArrow);
        li.addEventListener('click', funcArrow);

        // Clique sur le titre pour démarrer le jeu
        li.querySelector('.excerpt-label').addEventListener('click', function () {
            document.getElementById("excerpt-list-section").style.display = 'none'; // Cache la liste des extraits
            game(ex, idx); // Démarre le jeu avec l'extrait sélectionné

        });

        list.appendChild(li);
    });
}





function maskPhrase(text, idx) {
    idx.forEach((i) => {
        text[i] = "_____";
    });

    return text.join(" ")
}

function resetGame(ex) {
    phrases.length = 0; // Réinitialise le tableau des phrases
    idxMissing.length = 0; // Réinitialise le tableau des mots manquants
    inputsContainer.innerHTML = "";
    excerpt = ex;
}

function showElements(ex) {
    // Affiche la section jeu, cache la liste
    document.getElementById("game-section").style.display = "block";
    // Affiche le titre (loc, title, author)
    const gameTitle = document.getElementById("game-title");
    gameTitle.textContent = `${ex.loc} - ${ex.title} - ${ex.author}`;

    // Ajoute un seul event listener proprement (évite les bugs de multiples callbacks)
    const newGameTitle = gameTitle.cloneNode(true);
    gameTitle.parentNode.replaceChild(newGameTitle, gameTitle);

    // Effet stylisé au survol et au clic
    newGameTitle.style.transition = "color 0.2s, text-shadow 0.2s";
    newGameTitle.style.cursor = "pointer";

    newGameTitle.addEventListener("mouseenter", () => {
        newGameTitle.style.color = "#4f8cff";
        newGameTitle.style.textShadow = "0 2px 8px #b3d1ff";
    });
    newGameTitle.addEventListener("mouseleave", () => {
        newGameTitle.style.color = "#1e3c72";
        newGameTitle.style.textShadow = "none";
    });
    newGameTitle.addEventListener("mousedown", () => {
        newGameTitle.style.color = "#e74c3c";
        newGameTitle.style.textShadow = "0 2px 12px #ffd6d6";
    });
    newGameTitle.addEventListener("mouseup", () => {
        newGameTitle.style.color = "#4f8cff";
        newGameTitle.style.textShadow = "0 2px 8px #b3d1ff";
    });

    newGameTitle.addEventListener("click", () => {
        // Réinitialise tout proprement
        totalQuestions = 0;
        totalCorrect = 0;
        recapErrors = [];
        idxPhrases = 0;
        attempts = 0;
        document.getElementById("game-section").style.display = "none";
        document.getElementById("excerpt-list-section").style.display = "block";
        document.getElementById("btn-container").style.display = "block";
        document.getElementById("game-infos").innerHTML = "";
        document.getElementById("inputs-container").innerHTML = "";
        createExcerptList();
    });
}


function game(ex) {
    resetGame(ex); // Réinitialise le jeu
    showElements(ex); // Affiche les éléments du jeu

    // Réinitialise le bouton Valider à chaque nouvelle question
    const btnValidate = document.getElementById("btnValidate");
    btnValidate.textContent = "Valider";
    btnValidate.onclick = validate;

    phrases.push(ex.pbm, ...ex.plan); // Ajoute la problématique et le plan dans le tableau des phrases 

    // On masque des mots aléatoires dans la première phrase (problématique)
    let words = phrases[idxPhrases].split(" ");
    let max = Math.max(2, words.length - 1);
    let nbToMask = Math.floor(Math.random() * (max - 1 + 1)) + 2; // entre 2 et max inclus
    if (nbToMask > words.length - 1) nbToMask = words.length - 1;

    // Génère des indices uniques aléatoires

    while (idxMissing.length < nbToMask) {
        let r = Math.floor(Math.random() * words.length);
        if (!idxMissing.includes(r)) idxMissing.push(r);
    }

    idxMissing.sort((a, b) => a - b); // Tri des indices pour l'affichage

    let ph = maskPhrase(words, idxMissing);

    if (idxPhrases > 0) ph = "Mouvement " + idxPhrases + " : " + ph;
    if (idxPhrases === 0) ph += " ?";

    document.getElementById("game-infos").innerHTML = ph;


    idxMissing.forEach((_, index) => {
        const wrapper = document.createElement("div");
        wrapper.style.width = "100%";
        wrapper.style.display = "flex";
        wrapper.style.justifyContent = "center";
        wrapper.style.marginBottom = "8px";
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = `Mot manquant ${index + 1}`;
        wrapper.appendChild(input);
        inputsContainer.appendChild(wrapper);
    });
}



function showCorrection(words) {
    // Affiche la correction dans les mauvais inputs
    const inputDivs = Array.from(inputsContainer.querySelectorAll('input'));
    inputDivs.forEach((input, i) => {
        const parent = input.parentElement;
        const expected = words[idxMissing[i]];

        if (parent.classList.contains('input-wrong')) {
            // Affiche la correction dans l'input en rouge
            input.value = expected;
            input.style.color = "#e74c3c";
            input.style.fontWeight = "bold";
        }
        input.disabled = true; // Empêche de modifier après correction
    });

    // Affiche la correction sous les inputs

    let phrase = [...words];
    let correction = '<div id="correction" style="margin-top:18px; font-weight:bold;">Correction :<br><span style="font-size:1.1em;">';

    if (idxPhrases > 0) correction += "Mouvement " + idxPhrases + " : ";

    inputDivs.forEach((input, i) => {
        const idx = idxMissing[i];
        const expected = words[idx];
        if (input.parentElement.classList.contains('input-correct')) {
            phrase[idx] = `<span style="color:#27ae60; font-weight:bold;">${expected}</span>`;
        } else {
            phrase[idx] = `<span style="color:#e74c3c; font-weight:bold;">${expected}</span>`;
        }
    });

    correction += phrase.join(" ");

    if (idxPhrases === 0) correction += " ?";


    correction += '</span></div>';

    if (!document.getElementById("correction")) {
        inputsContainer.insertAdjacentHTML('afterend', correction);
    }
}




// Modifie validate pour compter les bonnes réponses et stocker les erreurs
function validate() {
    const inputDivs = Array.from(inputsContainer.querySelectorAll('input'));
    const words = phrases[idxPhrases].split(" ");
    let allCorrect = true;
    let currentErrors = [];

    inputDivs.forEach((input, i) => {
        const parent = input.parentElement;
        parent.classList.remove('input-correct', 'input-wrong');
        const expected = words[idxMissing[i]].toLowerCase();
        const user = input.value.trim().toLowerCase();
        if (user === expected) {
            parent.classList.add('input-correct');
        } else {
            parent.classList.add('input-wrong');
            input.value = "";
            allCorrect = false;
            currentErrors.push({ mot: expected, reponse: user });
        }
    });

    attempts++;
    totalQuestions += inputDivs.length;



    if (allCorrect) {
        totalCorrect += inputDivs.length;
        document.getElementById("btnValidate").textContent = "Suivant";
        document.getElementById("btnValidate").onclick = nextStep;
        return;
    }

    // Stocke les erreurs pour le récap
    currentErrors.forEach(err => recapErrors.push({
        phrase: phrases[idxPhrases],
        attendu: err.mot,
        donne: err.reponse
    }));


    if (attempts >= 3) {

        showCorrection(words);
        document.getElementById("btnValidate").textContent = "Suivant";
        document.getElementById("btnValidate").onclick = nextStep;
    }
}


// Ajoute ce bloc à la fin de ton fichier ou après la déclaration de validate()
document.addEventListener('keydown', function (e) {
    // Si la section jeu est visible et qu'un input est focus
    if (
        document.getElementById("game-section").style.display === "block" &&
        e.key === "Enter"
    ) {
        e.preventDefault();
        document.getElementById("btnValidate").click();
    }
});

// Modifie nextStep pour afficher le score final si tout est fini
function nextStep() {
    document.getElementById("btnValidate").textContent = "Valider";
    document.getElementById("btnValidate").onclick = validate;
    attempts = 0;
    if (document.getElementById("correction")) {
        document.getElementById("correction").remove();
    }
    idxPhrases++;
    if (idxPhrases > phrases.length - 1) {
        showFinalScore();
        return;
    }
    game(excerpt);
}

// Nouvelle fonction pour afficher le score final et le récapitulatif
function showFinalScore() {
    document.getElementById("game-title").textContent = "Score final";
    let html = `<div style="font-size:1.2em; margin-bottom:18px;">
        Bravo ! Tu as trouvé <span style="color:#27ae60;font-weight:bold;">${totalQuestions - recapErrors.length}</span> mot(s) sur <span style="color:#1e3c72;font-weight:bold;">${totalQuestions}</span>.
    </div>`;

    // Retire les doublons de recapErrors (même phrase + attendu)
    const uniqueErrors = [];
    const seen = new Set();
    recapErrors.forEach(err => {
        const key = err.phrase + '|' + err.attendu;
        if (!seen.has(key)) {
            uniqueErrors.push(err);
            seen.add(key);
        }
    });

    if (uniqueErrors.length > 0) {
        // Regroupe les erreurs par phrase
        const groupedErrors = {};
        uniqueErrors.forEach(err => {
            if (!groupedErrors[err.phrase]) groupedErrors[err.phrase] = [];
            groupedErrors[err.phrase].push(err);
        });

        html += `
    <div style="margin-bottom:18px;">
        <strong style="font-size:1.1em; color:#e74c3c;">Erreurs :</strong>
        <ul style="list-style:none; padding:0; margin:12px 0 0 0;">
    `;

        Object.entries(groupedErrors).forEach(([phrase, errors]) => {
            html += `
        <li style="background:#fff3f3; border:1px solid #ffd6d6; border-radius:8px; margin-bottom:14px; padding:12px 16px;">
            <div style="font-size:1em; color:#1e3c72; margin-bottom:7px;">
                <em>${phrase}</em>
            </div>
            <ul style="list-style:none; padding:0; margin:0;">
        `;
            errors.forEach(err => {
                html += `
                <li style="margin-bottom:4px;">
                    <span style="color:#888;">Attendu :</span> <b style="color:#27ae60;">${err.attendu}</b>
                    <span style="color:#888; margin-left:10px;">| Ta réponse :</span> <b style="color:#e74c3c;">${err.donne || "(vide)"}</b>
                </li>
            `;
            });
            html += `</ul></li>`;
        });

        html += `</ul></div>`;
    } else {
        html += `<div style="color:#27ae60; font-weight:bold;">Aucune erreur, félicitations !</div>`;
    }

    html += `
        <div style="display:flex; gap:18px; justify-content:center; margin-top:24px;">
            <button id="btnRestart" style="padding:12px 28px; border-radius:8px; background:#4f8cff; color:#fff; border:none; font-size:1em; cursor:pointer;">Recommencer</button>
            <button id="btnMenu" style="padding:12px 28px; border-radius:8px; background:#1e3c72; color:#fff; border:none; font-size:1em; cursor:pointer;">Retour au menu</button>
        </div>
    `;

    document.getElementById("game-infos").innerHTML = html;
    document.getElementById("inputs-container").innerHTML = "";
    document.getElementById("btn-container").style.display = "none";

    // Gestion des boutons
    document.getElementById("btnRestart").onclick = () => {
        // Reset score et erreurs
        totalQuestions = 0;
        totalCorrect = 0;
        recapErrors = [];
        idxPhrases = 0;
        document.getElementById("btn-container").style.display = "block";
        game(excerpt);
    };
    document.getElementById("btnMenu").onclick = () => {
        totalQuestions = 0;
        totalCorrect = 0;
        recapErrors = [];
        idxPhrases = 0;
        document.getElementById("game-section").style.display = "none";
        document.getElementById("excerpt-list-section").style.display = "block";
        document.getElementById("btn-container").style.display = "block";
        createExcerptList();
    };
}







// Ajoute ce CSS pour la coloration des inputs
const style = document.createElement('style');
style.innerHTML = `
.input-correct input { border: 2px solid #27ae60 !important; background: #eafaf1; }
.input-wrong input { border: 2px solid #e74c3c !important; background: #faeaea; }
`;
document.head.appendChild(style);





const inputsContainer = document.getElementById("inputs-container");


const phrases = [];
const idxMissing = [];

let excerpt = {};
let idxPhrases = 0;
let attempts = 0;

// Ajoute ces variables globales pour le score et les erreurs
let totalQuestions = 0;
let totalCorrect = 0;
let recapErrors = [];


document.addEventListener('DOMContentLoaded', createExcerptList);




// ====================

// --- Lecteur de musique ---
const tracks = [
    { src: "obseques.mp3", title: "Les Obsèques de la Lionne" },
    { src: "arrias.mp3", title: "Arias" },
    { src: "gnathon.mp3", title: "Gnathon" },
    { src: "pamphile.mp3", title: "Pamphile" },
    { src: "cleves.mp3", title: "Excipit La Princesse de Clèves" },
    { src: "lpdcExtrait1.mp3", title: "Extrait 1 La Peau de chagrin" },
    { src: "lpdcExtrait2.mp3", title: "Extrait 2 La Peau de chagrin" },
    { src: "charogne.mp3", title: "Une charogne" },
    { src: "jetaime.mp3", title: "Je t'aime" },
    { src: "longuesTrainees.mp3", title: "Mes forêts sont de longues traînées de temps" },
    { src: "silhouetteMysterieuse.mp3", title: "On dirait une silhouette mystérieuse" },
    { src: "tartuffe.mp3", title: "Tartuffe ou l'Imposteur" },
    { src: "maladeImaginaire.mp3", title: "Le Malade imaginaire" },
    { src: "obpa.mp3", title: "Dénouement On ne badine pas avec l'amour" },
    // Ajoute d'autres fichiers mp3 ici
];
let currentTrack = 0;

function populateTrackSelect() {
    const select = document.getElementById('track-select');
    select.innerHTML = '';
    tracks.forEach((track, idx) => {
        const option = document.createElement('option');
        option.value = idx;
        option.textContent = track.title;
        select.appendChild(option);
    });
    select.value = currentTrack;
}





function loadTrack(idx) {
    const audio = document.getElementById('audio');
    audio.src = tracks[idx].src;
    document.getElementById('track-title').textContent = tracks[idx].title;
    document.getElementById('track-select').value = idx;
    audio.load();
}

function nextTrack() {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    document.getElementById('audio').play();
}

function prevTrack() {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrack);
    document.getElementById('audio').play();
}





document.addEventListener('DOMContentLoaded', function () {
    const player = document.getElementById('music-player');

    if (tracks.length > 0) {
        populateTrackSelect();
        loadTrack(currentTrack);
    }

    // Sélection via menu déroulant
    document.getElementById('track-select').addEventListener('change', function () {
        currentTrack = parseInt(this.value, 10);
        loadTrack(currentTrack);
        document.getElementById('audio').play();
    });
    // Gestion de la boucle
    document.getElementById('loop-audio').addEventListener('change', function () {
        document.getElementById('audio').loop = this.checked;
    });
    // ...existing code...
    // Ajout du bouton toggle (bulle)

    const toggleBtn = document.createElement('button');
    toggleBtn.id = "music-toggle-btn";
    toggleBtn.textContent = "−";
    toggleBtn.title = "Réduire/Agrandir le lecteur";
    toggleBtn.style.position = "absolute";
    toggleBtn.style.top = "6px";
    toggleBtn.style.right = "6px";
    toggleBtn.style.background = "#e3eaff";
    toggleBtn.style.border = "none";
    toggleBtn.style.borderRadius = "50%";
    toggleBtn.style.width = "26px";
    toggleBtn.style.height = "26px";
    toggleBtn.style.cursor = "pointer";
    toggleBtn.style.fontSize = "1.1em";
    toggleBtn.style.fontWeight = "bold";
    toggleBtn.style.color = "#1e3c72";
    toggleBtn.style.boxShadow = "0 2px 8px rgba(30,60,114,0.12)";
    toggleBtn.style.zIndex = "101";
    player.style.position = "fixed";
    player.appendChild(toggleBtn);

    // Ajout du resize (coin en bas à droite)
    const resizeHandle = document.createElement('div');
    resizeHandle.style.position = "absolute";
    resizeHandle.style.right = "2px";
    resizeHandle.style.bottom = "2px";
    resizeHandle.style.width = "14px";
    resizeHandle.style.height = "14px";
    resizeHandle.style.cursor = "nwse-resize";
    resizeHandle.style.background = "rgba(79,140,255,0.13)";
    resizeHandle.style.borderRadius = "4px";
    resizeHandle.title = "Redimensionner";
    player.appendChild(resizeHandle);

    player.style.minWidth = "180px"; // Largeur minimale
    player.style.minHeight = "60px"; // Hauteur minimale
    player.style.width = "300px"; // Largeur initiale
    player.style.height = "250px"; // Hauteur initiale

    let reduced = false;
    let prevWidth = player.offsetWidth;
    let prevHeight = player.offsetHeight;

    toggleBtn.addEventListener('click', function () {
        reduced = !reduced;
        if (reduced) {
            prevWidth = player.offsetWidth;
            prevHeight = player.offsetHeight;
            player.style.width = "44px";
            player.style.height = "44px";
            player.style.minWidth = "44px";
            player.style.minHeight = "44px";
            player.style.overflow = "hidden";
            // Cache tout sauf le bouton et le resize
            Array.from(player.children).forEach((el) => {
                if (el !== toggleBtn && el !== resizeHandle) el.style.display = "none";
            });
            toggleBtn.textContent = "+";
            toggleBtn.title = "Agrandir le lecteur";
            toggleBtn.style.zIndex = "102";
        } else {
            player.style.width = prevWidth + "px";
            player.style.height = prevHeight + "px";
            player.style.minWidth = "";
            player.style.minHeight = "";
            player.style.overflow = "";
            Array.from(player.children).forEach((el) => {
                if (el !== toggleBtn && el !== resizeHandle) el.style.display = "";
            });
            toggleBtn.textContent = "−";
            toggleBtn.title = "Réduire le lecteur";
        }
    });

    // Resize logic
    let isResizing = false, startX, startY, startWidth, startHeight;
    resizeHandle.addEventListener('mousedown', function (e) {
        if (reduced) return; // Pas de resize en mode réduit
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = player.offsetWidth;
        startHeight = player.offsetHeight;
        document.body.style.userSelect = "none";
    });
    document.addEventListener('mousemove', function (e) {
        if (!isResizing) return;
        let newWidth = Math.max(180, startWidth + (e.clientX - startX));
        let newHeight = Math.max(60, startHeight + (e.clientY - startY));
        player.style.width = newWidth + "px";
        player.style.height = newHeight + "px";
        // Ajuste la largeur des éléments internes si besoin
        const audio = player.querySelector('audio');
        const select = player.querySelector('select');
        if (audio) audio.style.width = Math.max(120, newWidth - 20) + "px";
        if (select) select.style.width = Math.max(120, newWidth - 20) + "px";
    });
    document.addEventListener('mouseup', function () {
        if (isResizing) {
            isResizing = false;
            document.body.style.userSelect = "";
        }
    });

    // --- Drag & Drop pour déplacer le lecteur ---
    let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
    const dragZone = player; // On utilise le bouton toggle comme poignée

    //dragZone.style.cursor = "grab";

    dragZone.addEventListener('mousedown', function (e) {
        isDragging = true;
        dragOffsetX = e.clientX - player.getBoundingClientRect().left;
        dragOffsetY = e.clientY - player.getBoundingClientRect().top;
        player.style.transition = "none";
        dragZone.style.cursor = "grabbing";
        document.body.style.userSelect = "none";
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        // Limites de la fenêtre
        const minLeft = 0;
        const minTop = 0;
        const maxLeft = window.innerWidth - player.offsetWidth;
        const maxTop = window.innerHeight - player.offsetHeight;
        let newLeft = e.clientX - dragOffsetX;
        let newTop = e.clientY - dragOffsetY;
        // Empêche de sortir de l'écran
        newLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
        newTop = Math.max(minTop, Math.min(maxTop, newTop));
        player.style.left = newLeft + "px";
        player.style.top = newTop + "px";
        player.style.right = "";
        player.style.position = "fixed";
    });

    document.addEventListener('mouseup', function () {
        if (isDragging) {
            isDragging = false;
            dragZone.style.cursor = "default";
            document.body.style.userSelect = "";
        }
    });

    // ...reste du code...

    // Lecture automatique de la piste suivante à la fin
    /// const audio = document.getElementById('audio');
    audio.addEventListener('ended', function () {
        // Si la boucle est activée, ne rien faire (HTML5 gère déjà la boucle)
        if (!audio.loop) {
            nextTrack();
        }
    });
});