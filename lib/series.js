export const SERIES = [
  {
    slug: "le-mensonge",
    mode: "fast",
    platform: "TikTok",
    genre: "Médical",
    mixeurParams: { mode: "fast", casting: "1 Femme + 1 Homme", univers: "Hôpital privé", secret: "Double vie", lieu: "Couloir vide" },
    bible: {
      titre: "Le Mensonge",
      logline: "Une infirmière cache une erreur médicale jusqu'au jour où la victime revient comme interne.",
      pitch: "À l'hôpital Saint-Luc, personne ne sait que la meilleure infirmière a commis l'irréparable. Quand le patient qu'elle a blessé revient en blouse blanche, chaque couloir devient un piège. Jusqu'où ira-t-elle pour protéger sa vie ?",
      tension_centrale: "Va-t-elle avouer avant qu'il ne découvre tout seul ?",
      accroche: "Elle l'a presque tué. Il ne sait pas encore.",
      personnages: [
        { nom: "Clara", age: 34, role: "Infirmière cheffe", secret: "A falsifié un dossier médical après une erreur de dosage" },
        { nom: "Julien", age: 28, role: "Interne en médecine", secret: "Est le patient qu'elle a blessé 3 ans plus tôt" },
      ],
    },
    episodes: [
      { numero: 1, titre: "Première garde", cliffhanger: "Julien ouvre le dossier 2021...", tension: 3 },
      { numero: 2, titre: "Il sait", cliffhanger: "Clara trouve son téléphone déverrouillé sur son propre dossier.", tension: 6 },
      { numero: 3, titre: "Le chef de service", cliffhanger: "Le directeur convoque Clara. Et Julien est déjà dans son bureau.", tension: 8 },
      { numero: 4, titre: "Trop tard", cliffhanger: "Clara signe sa démission — mais Julien déchire la feuille.", tension: 10 },
    ],
    script: {
      hook_scene: {
        texte: "Clara tient le dossier. Ses mains tremblent. Le nom sur la couverture : JULIEN MOREAU.",
        visuel_916: "Gros plan mains crispées sur dossier, bague qui claque contre le carton",
      },
      scenes: [
        { perso: "JULIEN", dialogue: "Infirmière Bertin. On se connaît ?", jeu: "sourire innocent, regard qui cherche", visuel_916: "Plan américain, couloir désert derrière lui" },
        { perso: "CLARA", dialogue: "Non. Bienvenue dans le service.", jeu: "voix trop calme, yeux qui fuient", visuel_916: "Contre-champ serré, elle tourne le dos" },
        { perso: "JULIEN", dialogue: "Bizarre. J'ai l'impression qu'on s'est déjà vus.", jeu: "penche la tête, observe", visuel_916: "Zoom lent sur son visage" },
        { perso: "CLARA", dialogue: "On voit beaucoup de monde ici.", jeu: "force un sourire, repart vite", visuel_916: "Plan large, elle s'éloigne dans le couloir" },
      ],
      cliffhanger_scene: {
        texte: "Clara referme la porte de la réserve. Julien est de l'autre côté — il tient un dossier de 2021.",
        visuel_916: "Cut brutal profil Clara, porte qui se ferme, silence",
        label: "Il sait ?",
      },
    },
  },
  {
    slug: "heritage",
    mode: "premium",
    platform: "Reels",
    genre: "Finance",
    mixeurParams: { mode: "premium", casting: "1 Femme + 1 Homme", univers: "Finance internationale", secret: "Complot financier", lieu: "Cabinet privé" },
    bible: {
      titre: "Héritage",
      logline: "Un directeur financier cache un détournement jusqu'au jour où sa propre fille rejoint le cabinet d'audit.",
      pitch: "Dans les hauteurs de la finance parisienne, Marc Delorme a tout construit sur un mensonge. Quand Chloé, sa fille, débarque comme auditrice mandatée par le conseil, le silence entre eux devient plus dangereux que les chiffres. Qui trahira l'autre en premier ?",
      tension_centrale: "Va-t-elle sacrifier son père pour sa carrière ?",
      accroche: "Il a volé pour elle. Elle est là pour le trouver.",
      personnages: [
        { nom: "Marc", age: 52, role: "Directeur financier", secret: "Détourne 2M€ depuis 4 ans pour payer les études de sa fille" },
        { nom: "Chloé", age: 26, role: "Auditrice externe", secret: "Sait depuis 6 mois — et n'a rien dit" },
      ],
    },
    episodes: [
      { numero: 1, titre: "L'auditrice", cliffhanger: "Marc reconnaît l'écriture dans le rapport. C'est la sienne.", tension: 4 },
      { numero: 2, titre: "Le silence", cliffhanger: "Chloé laisse volontairement une page blanche dans son rapport.", tension: 6 },
      { numero: 3, titre: "Le conseil", cliffhanger: "Marc comprend : elle le protège. Mais pourquoi maintenant ?", tension: 8 },
      { numero: 4, titre: "La vérité", cliffhanger: "Chloé pose sa démission sur le bureau. Et une clé USB.", tension: 10 },
    ],
    script: {
      hook_scene: {
        texte: "Chloé entre dans le bureau. Marc se lève. Ils ne se sont pas vus depuis Noël. Elle pose son badge d'auditrice sur son bureau.",
        visuel_916: "Plan séquence lent, badge qui glisse sur le bois, leurs mains qui ne se touchent pas",
      },
      scenes: [
        { perso: "MARC", dialogue: "Tu aurais pu me prévenir.", jeu: "voix basse, mâchoire serrée", visuel_916: "Gros plan profil, regard vers la fenêtre" },
        { perso: "CHLOÉ", dialogue: "C'est exactement pour ça que je ne l'ai pas fait.", jeu: "calme absolu, ouvre son ordinateur", visuel_916: "Plan poitrine, doigts sur clavier" },
        { perso: "MARC", dialogue: "Tu sais ce que tu fais ?", jeu: "s'approche, baisse la voix", visuel_916: "Deux shot serré, très peu d'espace entre eux" },
        { perso: "CHLOÉ", dialogue: "Mon travail.", jeu: "lève les yeux, soutient son regard", visuel_916: "Contre-plongée légère sur elle" },
      ],
      cliffhanger_scene: {
        texte: "Chloé fait défiler les colonnes. Elle s'arrête. Ligne 47. Le virement porte la date de son inscription en master.",
        visuel_916: "Insert écran, curseur qui s'immobilise, reflet de Chloé dans le moniteur",
        label: "Elle savait.",
      },
    },
  },
  {
    slug: "deux-vies",
    mode: "fast",
    platform: "Shorts",
    genre: "Famille",
    mixeurParams: { mode: "fast", casting: "1 Femme + 1 Homme", univers: "Famille recomposée", secret: "Double vie", lieu: "Salle d'attente" },
    bible: {
      titre: "Deux Vies",
      logline: "Une mère de famille cache une double vie jusqu'au jour où son fils trouve son second téléphone.",
      pitch: "En apparence, Sophie est la mère parfaite. Mais depuis 2 ans, elle mène une autre vie le mercredi soir. Quand Lucas, 19 ans, trouve le téléphone qu'elle croyait bien caché, il doit choisir : protéger sa mère ou la vérité.",
      tension_centrale: "Va-t-il parler à son père avant qu'elle ne lui avoue ?",
      accroche: "Mercredi soir, elle ment. Il l'a su ce matin.",
      personnages: [
        { nom: "Sophie", age: 43, role: "Mère / Directrice RH", secret: "Mène une seconde vie comme entrepreneuse sous fausse identité" },
        { nom: "Lucas", age: 19, role: "Fils étudiant", secret: "A lu tous ses messages — depuis 3 semaines" },
      ],
    },
    episodes: [
      { numero: 1, titre: "Le téléphone", cliffhanger: "Lucas répond à un message à la place de sa mère.", tension: 4 },
      { numero: 2, titre: "Mercredi", cliffhanger: "Sophie rentre à 23h. Lucas l'attend dans le noir.", tension: 6 },
      { numero: 3, titre: "La question", cliffhanger: "Lucas demande : 'C'est qui Emma ?' Sophie pâlit.", tension: 8 },
      { numero: 4, titre: "Tout dire", cliffhanger: "Sophie avoue tout. Lucas sort son propre téléphone — il a tout enregistré.", tension: 10 },
    ],
    script: {
      hook_scene: {
        texte: "Le téléphone vibre sous le coussin du canapé. Lucas le retourne. Le contact s'appelle 'Emma'. Photo : sa mère, cheveux courts.",
        visuel_916: "Gros plan écran qui s'allume, visage de Lucas dans le reflet",
      },
      scenes: [
        { perso: "LUCAS", dialogue: "Maman, t'as oublié quelque chose.", jeu: "voix neutre, téléphone dans le dos", visuel_916: "Plan taille, couloir d'entrée" },
        { perso: "SOPHIE", dialogue: "Je rentrais juste chercher mes clés.", jeu: "pose son manteau, ne regarde pas", visuel_916: "Plan américain, elle de dos" },
        { perso: "LUCAS", dialogue: "Emma t'a envoyé quelque chose.", jeu: "sort le téléphone lentement", visuel_916: "Insert main qui tend le téléphone" },
        { perso: "SOPHIE", dialogue: "...", jeu: "se fige, se retourne très lentement", visuel_916: "Zoom lent sur son visage" },
      ],
      cliffhanger_scene: {
        texte: "Sophie tend la main pour prendre le téléphone. Lucas le referme. Il ne le lâche pas.",
        visuel_916: "Deux mains sur le téléphone, plan serré, ni l'un ni l'autre ne cède",
        label: "Il veut quoi ?",
      },
    },
  },
  {
    slug: "7eme-etage",
    mode: "fast",
    platform: "Shorts",
    genre: "Romantique",
    mixeurParams: { mode: "fast", casting: "1 Femme + 1 Homme", univers: "Immeuble de luxe", secret: "Amour interdit", lieu: "Ascenseur" },
    bible: {
      titre: "7ème Étage",
      logline: "Un gardien d'immeuble tombe amoureux d'une résidente milliardaire — mais son mari est le propriétaire qui veut le licencier.",
      pitch: "Dans un immeuble haussmannien du 8e arrondissement, Karim et Diane se retrouvent chaque matin dans le même ascenseur. Trente secondes. Chaque jour. Jusqu'au soir où l'ascenseur tombe en panne entre le 4e et le 5e étage. Deux heures. Tout change.",
      tension_centrale: "Peuvent-ils s'aimer sans que l'un des deux perde tout ?",
      accroche: "Il répare tout dans cet immeuble. Sauf ce qu'elle a brisé.",
      personnages: [
        { nom: "Karim", age: 31, role: "Gardien / Ancien architecte", secret: "A quitté une carrière brillante après un burnout — personne ne le sait" },
        { nom: "Diane", age: 38, role: "Résidente — femme de l'associé principal", secret: "Négocie en secret son divorce depuis 6 mois" },
      ],
    },
    episodes: [
      { numero: 1, titre: "Panne", cliffhanger: "L'ascenseur s'arrête. Diane rit. Karim reconnaît ses plans d'archi accrochés dans le couloir.", tension: 3 },
      { numero: 2, titre: "Le mari", cliffhanger: "Le mari de Diane appelle Karim pour 'une conversation'. Diane l'a vu composer le numéro.", tension: 6 },
      { numero: 3, titre: "Licencié", cliffhanger: "Karim reçoit sa lettre de licenciement. Signée par Diane.", tension: 9 },
      { numero: 4, titre: "La vraie raison", cliffhanger: "Diane glisse une enveloppe sous la porte de Karim. C'est le bail de l'immeuble — à son nom.", tension: 10 },
    ],
    script: {
      hook_scene: {
        texte: "L'ascenseur s'arrête brutalement. Karim regarde le tableau de bord. Diane regarde Karim. Le silence dure trois secondes de trop.",
        visuel_916: "Plan serré deux visages dans le miroir de l'ascenseur, néons qui vacillent",
      },
      scenes: [
        { perso: "DIANE", dialogue: "Vous savez combien de temps ça va durer ?", jeu: "feint le calme, serre son sac", visuel_916: "Plan poitrine, elle adossée à la paroi" },
        { perso: "KARIM", dialogue: "Ça dépend de ce que vous voulez réparer.", jeu: "regarde le tableau, évite son regard", visuel_916: "Plan dos, mains sur les commandes" },
        { perso: "DIANE", dialogue: "Je ne vous ai pas demandé une métaphore.", jeu: "sourire involontaire, le regarde enfin", visuel_916: "Contre-champ, leurs reflets superposés" },
        { perso: "KARIM", dialogue: "Deux heures. Peut-être moins si vous arrêtez de parler.", jeu: "léger sourire de côté", visuel_916: "Zoom très lent sur son profil" },
      ],
      cliffhanger_scene: {
        texte: "Les portes s'ouvrent enfin. Le mari de Diane est là, dans le couloir. Il regarde Karim. Puis Diane. Puis Karim.",
        visuel_916: "Plan large porte qui s'ouvre, silhouette mari en contre-jour, cut brutal",
        label: "Il a attendu.",
      },
    },
  },
  {
    slug: "associees",
    mode: "premium",
    platform: "TikTok",
    genre: "Trahison",
    mixeurParams: { mode: "premium", casting: "2 Femmes", univers: "Agence de communication", secret: "Trahison professionnelle", lieu: "Open space" },
    bible: {
      titre: "Associées",
      logline: "Deux amies fondent une agence ensemble — jusqu'au jour où l'une découvre que l'autre lui vole ses clients depuis le début.",
      pitch: "Léa et Inès ont tout construit ensemble : l'agence, les clients, la réputation. Cinq ans de complicité. Mais quand Léa tombe sur un email effacé dans la corbeille, elle comprend que son associée ne partage pas seulement les bureaux — elle duplique ses stratégies et les revend à la concurrence. En silence. Depuis deux ans.",
      tension_centrale: "Léa va-t-elle la confronter ou la piéger à son propre jeu ?",
      accroche: "Elle lui a tout appris. Elle aurait dû garder quelque chose pour elle.",
      personnages: [
        { nom: "Léa", age: 34, role: "Fondatrice créative", secret: "A découvert la trahison il y a 3 semaines — et n'a rien dit" },
        { nom: "Inès", age: 33, role: "Associée / Directrice commerciale", secret: "Prépare son départ en montant une agence concurrente" },
      ],
    },
    episodes: [
      { numero: 1, titre: "L'email", cliffhanger: "Léa relit l'email supprimé. Le destinataire : Nexus Agency — leur principal concurrent.", tension: 4 },
      { numero: 2, titre: "La réunion", cliffhanger: "Inès présente la stratégie de Léa comme 'sa nouvelle approche'. Le client applaudit.", tension: 6 },
      { numero: 3, titre: "Le piège", cliffhanger: "Léa envoie une fausse stratégie. Si elle la retrouve chez Nexus, c'est confirmé.", tension: 8 },
      { numero: 4, titre: "Démission", cliffhanger: "Inès pose sa démission. Léa sort les documents du notaire — elle a racheté ses parts hier.", tension: 10 },
    ],
    script: {
      hook_scene: {
        texte: "Léa fait défiler la corbeille. Un email d'Inès à Nexus Agency. Objet : 'Stratégie Q3 — confidentiel'. Date : il y a 14 mois.",
        visuel_916: "Gros plan écran d'ordinateur, reflet de Léa dans l'écran, souris qui se fige",
      },
      scenes: [
        { perso: "INÈS", dialogue: "Tu as l'air fatiguée. Tout va bien ?", jeu: "sourire sincère, pose une main sur son épaule", visuel_916: "Plan américain open space, collègues flous derrière" },
        { perso: "LÉA", dialogue: "Très bien. Je repassais les dossiers Nexus.", jeu: "ne lève pas les yeux, voix parfaitement neutre", visuel_916: "Plan serré mains sur clavier" },
        { perso: "INÈS", dialogue: "Nexus ? Pour quoi faire ?", jeu: "infime variation dans la voix — hésitation d'une seconde", visuel_916: "Contre-champ, visage d'Inès en légère tension" },
        { perso: "LÉA", dialogue: "Curiosité.", jeu: "lève les yeux, sourit — le même sourire qu'Inès", visuel_916: "Zoom imperceptible, duel de regards" },
      ],
      cliffhanger_scene: {
        texte: "Léa envoie l'email piégé. Elle pose son téléphone face visible sur le bureau. Elle attend.",
        visuel_916: "Plan fixe téléphone sur bureau, notification qui n'arrive pas, puis… vibration",
        label: "Elle a cliqué.",
      },
    },
  },
];
