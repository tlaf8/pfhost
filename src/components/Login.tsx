import React, {useState} from "react";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && password) {
            console.log("Username:", username);
            console.log("Password:", password);
            setError("");
        } else {
            setError("username or password is incorrect.");
        }
    };

    return (<div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "70px",
            fontFamily: "Courier New, monospace",
        }}>
            <div>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{marginBottom: "10px"}}>
                        <label htmlFor="username">username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: "100%", padding: "8px", marginTop: "4px"
                            }}/>
                    </div>

                    <div style={{marginBottom: "10px"}}>
                        <label htmlFor="password">password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: "100%", padding: "8px", marginTop: "4px"
                            }}/>
                    </div>

                    {error && <p style={{color: "red", fontSize: "14px"}}>{error}</p>}

                    <button type="submit" style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px"
                    }}>
                        Login
                    </button>
                </form>
            </div>
        </div>);
};

export default LoginPage;
