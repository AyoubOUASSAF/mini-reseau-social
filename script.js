document.getElementById("menu-toggle").addEventListener("click", () => {
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector("main");

    // Toggle the collapsed class on the sidebar
    sidebar.classList.toggle("collapsed");

    // Adjust the main content margin dynamically
    if (sidebar.classList.contains("collapsed")) {
        mainContent.style.marginLeft = "80px";
    } else {
        mainContent.style.marginLeft = "220px";
    }
});

//Ajouter des écouteurs d'événement pour les liens de navigation
document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        afficherSection(event.target.getAttribute("href").substring(1));
    });
});

// Données des publications et utilisateurs
const donnees = {
    posts: [
        { id: 1, user: "Hind", content: "Bonjour ! Mon premier post ici !", image: null, reactions: { like: 5, dislike: 2, love: 10 }, comments: [], timeAgo: "2 days ago" },
        { id: 2, user: "Alex", content: "Une superbe photo de mes vacances !", image: "Assets/vacances.png", reactions: { like: 15, dislike: 1, love: 25 }, comments: [], timeAgo: "5 hours ago" },
        { id: 3, user: "Sara", content: "Visiter la Tour Eiffel, quel rêve !", image: "Assets/tour_eiffel.png", reactions: { like: 20, dislike: 0, love: 30 }, comments: [], timeAgo: "1 day ago" },
        { id: 4, user: "Eric", content: "Les promenades en montagne sont les meilleures !", image: "Assets/hiking.png", reactions: { like: 10, dislike: 1, love: 15 }, comments: [], timeAgo: "3 hours ago" },
        { id: 5, user: "Hiba", content: "Les soirées entre amis, inoubliables !", image: "Assets/soiree.png", reactions: { like: 18, dislike: 0, love: 22 }, comments: [], timeAgo: "6 days ago" }
    ],
    amis: [
        { nom: "Hind", image: "https://randomuser.me/api/portraits/women/18.jpg" },
        { nom: "Alex", image: "https://randomuser.me/api/portraits/men/75.jpg" },
        { nom: "Sara", image: "https://randomuser.me/api/portraits/women/64.jpg" },
        { nom: "Eric", image: "https://randomuser.me/api/portraits/men/45.jpg" },
        { nom: "Hiba", image: "https://randomuser.me/api/portraits/women/49.jpg" }
    ],
    conversations: [
        {
            id: 1,
            user: "Hind",
            photo: "https://randomuser.me/api/portraits/women/18.jpg",
            lastMessage: "Salut ! Comment ça va ?",
            messages: [
                { timestamp: "2024-11-14 10:30", sender: "Moi", content: "Bonjour Hind !" },
                { timestamp: "2024-11-14 10:32", sender: "Hind", content: "Salut ! Comment ça va ?" }
            ]
        },
        {
            id: 2,
            user: "Alex",
            photo: "https://randomuser.me/api/portraits/men/75.jpg",
            lastMessage: "Oui, merci !",
            messages: [
                { timestamp: "2024-11-14 09:00", sender: "Moi", content: "Coucou Alex, tout va bien ?" },
                { timestamp: "2024-11-14 09:05", sender: "Alex", content: "Oui, merci !" }
            ]
        },
        {
            id: 3,
            user: "Sara",
            photo: "https://randomuser.me/api/portraits/women/64.jpg",
            lastMessage: "Merci pour ton aide, c'était super !",
            messages: [
                { timestamp: "2024-11-14 11:00", sender: "Moi", content: "Salut Sara !" },
                { timestamp: "2024-11-14 11:02", sender: "Sara", content: "Merci pour ton aide, c'était super !" }
            ]
        }
    ]
};

// Afficher une section spécifique
function afficherSection(sectionId) {
    document.querySelectorAll("main > section").forEach(section => {
        section.style.display = section.id === sectionId ? "block" : "none";
    });
}

const userReactions = new Map();

// Générer et afficher les publications
function afficherPosts() {
    const conteneurPosts = document.getElementById("posts-container");
    conteneurPosts.innerHTML = "";

    donnees.posts.forEach(post => {
        const user = donnees.amis.find(ami => ami.nom === post.user);

        const postElement = document.createElement("div");
        postElement.className = "post";

        postElement.innerHTML = `
            <div class="post-header">
                <img src="${user.image}" alt="${post.user}" class="post-user-image">
                <div class="post-user-details">
                    <h4>${post.user}</h4>
                    <p class="post-timestamp">${post.timeAgo}</p>
                </div>
            </div>
            <p class="post-content">${post.content}</p>
            ${post.image
                ? `<img src="${post.image}" alt="Post image" class="post-image" onclick="afficherImagePleinEcran('${post.image}')">`
                : ""
            }
            <div class="post-actions"></div>
            <div class="post-comments">
                <h5>Commentaires</h5>
                <div class="commentaires-container">
                    ${post.comments.map(renderComment).join("")}
                </div>
                <form class="formulaire-commentaire" onsubmit="ajouterCommentaire(event, ${post.id})">
                    <input type="text" placeholder="Ajouter un commentaire..." />
                    <button type="submit">⏎</button>
                </form>
            </div>
        `;

        // Ajouter des boutons de réaction
        const postActions = postElement.querySelector(".post-actions");
        postActions.appendChild(creerBoutonReaction("like", post.reactions.like, post.id));
        postActions.appendChild(creerBoutonReaction("dislike", post.reactions.dislike, post.id));
        postActions.appendChild(creerBoutonReaction("love", post.reactions.love, post.id));

        conteneurPosts.appendChild(postElement);
    });
}

