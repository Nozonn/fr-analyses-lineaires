// This file contains the JavaScript code that handles the interactive features of the website.

function createExcerptList() {
    const list = document.getElementById('excerpt-list');
    list.innerHTML = '';
    excerpts.forEach((ex, idx) => {
        const li = document.createElement('li');
        li.id = `excerpt-${idx}`;
        li.className = 'excerpts';
        li.innerHTML = `
            <span class="arrow" style="cursor:pointer;">&#9654;</span>
            <span class="excerpt-label">${ex.loc} - ${ex.title} - ${ex.author}</span>
            <div class="excerpt-details">
                <span style="color:green;"><strong>Problématique :</strong> <div>${ex.pbm}</div></span>
                <span><strong>Plan :</strong> <div>${ex.plan.join("<br>")}</div></span>
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
    document.getElementById("game-title").textContent = `${ex.loc} - ${ex.title} - ${ex.author}`;


}


function game(ex) {
    resetGame(ex); // Réinitialise le jeu
    showElements(ex); // Affiche les éléments du jeu

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
        const user = input.value.trim();
        if (parent.classList.contains('input-wrong')) {
            // Affiche la correction dans l'input en rouge
            input.value = expected;
            input.style.color = "#e74c3c";
            input.style.fontWeight = "bold";
        }
        input.disabled = true; // Empêche de modifier après correction
    });

    // Affiche la correction sous les inputs
    let correction = '<div id="correction" style="color:#c0392b; margin-top:18px; font-weight:bold;">Réponse : ';
    correction += idxMissing.map(i => words[i]).join(" / ");
    correction += '</div>';
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
            currentErrors.push({mot: expected, reponse: user});
        }
    });

    attempts++;
    totalQuestions += inputDivs.length;

    if (allCorrect) {
        totalCorrect += inputDivs.length;
        document.getElementById("btnValidate").textContent = "Suivant";
        document.getElementById("btnValidate").onclick = nextStep;
    } else if (attempts >= 3) {
        // Stocke les erreurs pour le récap
        currentErrors.forEach(err => recapErrors.push({
            phrase: phrases[idxPhrases],
            attendu: err.mot,
            donne: err.reponse
        }));
        showCorrection(words);
        document.getElementById("btnValidate").textContent = "Suivant";
        document.getElementById("btnValidate").onclick = nextStep;
    }
}


// Ajoute ce bloc à la fin de ton fichier ou après la déclaration de validate()
document.addEventListener('keydown', function(e) {
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
        Bravo ! Tu as trouvé <span style="color:#27ae60;font-weight:bold;">${totalCorrect}</span> mot(s) sur <span style="color:#1e3c72;font-weight:bold;">${totalQuestions}</span>.
    </div>`;

    if (recapErrors.length > 0) {
        html += `<div style="margin-bottom:18px;"><strong>Erreurs :</strong><ul style="color:#e74c3c;">`;
        recapErrors.forEach(err => {
            html += `<li>
                <em>${err.phrase}</em><br>
                Attendu : <b>${err.attendu}</b> | Ta réponse : <b>${err.donne || "(vide)"}</b>
            </li>`;
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


