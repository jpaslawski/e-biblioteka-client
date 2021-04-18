import React from 'react';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from './components/Home/Home';
import Books from './components/Books/Books';
import Reservations from './components/Reservations/Reservations';
import Profile from './components/Profile/Profile';
import SignIn from './components/SignForms/SignIn';
import SignUp from './components/SignForms/SignUp';
import BookDetails from './components/Books/BookDetails';

function App() {

  const token = sessionStorage.getItem("token");

  return (
    <div className="App">
      <Router>
        <Navbar 
          token={token} />
        <Switch>
          <Route exact path="/books/:bookId" component={BookDetails} />
          <Route path={["/books?category:category", "/books"]} component={Books} />
          <Route path="/reservations" component={Reservations} />
          <Route path="/sign-in" component={SignIn} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/profile" component={Profile} />
          <Route path={["", "/home"]} component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
