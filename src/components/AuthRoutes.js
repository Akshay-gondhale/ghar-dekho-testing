import { useSelector } from "react-redux"
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import GlobalLoader from "./GlobalLoader/GlobalLoader";

const AuthRoutes = ({ path, component: Component, ...rest }) => {
    const authData = useSelector(state => state.AuthReducer.isLoggedIn)

    return (
        <Route
            path={path}
            {...rest}
            render={(props) => {
                if (authData === true) {
                    return (
                        <Redirect
                            to={{
                                pathname: "/",
                            }}
                        />
                    );

                }
                else if(authData === null){
                    return <GlobalLoader />

                }
                else{
                    return <Component {...props} />;
                }
            }}
        />
    )
}

export default AuthRoutes;
