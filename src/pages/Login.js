import React, { useState } from "react"; //manage email and password state
import {useAuth} from '../auth/AuthContext'; //call login function from auth context

function Login() {
    //email and password belong to this page only. AuthContext should not manage them
    const [email, setEmail] = useState(""); // state for email input
    const [password, setPassword] = useState(""); // state for password input

    const {login} = useAuth(); // get login function from auth context

    const handleSubmit = (e) => { // handle form submission
        e.preventDefault(); // prevent default form submission behavior

        const fakeUser = { // in real app, get this data from API response
            id: 1,
            email: email, 
            name: "Klaus Mikaelson",
        };
        login(fakeUser); // call login function from auth context with user data
        //Backend accepted credentials and returned user data
    };
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}  // update email state on input change
                    />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // update password state on input change
                    />
            </div>
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;

