import React from 'react'
import { useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

const Register = () => {
    const[name, setName]=useState("");
    const[email,setEmail]=useState("");
    const[password, setPassword]=useState("");
    const[confirmPassword, setConfirmPassword]=useState("");

    const [error, setError]=useState("");
    const[success, setSuccess]=useState("");
    const[loading, setLoading]=useState(false);

    const handleRegister = async(e)=>{
        e.preventDefault();

        setError("");
        setSuccess("");

        if(!name || !email || !password || !confirmPassword){
            setError("Please fill in all fields")
            return;
        }

        if (password.length<6){
            setError("Password must contain at least 6 characters");
            return;
        }

        if (password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }

        try{
            setLoading (true);

            const res= await api.post('/users',{
                name, email, password
            })

            setSuccess(res.data.message)

            setName("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")

        }

        catch(error){
            setError(error.response?.data?.message || "Registration failed. Please try again")
        }

        finally{
            setLoading(false)
        }
    }

  return (
    <div className='container d-flex justify-content-center align-items-center min-vh-100'>
        <div className='card shadow p-4' style={{width:"450px"}}>
            <h2 className='text-center mb-4'>
                Create Your TaskFlow Account
            </h2>

            {error &&(
                <div className='alert alert-danger'>
                    {error}
                </div>
            )}

            {success &&(
                <div className='alert alert-success'>
                    {success}
                </div>
            )}

            <form onSubmit={handleRegister}>
                <div className='mb-3'>
                    <label className='form-label'>Full Name</label>
                    <input type="text" className='form-control' placeholder='Enter your name' value ={name} onChange={(e)=>setName(e.target.value)}/>
                </div>

                <div className='mb-3'>
                    <label className='form-label'>Email Address</label>
                    <input type='email' className='form-control' placeholder='Enter your email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                </div>

                <div className='mb-3'>
                    <label className='form-label'>Password</label>
                    <input type='password' className='form-control' placeholder='Enter your password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                </div>

                <div className='mb-3'>
                    <label className='form-label'>Confirm Password</label>
                    <input type='password' className='form-control' placeholder='Enter your password again' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                </div>

                <button type='submit' className='btn btn-primary w-100' disabled={loading}>
                    {loading ? "Creating Account...":Register}
                </button>

                <p className='text-center mt-3'>
                    Already have an account?{" "} <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    </div>
  )
}

export default Register