// Afficher la photo en plein écran si le post en contient une.
function afficherImagePleinEcran(imageSrc) {
    const modal = document.createElement("div");
    modal.className = "modal";

    // Contenu modal
    modal.innerHTML = `
        <div class="modal-content">
            <img src="${imageSrc}" alt="Image en plein écran">
            <button class="close-modal" onclick="fermerImagePleinEcran()">×</button>
        </div>
    `;

    // Fermer le modal en cliquant en dehors de l'image
    modal.addEventListener("click", (e) => {
        if (e.target === modal) fermerImagePleinEcran();
    });

    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";
}

// Fermer la photo
function fermerImagePleinEcran() {
    const modal = document.querySelector(".modal");
    if (modal) {
        modal.remove();
        document.body.style.overflow = "";
    }
}

// Rendu d'un commentaire
function renderComment(comment) {
    const user = donnees.amis.find(ami => ami.nom === comment.user);

    return `
        <div class="commentaire">
            <div class="comment-header">
                <img src="${user ? user.image : 'https://randomuser.me/api/portraits/men/86.jpg'}" 
                     alt="${comment.user}" class="comment-user-image">
                <div>
                    <p class="comment-user">${comment.user}</p>
                    <p class="comment-content">${comment.content}</p>
                </div>
            </div>
            <button class="reply-button" onclick="afficherFormulaireReponse(this, ${comment.id})">Répondre</button>
            <div class="reponses-container">
                ${comment.replies.map(reply => `<p class="reponse">${reply.content}</p>`).join("")}
            </div>
        </div>
    `;
}

// Ajouter un commentaire à un post
function ajouterCommentaire(event, postId) {
    event.preventDefault();
    const input = event.target.querySelector("input");
    if (input.value.trim() !== "") {
        const post = donnees.posts.find(post => post.id === postId);
        if (post) {
            post.comments.push({ id: Date.now(), user: "Moi", content: input.value.trim(), replies: [] });
            afficherPosts();
        }
    }
}

// Affiche un formulaire de réponse sous un commentaire
function afficherFormulaireReponse(button, commentId) {
    const reponsesContainer = button.nextElementSibling;
    const form = document.createElement("form");
    form.className = "formulaire-reponse";
    form.innerHTML = `
        <input type="text" placeholder="Répondre..." />
        <button type="submit">⏎</button>
    `;
    form.onsubmit = event => {
        event.preventDefault();
        const input = form.querySelector("input");
        if (input.value.trim() !== "") {
            const comment = donnees.posts
                .flatMap(post => post.comments)
                .find(comment => comment.id === commentId);
            if (comment) {
                comment.replies.push({ content: input.value.trim() });
                afficherPosts(); // Refresh the posts
            }
        }
    };
    reponsesContainer.appendChild(form);
    button.disabled = true;
}

// Affiche un commentaire et ses réponses
function afficherCommentaire(comment, container) {
    const commentaireElement = document.createElement("div");
    commentaireElement.className = "commentaire";
    commentaireElement.innerHTML = `<p>${comment.content}</p>`;

    const reponsesContainer = document.createElement("div");
    reponsesContainer.className = "reponses-container";
    comment.replies.forEach(reply => afficherCommentaire(reply, reponsesContainer));

    const actions = document.createElement("div");
    actions.className = "actions-commentaire";
    const boutonRepondre = document.createElement("button");
    boutonRepondre.textContent = "Répondre";
    boutonRepondre.addEventListener("click", () => {
        const reponseForm = document.createElement("form");
        reponseForm.innerHTML = `
            <input type="text" placeholder="Répondre...">
            <button type="submit">⏎</button>
        `;
        reponseForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const input = reponseForm.querySelector("input");
            if (input.value.trim() !== "") {
                comment.replies.push({ content: input.value.trim(), replies: [] });
                afficherPosts();
            }
        });
        commentaireElement.appendChild(reponseForm);
    });

    actions.appendChild(boutonRepondre);
    commentaireElement.append(reponsesContainer, actions);
    container.appendChild(commentaireElement);
}

