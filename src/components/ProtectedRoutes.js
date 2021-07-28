import { useSelector } from "react-redux"
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoutes = ({ path, component: Component, ...rest }) => {
    const authData = useSelector(state => state.AuthReducer.isLoggedIn)
    console.log("in protectedRoutes")
    console.log(authData)
    return (
        <Route
            path={path}
            {...rest}
            render={(props) => {
                if (authData === true) {
                    return <Component {...props} />;
                }
                else if (authData === false) {

                    return (
                        <Redirect
                            to={{
                                pathname: "/login",
                            }}
                        />
                    );
                }
            }}
        />
    )
}

export default ProtectedRoutes;
