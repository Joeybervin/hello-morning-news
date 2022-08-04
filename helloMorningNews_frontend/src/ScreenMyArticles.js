import React, { useState, useEffect } from 'react';
import './App.css';
import { Card, Icon, Modal, Badge, Empty , Avatar} from 'antd';
import Nav from './Nav'
import { connect } from 'react-redux';

const { Meta } = Card;

function ScreenMyArticles(props) {

  // * ________________________ VARIABLES & VARIABLES D'ÉTAT ________________________
  const [userArticlesList, setuUserArticlesList] = useState(props.article[0])
  const [articleLanguageList,setArticleLanguageList] = useState([{articleLanguage: "world", nbrArticle : userArticlesList.length}])
  const [state, setState] = useState(false);
  const [modalArticle, setModalArticle] = useState({});

  const [isHovering, setIsHovering] = useState(false);
  

  // * ________________________ INITIALISATION DE LA PAGE ________________________
  
  useEffect(() => {
    function loadData() {
        for (let i = 0 ; i < userArticlesList.length; i++ ) {
          let findCountry = articleLanguageList.find((element) => element.articleLanguage === userArticlesList[i].articleLanguage)
          let findNbrArticle = userArticlesList.filter((element) => element.articleLanguage === userArticlesList[i].articleLanguage)
          if (!findCountry ){
            setArticleLanguageList([...articleLanguageList,{articleLanguage : userArticlesList[i].articleLanguage, nbrArticle : findNbrArticle.length }])
          }
     }
    }

    loadData()
}, [articleLanguageList, userArticlesList])


  // * ________________________ FUNCTIONS ________________________
  /* Supprimer un article : database & store */
  const deleteData = async (id, index) => {
    props.deleteToWishList(index) 
    await fetch('/delete_article', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_token: props.user.token, article_id: id }),
    })
   
  }

    /* Supprimer tous les articles : database & store */
    const deleteAllData = async () => {
      props.deleteAllWishList() 
      await fetch('/delete_all_article', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_token: props.user.token, article_list : props.article[0]}),
      })
     
    }

    /* Affichage des articles en fonctions de la langue */
  const onlyOfThisCountry = (countryName) => {

    if (countryName === "world") {
      setuUserArticlesList(props.article[0])
    }
    else {
      const list = []
    for (let i = 0; i < props.article[0].length ; i++) {
      if(props.article[0][i].articleLanguage === countryName) {
        list.push(props.article[0][i])
      }
    }
    setuUserArticlesList(list)
    }
   
  }

  /* Affichage du modal */
  const setModalVisible = (modalVisible, title, content) => {
    setState({ modalVisible });
    setModalArticle({ title: title, content: content })

  }

  const coco = (country, el) => {
    if (country === "world") {
      return props.article[0].length
    }
    else {
      return props.article[0].filter((elementInTheFilter) => elementInTheFilter.articleLanguage === el.articleLanguage).length
    }
  }

  // * ________________________ AFFICHAGE ________________________
  /* Affichage des articles */
  const flags = articleLanguageList.map((element, index) => {
    return <div key={index}  style={{marginRight: "20px" }}>
              <Badge count={coco(element.articleLanguage, element)} showZero >
              <img alt="langue" src={`../images/language-flags/${element.articleLanguage}-flag.png`} style={{ width: "50px", height: "50px", borderRadius: "50%", cursor: 'pointer'}} onClick={() => onlyOfThisCountry(element.articleLanguage)} />
              </Badge>
    </div>
  })

  /* Affichage des articles */
  const list = userArticlesList.map((element, index) => {
    return <div key={index} style={{ display: 'flex', justifyContent: 'center' }}>
      <Card
        style={{
          width: 300,
          margin: '15px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
        cover={
          <img
            alt="example"
            src={element.urlToImage}
          />

        }

        actions={[
          <Icon type="read" key="ellipsis2" onClick={() => setModalVisible(true, element.title, element.content)} />,
          <Icon type="delete" key="ellipsis" onClick={() => deleteData(element._id, index)} />
        ]}
      >

        <Meta
          title={element.title}
          description={element.description}
        />

        <Modal
          maskStyle={{ opacity: 0.2 }}
          title={modalArticle.title}
          footer={null}
          keyboard={true}
          centered
          style={{ BoxShadow: "0px 0px 0px rgba(0, 0, 0, 0.6)" }}
          visible={state.modalVisible}
          onCancel={() => setModalVisible(false)}
        >
          <p>{modalArticle.content}</p>
        </Modal>



      </Card>


    </div>

  })

  // * ________________________ MA PAGE ________________________
  return (
    <div>

      {/* Barre de navigation */}
      <Nav />

      <div className="Banner" style={{ display: "flex", justifyContent: "center", padding: "25px", alignItems: "center" }}>


        {/* Les drapeaux des pays des articles sélectionnées */}
        {flags}

        {/* Boutton pour supprimer tous les articles */}
        <Avatar size={52} style={{ backgroundColor: isHovering ? '#51CCD4' : '', 
            color: isHovering ? 'white' : '', cursor: 'pointer',}} icon="delete"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => deleteAllData()} />

      </div>

      {/* Affichage des articles */}
      <div className="Card">
        {userArticlesList.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : list}
      </div>

    </div>
  );
}

// * ________________________ REDUX ________________________
function mapStateToProps(state) {
  return { article: state.article, user: state.user }
}

function mapDispatchToProps(dispatch) {
  return {
    deleteToWishList: function (index) {
      dispatch({ type: 'deleteArticle', index })

    }, deleteAllWishList: function () {
      dispatch({ type: 'deleteAllArticle' })

    }
  }
}
// * ________________________ EXPORT ________________________
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenMyArticles);




