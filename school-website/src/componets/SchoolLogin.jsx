import React from "react"


function SchoolLogin() {
    return (
        <div className="SchoolLogin">
            <h1>Login and Signup Page</h1>
            <p>This is where users can log in or Signup</p>
            <form>
            <label for="username">username</label>
            <input type="username" placeholder=" " id="username" name="username" minLength={4} maxLength={15} required />
            <label for="password">password</label>
            <input type="password" placeholder=" " id="password" name="password" minLength={8} maxLength={15} required />
            <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default SchoolLogin;