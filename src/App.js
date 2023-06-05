import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth-service";

import Login from "./components/login-component";
import Register from "./components/register-component";
import Home from "./components/home-component";
import Profile from "./components/profile-component";
import BoardTeamLeader from "./components/board-teamleader-component";
import StandingsComponent from "./components/standings-component";
import TournamentManagement from "./components/tournament-management-component";
import TeamManagement from "./components/team-management-component";
import MatchManagement from "./components/match-management-component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      showManagementBoard:false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
        showManagementBoard:user.roles.includes("TAKIM_SORUMLUSU") || user.roles.includes("NORMAL") || user.roles.includes("SISTEM_YONETICISI")
      });
    }
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard , showManagementBoard} = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Tournament App
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>
            {showManagementBoard && (
              <li className="nav-item">
                <Link to={"/management"} className="nav-link">
                  Turnuva Yönetimi
                </Link>
              </li>
            )}

            {showManagementBoard && (
              <li className="nav-item">
                <Link to={"/teamManagement"} className="nav-link">
                  Takım Yönetimi
                </Link>
              </li>
            )}

            {showManagementBoard && (
              <li className="nav-item">
                <Link to={"/matchManagement"} className="nav-link">
                  Karşılaşma Yönetimi
                </Link>
              </li>
            )}

          {showManagementBoard && (
              <li className="nav-item">
                <Link to={"/standings"} className="nav-link">
                  Puan Durumu
                </Link>
              </li>
            )}
            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/mod"} className="nav-link">
                  Moderator Board
                </Link>
              </li>
            )}

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Admin Board
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/standings" element={<StandingsComponent />} />
            <Route path="/management" element={<TournamentManagement />} />
            <Route path="/teamManagement" element={<TeamManagement />} />
            <Route path="/matchManagement" element={<MatchManagement />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;