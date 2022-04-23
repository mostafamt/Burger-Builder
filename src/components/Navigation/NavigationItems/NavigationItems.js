import React, { Component } from "react";

import classes from "./NavigationItems.css";
import NavigationItem from "./NavigationItem/NavigationItem";

class NavigationItems extends Component {
  onSignupHandler = () => {};

  render() {
    return (
      <ul className={classes.NavigationItems}>
        <NavigationItem link="/" exact>
          Burger Builder
        </NavigationItem>
        {this.props.isAuth ? (
          <NavigationItem link="/orders">Orders</NavigationItem>
        ) : null}
        {this.props.isAuth ? (
          <NavigationItem link="/logout">Logout</NavigationItem>
        ) : (
          <NavigationItem link="/auth">Signup</NavigationItem>
        )}
      </ul>
    );
  }
}

export default NavigationItems;
