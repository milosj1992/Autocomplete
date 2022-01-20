import {useState, useCallback} from "react";
import {Home} from "../Home/Home";
import logo from '../Assets/logo.svg';

export const LoginMain = () => {
    const [checktoken, setChecktoken] = useState(false);
    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSending, setIsSending] = useState(false)
    const sendRequest = useCallback(async () => {
        if (isSending) return;
        setIsSending(true);
        const response = await fetch("/api/login", {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({"username": username, "password": password})
        });
        var truetoken = await response.json();
        if (await truetoken.token != undefined) {
            setChecktoken(true);
            setToken(truetoken.token);
            localStorage.setItem('token', truetoken.token)
        }
        setIsSending(false);
    }, [isSending, username, password])

    const updateUsername = (e) => {
        setUsername(e.target.value);
    }
    const updatePassword = (e) => {
        setPassword(e.target.value);
    }
    return (checktoken ?
        <div>
            <Home token={token}/>
        </div> :
        <div>
            <div className="Welcometab">
                <img src={logo} />
                <div className="welcome-text">
                    <div className="bold-welcome"><p>Welcome</p></div>
                    <div className="under-bold"><p>Fill in the fields to continue</p></div>
                </div>
            </div>
            <div className="user-and-pw">
                <div className="input-credit">
                    <input className="username" placeholder="Email" onChange={updateUsername} value={username || ""}/>
                    <input className="password" placeholder="Password" onChange={updatePassword} value={password || ""}/>
                <button className="login-button" disabled={isSending} onClick={() => sendRequest()}>Log in</button>
                </div>
            </div>
        </div>)
}