// Créer des boutons de réaction
function creerBoutonReaction(type, compteur, postId) {
    const bouton = document.createElement("button");
    bouton.className = `reaction-button reaction-${type}`;
    bouton.textContent = `${type === "like" ? "👍" : type === "dislike" ? "👎" : "❤️"} ${compteur}`;
    bouton.addEventListener("click", () => ajouterReaction(postId, type, bouton));
    return bouton;
}

// Ajouter une réaction
function ajouterReaction(postId, reactionType, button) {
    const post = donnees.posts.find(post => post.id === postId);
    const userReactionKey = `${postId}-${reactionType}`;

    if (!post) return;

    // Vérifiez si l'utilisateur a déjà réagi
    if (userReactions.get(userReactionKey)) {
        // Toggle OFF: L'utilisateur a déjà réagi, supprimez la réaction
        post.reactions[reactionType]--;
        userReactions.delete(userReactionKey);
        button.textContent = `${reactionType === "like" ? "👍" : reactionType === "dislike" ? "👎" : "❤️"} ${post.reactions[reactionType]}`;
        button.classList.remove("clicked");
    } else {
        // Toggle ON: Ajouter la réaction
        post.reactions[reactionType]++;
        userReactions.set(userReactionKey, true); //  Suivre la réaction
        button.textContent = `${reactionType === "like" ? "👍" : reactionType === "dislike" ? "👎" : "❤️"} ${post.reactions[reactionType]}`;
        button.classList.add("clicked");
        showParticleAnimation(button, reactionType);
    }
}
// Affiche la liste des conversations disponibles. 
function afficherConversations() {
    const conteneur = document.getElementById("conversations-container");
    const backButton = document.getElementById("back-button");
    const detailsContainer = document.getElementById("message-details");

    // Affiche la liste des conversations et masque les détails
    conteneur.style.display = "block";
    backButton.style.display = "none";
    detailsContainer.innerHTML = "";

    // Vide le conteneur et ajoute les conversations depuis les données
    conteneur.innerHTML = "";
    donnees.conversations.forEach(conversation => {
        const convElement = document.createElement("div");
        convElement.className = "conversation";
        convElement.innerHTML = `
            <img src="${conversation.photo}" class="conv-image" alt="${conversation.user}">
            <div class="conversation-details">
                <h4>${conversation.user}</h4>
                <p>${conversation.lastMessage}</p>
            </div>
        `;

        // Ajoute un événement pour afficher les détails de la conversation au clic
        convElement.addEventListener("click", () => afficherDetailsConversation(conversation));
        conteneur.appendChild(convElement);
    });
}

// Affiche les détails d'une conversation sélectionnée.
function afficherDetailsConversation(conversation) {
    const conteneur = document.getElementById("conversations-container");
    const backButton = document.getElementById("back-button");
    const detailsContainer = document.getElementById("message-details");

    // Masque la liste des conversations et affiche le bouton "Retour"
    conteneur.style.display = "none";
    backButton.style.display = "block";

    // Affiche l'en-tête de la conversation
    detailsContainer.innerHTML = `
        <div class="conversation-header">
            <img src="${conversation.photo}" class="conv-image" alt="${conversation.user}">
            <h4>${conversation.user}</h4>
        </div>
    `;

    // Crée un conteneur pour les messages de la conversation
    const messagesContainer = document.createElement("div");
    messagesContainer.className = "messages-container";
    conversation.messages.forEach(msg => afficherMessage(msg, messagesContainer));
    detailsContainer.appendChild(messagesContainer);

    // Ajoute un formulaire pour envoyer un nouveau message
    const formMessage = document.createElement("form");
    formMessage.className = "formulaire-message";
    formMessage.innerHTML = `
        <input type="text" placeholder="Écrire un message...">
        <button type="submit">⏎</button>
    `;
    formMessage.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = formMessage.querySelector("input");
        if (input.value.trim() !== "") {
            conversation.messages.push({
                timestamp: new Date().toLocaleString("fr-FR"),
                sender: "Moi",
                content: input.value.trim()
            });
            afficherDetailsConversation(conversation); // Recharge les détails de la conversation
        }
    });
    detailsContainer.appendChild(formMessage);
}

// Affiche un message individuel dans un conteneur de messages.
function afficherMessage(message, container) {
    const msgElement = document.createElement("div");
    msgElement.className = "message";
    msgElement.innerHTML = `
        <p class="message-details">${message.sender} • ${message.timestamp}</p>
        <p class="message-content">${message.content}</p>
    `;
    container.appendChild(msgElement);
}

// Retourne à la vue de la liste des conversations. 
function retourConversations() {
    const conteneur = document.getElementById("conversations-container");
    const detailsContainer = document.getElementById("message-details");
    const backButton = document.getElementById("back-button");

    // Affiche la liste des conversations et réinitialise les détails
    conteneur.style.display = "block";
    detailsContainer.innerHTML = "";
    backButton.style.display = "none";
}



// Initialisation 
afficherPosts();
afficherSection("feed");
afficherConversations();