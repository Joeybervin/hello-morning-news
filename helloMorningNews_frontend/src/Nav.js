import React from 'react';
import './App.css';
//^ module router
import { Link } from "react-router-dom";
//^ module Antd Design
import { Menu, Icon, Badge } from 'antd'
//^ Redux 
import { connect } from 'react-redux';


function Nav(props) {
// * ________________________ MA PAGE ________________________
  return (
    <nav >
      <Menu style={{ textAlign: 'center' }} mode="horizontal" theme="dark">

        <Menu.Item >
          <Link to="/screensource"><Icon type="home" />Sources</Link>
        </Menu.Item>


        <Menu.Item >
          
            <Link to="/screenMyarticles"><Icon type="read" />
            <Badge style={{right: "-25px"}} size="small" count={props.article[0].length} showZero >
            My Articles
            </Badge>
            </Link>
          
        </Menu.Item>
     

        {/* User */}
        <Menu.Item style={{ position: 'absolute', right: '80px' }}  >
          {props.user.username !== undefined ? <Link to="#"><Icon type="user"/>{props.user.username}</Link> : ''}
        </Menu.Item>

        {/* Log out */}
        <Menu.Item style={{ position: 'absolute', right: '0' }} >

          <Link to="/"><Icon type="poweroff" /></Link>
        </Menu.Item>

      </Menu>
    </nav>
  );
}

// * ________________________ REDUX ________________________
function mapStateToProps(state) {
  return { user: state.user, article: state.article }
}
// * ________________________ EXPORT ________________________
export default connect(
  mapStateToProps,
  null
)(Nav);