
import React, { useState, useEffect } from 'react';
import './App.css';
//^ Design art éléments
import { Card, Icon, Modal, Empty } from 'antd';
//^ module router
import { useParams } from 'react-router-dom'
// ^ components
import Nav from './Nav'
// ^ Redux
import { connect } from 'react-redux';

// ^ cookies
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const { Meta } = Card;

function ScreenArticlesBySource(props) {

  // * ________________________ VARIABLES & VARIABLES D'ÉTAT ________________________
  const [sourceList, setSourceList] = useState([])
  const [state, setState] = useState(false);
  const [modalArticle, setModalArticle] = useState({});
  /* PARAMS */
  var { id } = useParams()
  /* COOKIES */
  const articleLanguage = cookies.get('lang')

  // * ________________________ INITIALISATION DE MA PAGE ________________________
  useEffect(() => {
    const loadData = async () => {
      const rawResponse = await fetch(`https://newsapi.org/v2/top-headlines?sources=${id}&apiKey=76e4c891477b4b3eaa339beeb9393d48`)
      const response = await rawResponse.json()
      setSourceList(response.articles)
    }
    loadData()

  }, [id]);

  // * ________________________ FUNCTIONS ________________________

  /* Affichage du modal */
  const setModalVisible = (modalVisible, title, content) => {
    setState({ modalVisible });
    setModalArticle({ title: title, content: content })
  }

  /* Pour enregistrer dans la base de donné l'élément et dans le store */
  const addToDatabase = async (element, token) => {
    props.addToWishList(element);
    await fetch('/save-article', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ article: element, user_token: token }),
    });
  }

  // * ________________________ AFFICHAGE ________________________
  const cardList = sourceList.map((element, index) => {

    /* J'ajoute à mon objet sa langue */
    element['articleLanguage'] = articleLanguage

    /* Je renvoie tous les articles */
    return <div key={index} >
      <Card
        style={{ width: 300, margin: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        cover={<a href={element.url}><img style={{ width: "100%" }} alt="article" src={element.urlToImage} />  </a>
        }
        actions={[<Icon type="read" key={index} onClick={() => setModalVisible(true, element.title, element.content)} />,
        <Icon type="like" key="ellipsis" onClick={() => addToDatabase(element, props.user.token)} />]}
      >

        <Meta
          title={element.title}
          description={element.description}
        />

      </Card>


      <Modal
        maskStyle={{ opacity: 0.2 }}
        title={modalArticle.title}
        footer={null}
        keyboard={true}
        centered
        style={{ BoxShadow: "0px 0px 0px rgba(0, 0, 0, 0.1)" }}
        visible={state.modalVisible}
        onCancel={() => setModalVisible(false)}
      >
        <p>{modalArticle.content}</p>
      </Modal>

    </div>
  })


  // * ________________________ MA PAGE ________________________
  return (
    <div>

      <Nav />
      <div className="Banner" />

      <div className="Card">

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: "wrap", }}>

          {sourceList.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : cardList}

        </div>

      </div>

    </div>
  );
}

// * ________________________ REDUX ________________________
function mapDispatchToProps(dispatch) {
  return {
    addToWishList: function (article) {
      dispatch({ type: 'addArticle', article })

    }
  }
}

function mapStateToProps(state) {
  return { user: state.user, article : state.article }
}
// * ________________________ EXPORT ________________________
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenArticlesBySource);

