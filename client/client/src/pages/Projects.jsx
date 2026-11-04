
import { useEffect, useState } from "react";
import api from "../services/api";

const Projects = () => {

    // ==============================
    // PROJECT STATES
    // ==============================

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState(null);


    // ==============================
    // PROJECT MEMBER STATES
    // ==============================

    const [selectedProject, setSelectedProject] = useState(null);
    const [members, setMembers] = useState([]);
    const [membersLoading, setMembersLoading] = useState(false);
    const [memberError, setMemberError] = useState("");
    const [memberSuccess, setMemberSuccess] = useState("");

    const [memberEmail, setMemberEmail] = useState("");
    const [addingMember, setAddingMember] = useState(false);
    const [removingMemberId, setRemovingMemberId] = useState(null);


    // ==============================
    // FETCH PROJECTS
    // ==============================

    const fetchProjects = async () => {
        try {
            const response = await api.get("/projects");

            setProjects(response.data.projects || []);
            setError("");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to fetch projects."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);


    // ==============================
    // CREATE PROJECT
    // ==============================

    const handleCreateProject = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError("Project name is required.");
            return;
        }

        try {
            setCreating(true);

            const response = await api.post("/projects", {
                name: name.trim(),
                description
            });

            setSuccess(
                response.data.message || "Project created successfully."
            );

            setName("");
            setDescription("");

            await fetchProjects();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to create project."
            );
        } finally {
            setCreating(false);
        }
    };


    // ==============================
    // EDIT PROJECT
    // ==============================

    const handleEditProject = (project) => {
        setEditingId(project.id);
        setName(project.name);
        setDescription(project.description || "");

        setError("");
        setSuccess("");
    };


    // ==============================
    // UPDATE PROJECT
    // ==============================

    const handleUpdateProject = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError("Project name is required.");
            return;
        }

        try {
            setCreating(true);

            const response = await api.put(`/projects/${editingId}`, {
                name: name.trim(),
                description
            });

            setSuccess(
                response.data.message || "Project updated successfully."
            );

            setEditingId(null);
            setName("");
            setDescription("");

            await fetchProjects();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to update project."
            );
        } finally {
            setCreating(false);
        }
    };


    // ==============================
    // CANCEL EDITING
    // ==============================

    const handleCancelEdit = () => {
        setEditingId(null);
        setName("");
        setDescription("");
        setError("");
    };


    // ==============================
    // DELETE PROJECT
    // ==============================

    const handleDeleteProject = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmDelete) return;

        try {
            setError("");
            setSuccess("");

            const response = await api.delete(`/projects/${id}`);

            setSuccess(
                response.data.message || "Project deleted successfully."
            );

            if (selectedProject?.id === id) {
                handleCloseMembers();
            }

            await fetchProjects();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to delete project."
            );
        }
    };


    // ==============================
    // FETCH PROJECT MEMBERS
    // ==============================

    const fetchMembers = async (project) => {

        try {
            setMembersLoading(true);
            setMemberError("");
            setMemberSuccess("");

            setSelectedProject(project);
            setMembers([]);

            const response = await api.get(
                `/projects/${project.id}/members`
            );

            setMembers(response.data.members || []);

        } catch (error) {
            setMemberError(
                error.response?.data?.message ||
                "Unable to fetch project members."
            );
        } finally {
            setMembersLoading(false);
        }
    };


    // ==============================
    // ADD PROJECT MEMBER
    // ==============================

    const handleAddMember = async (e) => {
        e.preventDefault();

        setMemberError("");
        setMemberSuccess("");

        if (!memberEmail.trim()) {
            setMemberError("Please enter an email address.");
            return;
        }

        try {
            setAddingMember(true);

            const response = await api.post(
                `/projects/${selectedProject.id}/members`,
                {
                    email: memberEmail.trim()
                }
            );

            setMemberSuccess(
                response.data.message || "Member added successfully."
            );

            setMemberEmail("");

            // Refresh the members list
            const membersResponse = await api.get(
                `/projects/${selectedProject.id}/members`
            );

            setMembers(membersResponse.data.members || []);

        } catch (error) {
            setMemberError(
                error.response?.data?.message ||
                "Unable to add project member."
            );
        } finally {
            setAddingMember(false);
        }
    };


    // ==============================
    // REMOVE PROJECT MEMBER
    // ==============================

    const handleRemoveMember = async (userId) => {

        const confirmRemove = window.confirm(
            "Are you sure you want to remove this member?"
        );

        if (!confirmRemove) return;

        try {
            setMemberError("");
            setMemberSuccess("");

            setRemovingMemberId(userId);

            const response = await api.delete(
                `/projects/${selectedProject.id}/members/${userId}`
            );

            setMemberSuccess(
                response.data.message || "Member removed successfully."
            );

            // Refresh the members list
            const membersResponse = await api.get(
                `/projects/${selectedProject.id}/members`
            );

            setMembers(membersResponse.data.members || []);

        } catch (error) {
            setMemberError(
                error.response?.data?.message ||
                "Unable to remove project member."
            );
        } finally {
            setRemovingMemberId(null);
        }
    };


    // ==============================
    // CLOSE MEMBERS SECTION
    // ==============================

    const handleCloseMembers = () => {
        setSelectedProject(null);
        setMembers([]);
        setMemberEmail("");
        setMemberError("");
        setMemberSuccess("");
    };


    // ==============================
    // LOADING STATE
    // ==============================

    if (loading) {
        return (
            <div className="container mt-4">
                <p>Loading projects...</p>
            </div>
        );
    }


    // ==============================
    // MAIN UI
    // ==============================

    return (

        <div className="container py-4">

            <h2 className="mb-4">My Projects</h2>


            {/* PROJECT SUCCESS MESSAGE */}

            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}


            {/* PROJECT ERROR MESSAGE */}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}


            {/* PROJECT FORM */}

            <div className="card mb-4">

                <div className="card-header">
                    <h5 className="mb-0">
                        {editingId ? "Update Project" : "Create New Project"}
                    </h5>
                </div>

                <div className="card-body">

                    <form
                        onSubmit={
                            editingId
                                ? handleUpdateProject
                                : handleCreateProject
                        }
                    >

                        <div className="mb-3">

                            <label className="form-label">
                                Project Name
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter project name"
                            />

                        </div>


                        <div className="mb-3">

                            <label className="form-label">
                                Description
                            </label>

                            <textarea
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter project description"
                                rows="3"
                            />

                        </div>


                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={creating}
                        >
                            {creating
                                ? "Please wait..."
                                : editingId
                                    ? "Update Project"
                                    : "Create Project"}
                        </button>


                        {editingId && (
                            <button
                                type="button"
                                className="btn btn-secondary ms-2"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </button>
                        )}

                    </form>

                </div>

            </div>


            {/* PROJECT LIST */}

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


                                    {/* PROJECT ACTIONS */}

                                    <div className="mt-3">

                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => handleEditProject(project)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-sm btn-danger me-2"
                                            onClick={() => handleDeleteProject(project.id)}
                                        >
                                            Delete
                                        </button>

                                        <button
                                            className="btn btn-sm btn-info text-white"
                                            onClick={() => fetchMembers(project)}
                                        >
                                            View Members
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}


            {/* PROJECT MEMBERS SECTION */}

            {selectedProject && (

                <div className="card mt-4">

                    <div className="card-header d-flex justify-content-between align-items-center">

                        <h5 className="mb-0">
                            Members - {selectedProject.name}
                        </h5>

                        <button
                            className="btn btn-sm btn-secondary"
                            onClick={handleCloseMembers}
                        >
                            Close
                        </button>

                    </div>


                    <div className="card-body">


                        {/* MEMBER SUCCESS MESSAGE */}

                        {memberSuccess && (
                            <div className="alert alert-success">
                                {memberSuccess}
                            </div>
                        )}


                        {/* MEMBER ERROR MESSAGE */}

                        {memberError && (
                            <div className="alert alert-danger">
                                {memberError}
                            </div>
                        )}


                        {/* ADD MEMBER FORM */}

                        <form
                            onSubmit={handleAddMember}
                            className="mb-4"
                        >

                            <label className="form-label">
                                Add Member by Email
                            </label>

                            <div className="input-group">

                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter registered user's email"
                                    value={memberEmail}
                                    onChange={(e) => setMemberEmail(e.target.value)}
                                />

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={addingMember || membersLoading}
                                >
                                    {addingMember ? "Adding..." : "Add Member"}
                                </button>

                            </div>

                        </form>


                        {/* MEMBERS LIST */}

                        <h6 className="mb-3">
                            Current Members
                        </h6>


                        {membersLoading ? (

                            <p>Loading members...</p>

                        ) : members.length === 0 ? (

                            <div className="alert alert-info">
                                No members have been added to this project yet.
                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="table table-bordered table-hover">

                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>


                                    <tbody>

                                        {members.map((member) => (

                                            <tr key={member.id}>

                                                <td>
                                                    {member.User?.name || "N/A"}
                                                </td>

                                                <td>
                                                    {member.User?.email || "N/A"}
                                                </td>

                                                <td>
                                                    <span className="badge bg-primary">
                                                        {member.role}
                                                    </span>
                                                </td>

                                                <td>

                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        disabled={removingMemberId === member.userId}
                                                        onClick={() => handleRemoveMember(member.userId)}
                                                    >
                                                        {removingMemberId === member.userId
                                                            ? "Removing..."
                                                            : "Remove"}
                                                    </button>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>

    );

};

export default Projects;
