// ^ modules react
import React, { useState, useEffect } from 'react';

// ^ App
import './App.css';

// ^ modules / balises du router
import { Link } from "react-router-dom";

// ^ balises de Design Art
import { List, Avatar } from 'antd';

// ^ components
import Nav from './Nav'

// ^ cookies
import Cookies from 'universal-cookie';
const cookies = new Cookies();


function ScreenSource() {

  // * ________________________ VARIABLES & VARIABLES D'ÉTAT ________________________
  // *
  let [sourceList, setSourceList] = useState([])
  let [language, setLanguage] = useState(!cookies.get('lang') ? 'fr' : cookies.get('lang'))

  const articleLanguageList = ["fr", "gb", "de", "es" ]


  // * ________________________ INITIALISATION DE MA PAGE ________________________
  // *
  useEffect(() => {
    /* Création de mon cookies */
    cookies.set('lang', language)
    /* webservice ==> newsapi.org */
    const loadData = async () => {
      const rawResponse = await fetch(`https://newsapi.org/v2/top-headlines/sources?apiKey=76e4c891477b4b3eaa339beeb9393d48&country=${language}`)
      const response = await rawResponse.json()
      setSourceList(response.sources)
    }
    loadData()

  }, [language])


  

  // * ________________________ FUNCTIONS ________________________
  // *
  /* Pour changer la langue des articles au clique */
  const changeLanguage = async (lang) => {
    if (lang === "fr")  setLanguage("fr")
    if (lang === "gb")  setLanguage("gb")
    if (lang === "de")  setLanguage("de")
    if (lang === "es")  setLanguage("es")
    return language
  }


  // * ________________________ AFFICHAGE / ÉLÉMENTS DE LA PAGE _______________________
  // *
  /* Affichage des différents drapeau dans le banner */
  const flags = articleLanguageList.map((element, index) => {
    return  <img key={index} alt="langue" src={`../images/language-flags/${element}-flag.png`} style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "15px", cursor: 'pointer'}} onClick={() => changeLanguage(element)} />
  })


  // * ________________________ MA PAGE ________________________
  // *
  return (
    <div>

      {/* barre de navigation  */}
      <Nav />

      {/* Banner */}
      <div className="Banner" style={{ display: "flex", justifyContent: "center", padding: "25px", alignItems: "center" }}>
        {/* Drapeau  */}
        {flags}
      </div>

      {/* List de toutes les soures se lon la langue */}
      <div className="HomeThemes">
        <List
          itemLayout="horizontal"
          dataSource={sourceList}
          renderItem={item => (

            
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={`//logo.clearbit.com/${item.url}` } /> }
                title={<Link to={`/ScreenArticlesBySource/${item.id}`} >{item.name}</Link>}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </div>

    </div>
  );
}


// * ________________________ EXPORT DE MA PAGE ________________________
// *
export default ScreenSource;
