import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthRoutes = ({ path, component: Component, ...rest }) => {
    const authData = useSelector(state => state.AuthReducer.isLoggedIn)

    return (
        <Route
            path={path}
            {...rest}
            render={(props) => {
                if (authData) {
                    return (
                        <Redirect
                            to={{
                                pathname: "/",
                            }}
                        />
                    );

                }
                return <Component {...props} />;
            }}
        />
    )
}

export default AuthRoutes;
