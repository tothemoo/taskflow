import React from 'react'
import {useState} from 'react'
import api from '../services/api'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'
import { Link } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate();
  const [email,setEmail]=useState('')
  const [password, setPassword]=useState('')
  const [error, setError]=useState('')
  const [loading,setLoading]=useState(false)

  const {login} = useAuth();

  const handleSubmit= async(e)=>{
    e.preventDefault()

    setError('')
    setLoading(true);

    try{
      const response = await api.post("/auth/login",
        {
          email,password
        }
      );
      const {token, user}=response.data;
      login(token,user)

      navigate("/dashboard");
    }

    catch(error){
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      )
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-sm border-0 p-4 w-100" style={{maxWidth: '400px'}}>
        <div className="card-body">
          <h2 className="text-center mb-2">TaskFlow</h2>
          <p className="text-secondary text-ccenter mb-4">Sign in to manage your projects</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input id="email" type="email" className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input id="password" type="password" className="form-control" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
            </div>

            {error && (
              <div className = "alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <p className='text-center mt-3'>
              Dont have an account?{" "} <Link to="/register">Register here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login