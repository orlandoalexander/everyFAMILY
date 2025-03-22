import React, { useState } from "react";
import SignIn from "./SignIn.jsx";
import SignUp from "./SignUp.jsx";

const Login = () => {
    const [isLoginView, setIsLoginView] = useState(true);

    const toggleView = () => {
        setIsLoginView(!isLoginView);
    };

    return isLoginView ? (
        <SignIn onSwitchToSignUp={toggleView} />
    ) : (
        <SignUp onBackToLogin={toggleView} />
    );
};

export default Login;