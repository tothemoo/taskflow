import {BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter, useNavigate} from 'react-router-dom'
import {useAuth} from './context/AuthContext'
import AuthProvider from './context/AuthContext'


import {useState,useEffect} from 'react'
import api from './services/api'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'


function Dashboard() {

  const[profile,setProfile]=useState(null);
  const[error,setError]=useState(null);
  const navigate = useNavigate();
  const {user,logout}=useAuth();

  const handleLogout=()=>{
    logout();
    navigate("/Login",{replace:true})
  }

  useEffect(()=>{
    const fetchProfile = async()=>{
      try{
        const res = await api.get('/profile')
        setProfile(res.data.user)
        console.log("Profile data:", profile);
      }
      catch(err){
        setError(err.response?.data?.message || "An error occurred while fetching the profile.")
      }
    };fetchProfile();
  },[])

    if (error) {
        return <div className="container py-5">
            <div className="alert alert-danger">{error}</div>
        </div>;
    }

    if (!profile) {
        return <div className="container py-5">
            Loading profile...
        </div>;
    }

  
    return (
        <div className="container py-5">
            <h1>Welcome to TaskFlow!</h1>
            <p>You have reached the dashboard page.</p>

            <p><strong>User ID:</strong> {profile.id}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> {profile.role}</p>

            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
    );
}

function App() {
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/Login" replace />} />
          <Route path="/Login" element={<Login/>} />
          <Route path='/Register' element={<Register/>}/>
          <Route element={<ProtectedRoute/>}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>         
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
