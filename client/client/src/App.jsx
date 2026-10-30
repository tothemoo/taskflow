import {BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter, useNavigate} from 'react-router-dom'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'



import {useState,useEffect} from 'react'
import api from './services/api'


function Dashboard() {

  const[profile,setProfile]=useState(null);
  const[error,setError]=useState(null);
  const navigate = useNavigate();

  const handleLogout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
      <Routes>
        <Route path="/" element={<Navigate to="/Login" replace />} />
        <Route path="/Login" element={<Login/>} />
        <Route element={<ProtectedRoute/>}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
