

const excerpts = [
    {
        title: "Les Fables",
        author: "Jean de La Fontaine",
        loc: "Les Obsèques de la Lionne",
        pbm: "Comment cette fable invite-elle à la réflexion sur la société d'apparence et la crédulité ?",
        plan: [
            "Mouvement 1 : Un deuil général affecté",
            "Mouvement 2 : Une attitude marginale et dangereuse",
            "Mouvement 3 : La mystification d'un courtisan rusé",
        ]
    },

    {
        title: "Les Caractères",
        author: "Jean de La Bruyère",
        loc: "Arias",
        pbm: "Comment ce personnage se révèle-t-il l'exact opposé de l'honnête homme et ainsi comme sa description invite-elle le lecteur à réfléchir à l'égocentrisme et au mensonge ?",
        plan: [
            "Mouvement 1 : La figure de l'imposteur égocentrique",
            "Mouvement 2 : Le menteur placé face à ses propres limites",
        ]
    },

    {
        title:"Les Caractères",
        author:"Jean de La Bruyère",
        loc:"Gnathon",
        pbm:"Comment ce portrait propose-t-il à travers une critique de l'égoïsme et de l'égocentrisme une réflexion sur le modèle de l'honnête homme ?",
        plan:[
            "Mouvement 1 : Les agissements à table d'un homme répugnant",
            "Mouvement 2 : Un homme individualiste qui s'accapare tout"
        ]
    },
    
    {
        title: "Les Caractères",
        author: "Jean de La Bruyère",
        loc: "Pamphile",
        pbm: "Comment la critique de l'orgueil et du paraître est-elle introduite à travers la description d'un personnage opposé au modèle de l'honnête homme ?",
        plan: [
            "1 - Un vaniteux égocentrique obsédé par son image sociale",
            "2 - Le comportement en société d'un homme faux et creux"
        ]
    },
    {
        title: "La Princesse de Clèves",
        author: "Madame de La Fayette",
        loc: "Excipit",
        pbm: "Comment cet excipit, entre destruction et création, fait-il ressortir la perfection d'un destin tragique ?",
        plan: [
            "1 - L'annonce tragique d'une rupture implacable",
            "2 - Le Duc de Nemours, de héros tragique à homme ordinaire",
            "3 - La fin vertueuse d'un personnage d'exception"
        ]
    },
    {
        title: "La Peau de chagrin",
        author: "Honoré de Balzac",
        loc: "Premier extrait (Incipit)",
        pbm: "En quoi ce discours argumentatif préfigurant la suite du roman fantastique s'impose-t-il comme une leçon de vie et de sagesse ?",
        plan: [
            "1 - La critique d'un comportement immature",
            "2 - L'évocation d'une vie passée riche en expériences",
            "3 - Une réflexion critique sur deux notions fondamentales : vouloir et pouvoir",
            "4 - La mise en exergue d'une philosophie de vie constructive"
        ]
    },
    {
        title: "La Peau de chagrin",
        author: "Honoré de Balzac",
        loc: "Deuxième extrait (Excipit)",
        pbm: "Dans quelle mesure cette mort porte-t-elle la marque d'un dénouement tragique ?",
        plan: [
            "1 - L'horreur du trépas qui s'annonce",
            "2 - Pauline, un personnage entre érotisme et désespoir",
            "3 - La fin inéluctable d'un personnage rongé par ses désirs"
        ]
    },
    {
        title: "Les Fleurs du mal",
        author: "Charles Baudelaire",
        loc: "Une Charogne",
        pbm: "Comment la contemplation de la charogne conduit-elle le poète à une réflexion sur l'amour et l'art ?",
        plan: [
            "1 - La contemplation du corps en pleine décomposition (2 premières strophes)",
            "2 - La persistance d'une forme d'existence (strophes 3 à 6)",
            "3 - Une oeuvre d'art inspirante (strophes 7 à 9)",
            "4 - La déclaration d'un amour intemporel (fin du poème)"
        ]
    },
    {
        title: "Le Phénix",
        author: "Paul Eluard",
        loc: "Je t'aime",
        pbm: "Quelle vision de l'amour l'auteur propose-t-il ?",
        plan: [
            "1 - Une femme unique et singularisée",
            "2 - Le poète face aux épreuves de la vie",
            "3 - Un amour salvateur"
        ]
    },
    {
        title: "Mes forêts",
        author: "Hélène Dorion",
        loc: "Mes forêts sont de longues traînées de temps",
        pbm: "Comme l'évocation poétique de la nature propose-t-elle un voyage au coeur de l'intime dans cet écrit liminaire ?",
        plan: [
            "1 - Les forêts, entre dureté et douceur",
            "2 - Les forêts, un voyage temporel vers l'intime",
            "3 - Les forêts, mystère antithétique",
            "4 - Les forêts représentées"
        ]
    },
    {
        title: "Mes forêts",
        author: "Hélène Dorion",
        loc: "On dirait une silhouette mystérieuse",
        pbm: "En quoi le système comparatif et métaphorique qui structure le poème permet-il d'ériger la figure de l'arbre à la fois comme déclenchement mais aussi matière de l'écriture poétique ?",
        plan: [
            "1 - L'arbre symbolique ou la possibilité d'un lien avec le monde : une figure cosmique",
            "2 - La métamorphose de l'arbre ou la mise en abyme de l'écriture poétique"
        ]
    },
    {
        title: "Tartuffe ou l'Imposteur",
        author: "Molière",
        loc: "Acte IV scène 5 (extrait)",
        pbm: "Comment cette scène de séduction basée sur le comique de situation véhicule-t-elle une dénonciation mordante ?",
        plan: [
            "1 - Un tartuffe amoureux",
            "2 - Un tartuffe entreprenant et concupiscent",
            "3 - Une épouse prise au piège"
        ]
    },
    {
        title: "Le Malade imaginaire",
        author: "Molière",
        loc: "Acte I scène 7",
        pbm: "A travers cette scène présentant un mari abusé et une femme profiteuse, comment Molière dénonce-t-il à la fois la duplicité et la naïveté humaines ?",
        plan: [
            "1 - Une donation malhonnête",
            "2 - Un amour et un chagrin affectés",
            "3 - Une épouse aussi fourbe que vénale"
        ]
    },
    {
        title: "On ne badine pas avec l'amour",
        author: "Alfred de Musset",
        loc: "Dénouement",
        pbm: "Comment la fin de ce jeu de passion et de paroles mène-t-elle à un dénouement aux accents tragiques ?",
        plan: [
            "1 - La fragile possibilité d'un amour heureux",
            "2 - Un ultime rebondissement",
            "3 - La tragédie comme seule finalité"
        ]
    }
];

// Correction des plans pour uniformiser les intitulés "Mouvement X :"
const renumMouvements = plan => plan.map((item, idx) => {
    // Remplace "1 -", "2 -", etc. par "Mouvement X :"
    return item.replace(/^(\d+)\s*-\s*/, `Mouvement ${idx + 1} : `);
});

excerpts.forEach(ex => {
    if (Array.isArray(ex.plan)) {
        ex.plan = renumMouvements(ex.plan);
    }
});