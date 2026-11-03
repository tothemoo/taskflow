import React from 'react'
import { useEffect, useState } from "react";
import api from "../services/api"

const Projects = () => {

    const [projects, setProjects]=useState([]);
    const [loading, setLoading]=useState(true);
    const [error, setError]=useState("")

    const [name, setName]=useState("");
    const [description, setDescription] = useState("")
    const [success, setSuccess]=useState("")
    const[creating, setCreating]=useState(false)

    const [editingId, setEditingId] = useState(null)

    const fetchProjects = async()=>{
            try{
                const response = await api.get("/projects")

                setProjects(response.data.projects)
            }
            catch(error){
                setError(
                    error.response?.data?.message || "Unable to fetch details"
                )
            }
            finally{
                setLoading(false)
            }
        }

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async(e)=>{
        e.preventDefault();

        setError("");
        setSuccess("");

        if(!name.trim()){
            setError("Project name is required");
            return;
        }

        try{
            setCreating(true);

            const response =await api.post("/projects",{
                name, description
            })

            setSuccess(response.data.message)

            setName("");
            setDescription("");

            await fetchProjects();
        }
        catch(error){
            setError(
                error.response?.data?.message || "Unable to create Project"
            )
        }
        finally{
            setCreating(false)
        }
    }

    const handleEditProject = (project)=>{
        setEditingId(project.id);
        setName(project.name);
        setDescription(project.description || "");

        setError("");
        setSuccess("");
    }

    const handleUpdateProject = async(event)=>{
        event.preventDefault();

        setError("");
        setSuccess("");

        if(!name.trim()){
            setError("Project name is required");
            return;
        }

        try{
            setCreating(true);

            const response = await api.put(`/projects/${editingId}`,{
                name, description
            })

            setSuccess(response.data.message);
            setEditingId(null);
            setName("");
            setDescription("")

            await fetchProjects();
        }

        catch(error){
            setError(
                error.response?.data?.message || "Unable to update project"
            )
        }

        finally{
            setCreating(false);
        }
    }

    const handleDeleteProject = async(id)=>{
        const confirmDelete = window.confirm("Are you sure you want to delete this project?")

        if(!confirmDelete){
            return;
        }

        try{
            setError("");
            setSuccess("");
            
            const response = await api.delete(`/projects/${id}`);

            setSuccess(response.data.message);

            await fetchProjects();
        }

        catch(error){
            setError(error.response?.data?.message || "Unable to delete project")
        }
    }

    if(loading){
        return(
            <div className='container mt-4'>
                <p>Loading Projects...</p>
            </div>
        )
    }

    if(error){
        return(
            <div className='container mt-4'>
                <div className='alert alert-danger'>
                    {error}
                </div>
            </div>
        )
    }

  
return (
    <div className="container py-4">

        <h2 className="mb-4">My Projects</h2>

        {success && (
            <div className="alert alert-success">
                {success}
            </div>
        )}

        <div className='carb mb-4'>
            <div className='card-header'>
                <h5 className='mb-0'>Create New Project</h5>
            </div>

            <div className='card-body'>
                <form onSubmit={editingId?handleUpdateProject:handleCreateProject}>
                    <div className='mb-3'>
                        <label className='form-label'>
                            Project Name
                        </label>
                        <input type='text' className='form-control' value={name} onChange={(e)=>setName(e.target.value)} placeholder='Enter project name'/>
                    </div>

                    <div className='mb-3'>
                        <label className='form-label'>
                            Description
                        </label>
                        <textarea type='text' className='form-control' value={description} onChange={(e)=>setDescription(e.target.value)} placeholder='Enter project description'/>
                    </div>

                    <button type='submit' className='btn btn-primary' disabled={creating}>{creating?"Please wait...":editingId?"Create Project":"Create Project"}</button>
                    {editingId && (
                        <button type="button" className="btn btn-secondary ms-2" onClick={()=>{
                            setEditingId(null);
                            setName("");
                            setDescription("");
                            setError("")
                        }}></button>
                    )}
                </form>
            </div>
            </div>        

        {projects.length === 0 ? (

            <div className="alert alert-info">
                No projects found. Create your first project!
            </div>

        ) : (

            <div className="row">

                {projects.map((project) => (

                    <div
                        className="col-md-4 mb-3"
                        key={project.id}
                    >
                        <div className="card h-100">

                            <div className="card-body">

                                <h5 className="card-title">
                                    {project.name}
                                </h5>

                                <p className="card-text">
                                    {project.description}
                                </p>

                                <span className="badge bg-primary">
                                    {project.status}
                                </span>

                                <div className="mt-3">

                                <button
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => handleEditProject(project)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDeleteProject(project.id)}
                                >
                                    Delete
                                </button>

                            </div>

                            </div>

                        </div>
                    </div>

                ))}

            </div>

        )}

    </div>
);

}

export default Projects