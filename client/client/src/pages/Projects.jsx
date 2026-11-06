
import { useEffect, useState } from "react";
import api from "../services/api";
import "../projects.css";

const Projects = () => {
    // PROJECT STATES
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // PROJECT MEMBER STATES
    const [selectedProject, setSelectedProject] = useState(null);
    const [members, setMembers] = useState([]);
    const [membersLoading, setMembersLoading] = useState(false);
    const [memberError, setMemberError] = useState("");
    const [memberSuccess, setMemberSuccess] = useState("");

    const [memberEmail, setMemberEmail] = useState("");
    const [addingMember, setAddingMember] = useState(false);
    const [removingMemberId, setRemovingMemberId] = useState(null);

    // FETCH PROJECTS
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

    // CREATE PROJECT
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

    // EDIT PROJECT
    const handleEditProject = (project) => {
        setEditingId(project.id);
        setName(project.name);
        setDescription(project.description || "");

        setError("");
        setSuccess("");
    };

    // UPDATE PROJECT
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

    // CANCEL EDITING
    const handleCancelEdit = () => {
        setEditingId(null);
        setName("");
        setDescription("");
        setError("");
    };

    // DELETE PROJECT
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

    // FETCH PROJECT MEMBERS
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

    // ADD PROJECT MEMBER
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

    // REMOVE PROJECT MEMBER
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

    // CLOSE MEMBERS SECTION
    const handleCloseMembers = () => {
        setSelectedProject(null);
        setMembers([]);
        setMemberEmail("");
        setMemberError("");
        setMemberSuccess("");
    };

    // LOADING STATE
    if (loading) {
        return (
            <div className="projects-page">
                <div className="projects-loading">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Loading your projects...</p>
                </div>
            </div>
        );
    }

    // MAIN UI
    return (
        <div className="projects-page">
            <div className="projects-container">

                {/* PAGE HEADER */}
                <div className="projects-page-header">
                    <div>
                        <span className="projects-eyebrow">WORKSPACE</span>
                        <h1>My Projects</h1>
                        <p>Manage your projects and collaborate with your team.</p>
                    </div>

                    <div className="projects-total">
                        <span className="projects-total-number">
                            {projects.length}
                        </span>
                        <span className="projects-total-label">
                            {projects.length === 1 ? "Project" : "Projects"}
                        </span>
                    </div>
                </div>

                {/* GLOBAL MESSAGES */}
                {success && (
                    <div className="alert alert-success projects-alert">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger projects-alert">
                        {error}
                    </div>
                )}

                {/* CREATE / UPDATE PROJECT */}
                <div className="project-form-card">
                    <div className="project-form-heading">
                        <div className="project-form-icon">
                            {editingId ? "✎" : "+"}
                        </div>

                        <div>
                            <h5>
                                {editingId ? "Update project" : "Create a new project"}
                            </h5>
                            <p>
                                {editingId
                                    ? "Make changes to your existing project."
                                    : "Give your project a name and a short description."
                                }
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={
                            editingId
                                ? handleUpdateProject
                                : handleCreateProject
                        }
                    >
                        <div className="row g-3">
                            <div className="col-lg-5">
                                <label htmlFor="projectName" className="project-label">
                                    Project name
                                </label>

                                <input
                                    id="projectName"
                                    type="text"
                                    className="form-control project-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Website redesign"
                                    required
                                />
                            </div>

                            <div className="col-lg-7">
                                <label htmlFor="projectDescription" className="project-label">
                                    Description
                                </label>

                                <input
                                    id="projectDescription"
                                    type="text"
                                    className="form-control project-input"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What is this project about?"
                                />
                            </div>
                        </div>

                        <div className="project-form-actions">
                            <button
                                type="submit"
                                className="btn project-primary-btn"
                                disabled={creating}
                            >
                                {creating
                                    ? "Please wait..."
                                    : editingId
                                        ? "Save changes"
                                        : "+ Create project"
                                }
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="btn project-cancel-btn"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* PROJECT LIST HEADER */}
                <div className="project-list-heading">
                    <div>
                        <h4>Your workspace</h4>
                        <p>All the projects you have created.</p>
                    </div>
                </div>

                {/* PROJECT LIST */}
                {projects.length === 0 ? (
                    <div className="projects-empty-state">
                        <div className="empty-state-icon">▤</div>
                        <h5>No projects yet</h5>
                        <p>Create your first project to get started.</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {projects.map((project) => (
                            <div className="col-md-6 col-xl-4" key={project.id}>
                                <div className="project-card">

                                    <div className="project-card-top">
                                        <div className="project-card-icon">
                                            {project.name?.charAt(0)?.toUpperCase() || "P"}
                                        </div>

                                        <span className="project-status">
                                            {project.status || "Active"}
                                        </span>
                                    </div>

                                    <div className="project-card-content">
                                        <h5>{project.name}</h5>

                                        <p>
                                            {project.description ||
                                                "No description has been added to this project."}
                                        </p>
                                    </div>

                                    <div className="project-card-divider"></div>

                                    <div className="project-card-actions">
                                        <button
                                            type="button"
                                            className="btn project-view-btn"
                                            onClick={() => fetchMembers(project)}
                                        >
                                            View members
                                        </button>

                                        <div className="project-secondary-actions">
                                            <button
                                                type="button"
                                                className="btn project-icon-btn"
                                                title="Edit project"
                                                aria-label="Edit project"
                                                onClick={() => handleEditProject(project)}
                                            >
                                                ✎
                                            </button>

                                            <button
                                                type="button"
                                                className="btn project-icon-btn project-delete-btn"
                                                title="Delete project"
                                                aria-label="Delete project"
                                                onClick={() => handleDeleteProject(project.id)}
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* PROJECT MEMBERS PANEL */}
                {selectedProject && (
                    <div className="members-panel" id="project-members">

                        <div className="members-panel-header">
                            <div>
                                <span className="projects-eyebrow">TEAM MANAGEMENT</span>
                                <h4>{selectedProject.name}</h4>
                                <p>Manage the people working on this project.</p>
                            </div>

                            <button
                                type="button"
                                className="btn members-close-btn"
                                onClick={handleCloseMembers}
                            >
                                ✕ <span>Close</span>
                            </button>
                        </div>

                        {memberSuccess && (
                            <div className="alert alert-success projects-alert">
                                {memberSuccess}
                            </div>
                        )}

                        {memberError && (
                            <div className="alert alert-danger projects-alert">
                                {memberError}
                            </div>
                        )}

                        {/* ADD MEMBER */}
                        <div className="add-member-section">
                            <div>
                                <h6>Add a team member</h6>
                                <p>Enter the email address of an existing TaskFlow user.</p>
                            </div>

                            <form onSubmit={handleAddMember}>
                                <div className="input-group">
                                    <input
                                        type="email"
                                        className="form-control project-input"
                                        placeholder="Enter registered user's email"
                                        value={memberEmail}
                                        onChange={(e) => setMemberEmail(e.target.value)}
                                        required
                                    />

                                    <button
                                        type="submit"
                                        className="btn project-primary-btn"
                                        disabled={addingMember || membersLoading}
                                    >
                                        {addingMember ? "Adding..." : "+ Add member"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* MEMBERS LIST */}
                        <div className="members-list-section">
                            <div className="members-list-heading">
                                <div>
                                    <h6>Project members</h6>
                                    <p>
                                        {members.length} {members.length === 1 ? "member" : "members"} in this project
                                    </p>
                                </div>
                            </div>

                            {membersLoading ? (
                                <div className="members-loading">
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <span>Loading members...</span>
                                </div>
                            ) : members.length === 0 ? (
                                <div className="members-empty-state">
                                    <p>No members have been added to this project yet.</p>
                                    <span>Add someone using the form above.</span>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table members-table align-middle">
                                        <thead>
                                            <tr>
                                                <th>Member</th>
                                                <th>Email address</th>
                                                <th>Role</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {members.map((member) => (
                                                <tr key={member.id}>
                                                    <td>
                                                        <div className="member-name-cell">
                                                            <div className="member-avatar">
                                                                {member.User?.name?.charAt(0)?.toUpperCase() || "U"}
                                                            </div>
                                                            <span>{member.User?.name || "N/A"}</span>
                                                        </div>
                                                    </td>

                                                    <td>{member.User?.email || "N/A"}</td>

                                                    <td>
                                                        <span className="member-role">
                                                            {member.role}
                                                        </span>
                                                    </td>

                                                    <td className="text-end">
                                                        <button
                                                            type="button"
                                                            className="btn member-remove-btn"
                                                            disabled={removingMemberId === member.userId}
                                                            onClick={() => handleRemoveMember(member.userId)}
                                                        >
                                                            {removingMemberId === member.userId
                                                                ? "Removing..."
                                                                : "Remove"
                                                            }
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
        </div>
    );
};

export default Projects;
