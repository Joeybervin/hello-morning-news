//^ My collections 
var userModel = require('../models/user');
var articleModel = require('../models/article');

var express = require('express');
var router = express.Router();

//^ Module de chiffrement de mot de passe 
var bcrypt = require('bcrypt');
var uid2 = require('uid2');

//^ Nombre de tour 
const cost = 10;


// * connexion d'un user 
router.post('/sign-in', async function(req, res, next) {
  let alreadyMember = false;

//* Vérifications des informations données
  var account = await userModel.findOne({
    email: req.body.signInEmailFront}).populate('articlelist').exec();
  
  var password = req.body.signInPasswordFront

  if (account && bcrypt.compareSync(password, account.password)) {
    alreadyMember = true
    res.json({alreadyMember, user : account })
  }
  else {
    
    alreadyMember = false
    res.json({alreadyMember})
  }
 

  

});

// * Création d'un compte 
router.post('/sign-up',async  function(req, res, next) {
  let alreadyMember = false;
  /* Véfificaton si le compte éxiste déjà */
  var account = await userModel.findOne({ email: req.body.signUpEmail });

  /* Pour chiffrer le mot de passe */
  const hash = bcrypt.hashSync(req.body.signUpPassword, cost);

  /* Ajout de l'utilisateur à la base de données */
  if (!account && req.body.signUpEmail !== "" && req.body.signUpPassword !== "" && req.body.signUpUsername !== "") {
    alreadyMember = true
    var newUser = new userModel({
      email: req.body.signUpEmail,
      password: hash,
      username : req.body.signUpUsername,
      token : uid2(32)
    })

    /* J'enregistre dans la base de données */
    await newUser.save()
    res.json({alreadyMember, user : newUser })
    
  }else {
    res.json({alreadyMember })
  }
  




});

//* Enregistrer un article
router.post('/save-article', async function(req, res, next) {
  const articleData  = req.body.article
  const userData = req.body.user_token

  let article = await articleModel.findOne({ title: articleData.title });
  let user = await userModel.findOne({ token: userData });
  let connexion = true;
  let article_bouble = false;
  
  /* Ajout d'un article à la base de données ==> SI UN UTILISATEUR EST CONNECTÉ */
  if (!article && user !== undefined ) {
    console.log("!article && user !== undefined")
    var newArticle = new articleModel({
      articleLanguage: articleData.articleLanguage,
      author : articleData.author,
      content: articleData.content,
      description: articleData.description,
      publishAt: articleData.publishAt,
      source: articleData.source,
      title: articleData.title,
      url: articleData.url,
      urlToImage : articleData.urlToImage,
    })
    await newArticle.save();

    await userModel.updateOne(
      {token: userData},
      {$push : {articlelist : newArticle.id}}
      );
  }
  else if (article && user !== undefined) {
    console.log("article && user !== undefined")

    let user_articles_list = await userModel.findOne({ token: userData, articlelist : article.id});

    if (!user_articles_list) {
      console.log("!user_articles_list")
      await userModel.updateOne(
      {token: userData},
      {$push : {articlelist : article.id}}
      );
    }
    else {
      console.log("lest")
      res.json({article_bouble})
    }
    

  }
  else {
    connexion = false;
    res.json({connexion})
  }

  console.log("userData")
  
});

//* Supprimer un article
router.post('/delete_article', async function (req, res, next) {
  const articleData  = req.body.article_id
  const userData = req.body.user_token

  await userModel.updateOne(
    {token: userData},
    {$pull : {articlelist : articleData}}
    );
 
});

//* Supprimer tous les articles
router.post('/delete_all_article', async function (req, res, next) {
  const articleData  = req.body.article_list
  const userData = req.body.user_token

  
  let user = await userModel.find({ token: userData });
console.log(user.articlelist)

  
 
});



module.exports = router;
