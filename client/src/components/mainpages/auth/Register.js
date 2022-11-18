import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
    const [user, setUser] = useState({
        name:"",
        email:"",
        password:""
    })

    const onChangeInput = (e) =>{
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]:value
        })
    }

    const registerSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/user/register', {...user})
            window.location.href = "/"
        } catch (error) {
            alert(error.response.data.message)
            console.log(error.response);
        }
    }

    return ( 
        <div className='login-page'>
            <form onSubmit={registerSubmit}>
                <h2>Register</h2>
                <input type='text' name='name' placeholder='Name' value={user.name} required onChange={onChangeInput} />
                <input type='email' name='email' placeholder='E-mail' value={user.email} required onChange={onChangeInput} />
                <input type='password' name='password' placeholder='Password' value={user.password} required onChange={onChangeInput} />
                <div className='row'>
                    <button type='submit'>Register</button>
                    <Link to='/login'>Login</Link>
                </div>
            </form>
        </div>
    )
}

export default Register