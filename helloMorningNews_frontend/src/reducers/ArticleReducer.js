export default function(articleLikedList=[], action) {
    // * Ajout d'un article
    if(action.type === "addArticle") {


        // & AU CLIQUE SUR LE LIKE, QUAND LE TABLEAU DE LA DATABASE À DÉJÀ ÉTÉ AJOUTÉE
        if (articleLikedList[0] !== undefined) {
            /* Je recherche les doublons */
            let double = articleLikedList[0].find((element) => element.title === action.article.title)

            if (!double) { // Si pas de doublons
                let newArticleLikedList = [...articleLikedList] // Je fait une copie de mon tableau
                newArticleLikedList[0].push(action.article) // j'ajoute dans mon nouveau tableau tous mes articles
                return newArticleLikedList
            }
            
        }
        // & AU CLIQUE SUR LE SIGN-UP / SIGN-IN POUR L'AJOUT DU TABLEAU DE LA DATABASE AU STORE
        else {
        let double = articleLikedList.find((element) => element.title === action.article.title)

            if (!double) {

                // Je fait une copie de mon tableau
                let newArticleLikedList = [...articleLikedList]
                // j'ajoute dans mon nouveau tableau tous mes articles
                
                newArticleLikedList.push(action.article)
                console.log("2 : ",articleLikedList)
                return newArticleLikedList
            }
        }

        return articleLikedList

    }
    // * Suppression d'un article
    else if(action.type === "deleteArticle") {
        let newArticleLikedList = [...articleLikedList]
        newArticleLikedList[0].splice(action.index, 1)
        return newArticleLikedList
    }
    else if ( action.type === "deleteAllArticle") {
        let newArticleLikedList = [...articleLikedList]
        newArticleLikedList[0].splice(0, newArticleLikedList[0].length)
        return newArticleLikedList
    }
    else {
        return articleLikedList;
    }
}