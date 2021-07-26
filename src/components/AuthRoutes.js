import { useSelector } from "react-redux"
import React from 'react';
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
