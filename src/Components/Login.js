import React from 'react'

const Login = ({handleLogin, username, setUsername, password, setPassword}) => {
    return(
        <React.Fragment>
        <h3>Login</h3>
        <form onSubmit={handleLogin}>
        <div className='container'>
          <div>
            Username <br></br> <input className='textField' value={username} onChange={({target}) => setUsername(target.value)}/>
          </div>
          <div>
            Password <br></br> <input className='textField' value={password} type="password" onChange={({target}) => setPassword(target.value)}/>
          </div>
          <div>
            <button className='button' type="submit">Login</button>
          </div>
        </div>
        </form>
        </React.Fragment>
      )
    }

    export default Login