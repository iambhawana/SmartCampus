import { useState } from "react";
function App() {
  const [complaintId, setComplaintId] = useState("");
const [trackedComplaint, setTrackedComplaint] = useState(null);
const [trackMessage, setTrackMessage] = useState("");
const [loading, setLoading] = useState(false);
const [allComplaints, setAllComplaints] = useState([]);
const [showAdmin, setShowAdmin] = useState(false);
const [showAuth, setShowAuth] = useState(false);
const [authMode, setAuthMode] = useState("login");
const [isAdminRegister, setIsAdminRegister] = useState(false);
const [adminKey, setAdminKey] = useState("");
const [authMessage, setAuthMessage] = useState("");
const [loggedInUser, setLoggedInUser] = useState(null);
const [authName, setAuthName] = useState("");
const [authEmail, setAuthEmail] = useState("");
const [authPassword, setAuthPassword] = useState("");
const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("All");

const trackComplaint = async () => {
  if (!complaintId.trim()) {
    setTrackMessage("Please enter your Complaint ID.");
    setTrackedComplaint(null);
    return;
  }

  setLoading(true);
  setTrackMessage("");
  setTrackedComplaint(null);

  try {
    const response = await fetch(
      `https://smartcampus-backend-lt65.onrender.com/api/complaints/${complaintId.trim()}`
    );

    const data = await response.json();

    if (response.ok) {
      setTrackedComplaint(data);
    } else {
      setTrackMessage(data.message || "Complaint not found.");
    }
  } catch (error) {
    setTrackMessage("Unable to connect to server. Please try again.");
  } finally {
    setLoading(false);
  }
};
const fetchComplaints = async () => {
  try {
    const response = await fetch("https://smartcampus-backend-lt65.onrender.com/api/complaints", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});
    const data = await response.json();

    if (response.ok) {
      setAllComplaints(data);
    }
  } catch (error) {
    console.log("Error fetching complaints:", error);
  }
};
const normalize = (value) =>
  (value || "").toLowerCase().replace(/[_-]/g, " ").trim();

const term = normalize(searchTerm);

const filteredComplaints = allComplaints.filter((complaint) => {
  const matchesSearch =
    normalize(complaint.studentName).includes(term) ||
    normalize(complaint.category).includes(term) ||
    normalize(complaint.location).includes(term) ||
    normalize(complaint.description).includes(term) ||
    normalize(complaint._id).includes(term) ||
    normalize(complaint.status).includes(term);

  const matchesStatus =
    statusFilter === "All" ||
    normalize(complaint.status) === normalize(statusFilter);

  return matchesSearch && matchesStatus;
});
const handleAuth = async (e) => {
  e.preventDefault();
  setAuthMessage("");

  try {
  const endpoint = isAdminRegister
  ? "admin-register"
  : authMode === "register"
  ? "register"
  : "login";
const body = isAdminRegister
  ? {
      name: authName,
      email: authEmail,
      password: authPassword,
      adminKey: adminKey,
    }
  : authMode === "register"
  ? {
      name: authName,
      email: authEmail,
      password: authPassword,
    }
  : {
      email: authEmail,
      password: authPassword,
    };
  
  const response = await fetch(
    `https://smartcampus-backend-lt65.onrender.com/api/auth/${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
    const data = await response.json();

    if (!response.ok) {
      setAuthMessage(data.message || "Something went wrong");
      return;
    }

    if (authMode === "register" || isAdminRegister) {
  setAuthMessage(
    isAdminRegister
      ? "Admin registration successful! Please login."
      : "Registration successful! Please login."
  );

  setAuthMode("login");
  setIsAdminRegister(false);
  setAdminKey("");
  setAuthName("");
  setAuthPassword("");
  return;
}

    localStorage.setItem("token", data.token);
    setLoggedInUser(data.user);
    setAuthMessage("Login successful!");
    setShowAuth(false);
  } catch (error) {
    setAuthMessage("Server connection failed. Please try again.");
  }
};

  const categories = [
    { icon: "🏫", name: "Classroom", desc: "Room, furniture or teaching facilities" },
    { icon: "💡", name: "Electricity", desc: "Lights, fans or power issues" },
    { icon: "📶", name: "Wi-Fi & Internet", desc: "Network or connectivity problems" },
    { icon: "🚰", name: "Water", desc: "Drinking water or supply issues" },
    { icon: "🧹", name: "Cleanliness", desc: "Campus cleaning and hygiene" },
    { icon: "🛏️", name: "Hostel", desc: "Room or hostel-related problems" },
  ];

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f6f7f5",
      color: "#202c39",
      fontFamily: "Arial, sans-serif",
    },
    button: {
      background: "#263b50",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "12px 20px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "22px 8%",
        background: "#fff",
        borderBottom: "1px solid #e5e8e5",
        flexWrap: "wrap",
        gap: "15px"
      }}>
        <div style={{ fontSize: "22px", fontWeight: "bold" }}>
          Smart<span style={{ color: "#6686a3" }}>Campus</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "25px", flexWrap: "wrap" }}>
          <a href="#home" style={{ textDecoration: "none", color: "#526171" }}>Home</a>
          <a href="#issues" style={{ textDecoration: "none", color: "#526171" }}>Issues</a>
          <a href="#about" style={{ textDecoration: "none", color: "#526171" }}>About</a>
          {loggedInUser ? (
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <span style={{ color: "#263b50", fontWeight: "bold" }}>
      Hi, {loggedInUser.name}
    </span>

    <button
      style={styles.button}
      onClick={() => {
        localStorage.removeItem("token");
        setLoggedInUser(null);
        setAuthMessage("");
      }}
    >
      Logout
    </button>
  </div>
) : (
  <button
    style={styles.button}
    onClick={() => {
      setShowAuth(true);
      setAuthMode("login");
      setAuthMessage("");
    }}
  >
    Student Login
  </button>
)}
<button
  style={styles.button}
  onClick={() => {
    setShowAuth(true);
    setAuthMode("register");
    setIsAdminRegister(true);
    setAuthMessage("");
  }}
>
  Admin Registration
</button>
{loggedInUser?.role === "admin" && (
          <button
  style={styles.button}
  onClick={() => {
    setShowAdmin(!showAdmin);
    fetchComplaints();
  }}
>
  Admin Dashboard
</button>
)}
        </div>
      </nav>
      {showAuth && (
  <div style={{
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px"
  }}>
    <div style={{
      background: "#fff",
      padding: "30px",
      borderRadius: "14px",
      width: "100%",
      maxWidth: "400px",
      position: "relative"
    }}>
      <button
        onClick={() => setShowAuth(false)}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          border: "none",
          background: "transparent",
          fontSize: "22px",
          cursor: "pointer"
        }}
      >
        ×
      </button>

      <h2 style={{ color: "#263b50" }}>
        {authMode === "login" ? "Student Login" : "Create Account"}
      </h2>

      <p style={{ color: "#647381" }}>
        {authMode === "login"
          ? "Welcome back! Login to your account."
          : "Register to access SmartCampus."}
      </p>

      <form onSubmit={handleAuth}>
        {authMode === "register" && (
          <>
            <label>Full Name</label>
            <input
              type="text"
              value={authName}
              onChange={(e) => setAuthName(e.target.value)}
              placeholder="Enter your name"
              required
              style={{
                width: "100%",
                color: "#202c39",
                WebkitTextFillColor:"#202c39",
                background:"#ffffff",
                caretColor:"#202c39",
                padding: "12px",
                margin: "10px 0 18px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                boxSizing: "border-box"
              }}
            />
          </>
        )}
        {isAdminRegister && (
  <>
    <label>Admin Secret Key</label>
    <input
      type="password"
      value={adminKey}
      onChange={(e) => setAdminKey(e.target.value)}
      placeholder="Enter admin secret key"
      required
      style={{
        width: "100%",
        padding: "12px",
        margin: "10px 0 18px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        boxSizing: "border-box"
      }}
    />
  </>
)}

        <label>Email Address</label>
        <input
          type="email"
          value={authEmail}
          onChange={(e) => setAuthEmail(e.target.value)}
          placeholder="Enter your email"
          required
          style={{
            width: "100%",
            padding: "12px",
            margin: "10px 0 18px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            boxSizing: "border-box"
          }}
        />

        <label>Password</label>
        <input
          type="password"
          value={authPassword}
          onChange={(e) => setAuthPassword(e.target.value)}
          placeholder="Enter your password"
          required
          style={{
            width: "100%",
            padding: "12px",
            margin: "10px 0 18px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            boxSizing: "border-box"
          }}
        />

        {authMessage && (
          <p style={{ color: "#2563eb", fontSize: "14px" }}>
            {authMessage}
          </p>
        )}

        <button
          type="submit"
          style={{
            ...styles.button,
            width: "100%",
            marginTop: "10px"
          }}
        >
          {authMode === "login" ? "Login" : "Register"}
        </button>
      </form>

      <p style={{
        textAlign: "center",
        marginTop: "20px",
        fontSize: "14px"
      }}>
        {authMode === "login"
          ? "Don't have an account? "
          : "Already have an account? "}

        <span
          onClick={() => {
            setAuthMode(authMode === "login" ? "register" : "login");
            setAuthMessage("");
          }}
          style={{
            color: "#2563eb",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {authMode === "login" ? "Register" : "Login"}
        </span>
      </p>
    </div>
  </div>
)}
      {/* Admin Dashboard */}
{showAdmin && (
  <section style={{
    background: "#f1f5f9",
    padding: "35px",
    borderRadius: "16px",
    margin: "30px 0",
    color: "#1e293b"
  }}>
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "15px",
      marginBottom: "30px"
    }}>
      <div>
        <p style={{ color: "#64748b", margin: "0 0 8px" }}>
          SMARTCAMPUS ADMINISTRATION
        </p>
        <h1 style={{ margin: 0, fontSize: "30px" }}>
          Admin Dashboard
        </h1>
        <p style={{ color: "#64748b" }}>
          Manage and monitor student complaints.
        </p>
      </div>

      <button
        onClick={fetchComplaints}
        style={{
          background: "#1e3a8a",
          color: "#fff",
          border: "none",
          padding: "12px 20px",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        ↻ Refresh Data
      </button>
    </div>

    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "18px",
      marginBottom: "30px"
    }}>
      <div style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "14px",
        borderLeft: "5px solid #2563eb",
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
      }}>
        <p style={{ color: "#64748b", margin: 0 }}>Total Complaints</p>
        <h1 style={{ fontSize: "32px", margin: "12px 0" , color: "#2563eb" }}>
          {allComplaints.length}
        </h1>
        <p style={{ color: "#2563eb", margin: 0 }}>All submissions</p>
      </div>

      <div style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "14px",
        borderLeft: "5px solid #f59e0b",
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
      }}>
        <p style={{ color: "#64748b", margin: 0 }}>Pending</p>
        <h1 style={{ fontSize: "32px", margin: "12px 0" , color: "#d97706"}}>
          {allComplaints.filter(c => c.status === "Pending").length}
        </h1>
        <p style={{ color: "#d97706", margin: 0 }}>Awaiting action</p>
      </div>

      <div style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "14px",
        borderLeft: "5px solid #6366f1",
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
      }}>
        <p style={{ color: "#64748b", margin: 0 }}>In Progress</p>
        <h1 style={{ fontSize: "32px", margin: "12px 0" , color: "#7c3aed"}}>
          {allComplaints.filter(c => c.status === "In Progress").length}
        </h1>
        <p style={{ color: "#6366f1", margin: 0 }}>Being worked on</p>
      </div>

      <div style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "14px",
        borderLeft: "5px solid #10b981",
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
      }}>
        <p style={{ color: "#64748b", margin: 0 }}>Resolved</p>
        <h1 style={{ fontSize: "32px", margin: "12px 0" , color:"#059669" }}>
          {allComplaints.filter(c => c.status === "Resolved").length}
        </h1>
        <p style={{ color: "#059669", margin: 0 }}>Successfully completed</p>
      </div>
    </div>

    <div style={{
      background: "#fff",
      padding: "25px",
      borderRadius: "14px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
    }}>
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
  <input
    type="text"
    placeholder="Search by name, category or complaint ID..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #ddd",
      flex: "1",
      minWidth: "220px",
      outline: "none"
    }}
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    style={{
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #ddd",
      cursor: "pointer"
    }}
  >
    <option value="All">All Status</option>
    <option value="Pending">Pending</option>
    <option value="In Progress">In Progress</option>
    <option value="Resolved">Resolved</option>
  </select>
</div>
      <h2 style={{ marginTop: 0 , color:"#263b50" }}>Recent Complaints</h2>
      <p style={{ color: "#64748b" }}>
        Overview of student-reported campus issues.
      </p>

      {filteredComplaints.length === 0 ? (
        <p style= {{ color: "#64748b" , padding: "15px 0"}} >No complaints found.</p>
      ) : (

         filteredComplaints.map((complaint) => (
          <div key={complaint._id} style={{
            border: "1px solid #e2e8f0",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "15px",
            background: "#f8fafc",
            boxShadow: "0 4px 15px rgba(15, 23, 42, 0.04)",
    transition: "0.3s ease"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px"
            }}>
              <h3 style={{ margin: "0 0 12px" }}>
                {complaint.category}
              </h3>

              <span style={{
  background: complaint.status === "Resolved"
    ? "#dcfce7"
    : complaint.status === "In Progress"
    ? "#dbeafe"
    : "#fef3c7",
  color: complaint.status === "Resolved"
    ? "#166534"
    : complaint.status === "In Progress"
    ? "#1d4ed8"
    : "#92400e",
  padding: "7px 14px",
  borderRadius: "30px",
  fontSize: "12px",
  fontWeight: "700",
  height: "fit-content",
  letterSpacing: "0.3px",
  border: complaint.status === "Resolved"
    ? "1px solid #bbf7d0"
    : complaint.status === "In Progress"
    ? "1px solid #bfdbfe"
    : "1px solid #fde68a",
  whiteSpace: "nowrap"
}}>
  {complaint.status}
</span>
              <select
  value={complaint.status}
  onChange={async (e) => {
    const newStatus = e.target.value;

    await fetch(`https://smartcampus-backend-lt65.onrender.com/api/complaints/${complaint._id}`, {
      method: "PATCH",
      headers: {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`
},
      body: JSON.stringify({ status: newStatus })
    });

    fetchComplaints();
  }}
  style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    marginTop: "10px"
  }}
>
  <option value="Pending">Pending</option>
  <option value="In Progress">In Progress</option>
  <option value="Resolved">Resolved</option>
</select>
            </div>

            <p><strong>Student:</strong> {complaint.studentName}</p>
            <p><strong>Department:</strong> {complaint.department}</p>
            <p><strong>Location:</strong> {complaint.location}</p>
            <p><strong>Description:</strong> {complaint.description}</p>
            <p style={{ color: "#64748b", fontSize: "13px" }}>
              <strong>Complaint ID:</strong> {complaint._id}
            </p>
          </div>
        ))
      )}
    </div>
  </section>
)}

      {/* Hero Section */}
      <main id="home" style={{ maxWidth: "1120px", margin: "auto", padding: "40px 24px" }}>
        <section style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "35px",
          padding: "45px 0"
        }}>
          <div style={{ maxWidth: "570px" }}>
            <p style={{ color: "#6686a3", fontSize: "13px", fontWeight: "bold", letterSpacing: "2px" }}>
              YOUR CAMPUS. YOUR VOICE.
            </p>

            <h1 style={{
              fontSize: "clamp(36px, 5vw, 58px)",
              lineHeight: "1.15",
              margin: "18px 0",
              letterSpacing: "-2px",
              color: "#263b50"
            }}>
              Something wrong on campus? Let's fix it.
            </h1>

            <p style={{ color: "#687582", lineHeight: "1.8", fontSize: "16px" }}>
              From classroom issues to hostel problems, let the right department know.
              Raise a complaint and stay updated on its progress.
            </p>

            <button
              style={{ ...styles.button, marginTop: "18px", padding: "14px 22px" ,  color: "#ffffff"}}
              onClick={() => document.getElementById("issues").scrollIntoView({ behavior: "smooth" })}
            >
              Report an issue →
            </button>
          </div>

          <div style={{
            background: "#e7edf1",
            borderRadius: "12px",
            padding: "35px",
            width: "270px",
            minHeight: "190px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}>
            <div style={{ fontSize: "38px" }}>📝</div>
            <h3 style={{ marginBottom: "8px" }}>Have an issue?</h3>
            <p style={{ color: "#657381", lineHeight: "1.6", fontSize: "14px" }}>
              Tell us what's happening. We'll help get it to the right people.
            </p>
          </div>
        </section>

        {/* Complaint Categories */}
        <section id="issues" style={{ padding: "40px 0" }}>
          <div style={{ marginBottom: "28px" }}>
            <p style={{ color: "#6686a3", fontSize: "12px", fontWeight: "bold", letterSpacing: "1.5px" }}>
              COMPLAINT CATEGORIES
            </p>
            <h2 style={{ color: "#263b50" , fontSize: "28px", margin: "10px 0" }}>What do you need help with?</h2>
            <p style={{ color: "#263b50" }}>Choose the category that best matches your issue.</p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "16px"
          }}>
            {categories.map((item) => (
              <div key={item.name} style={{
                background: "#fff",
                border: "1px solid #e6e9e8",
                padding: "24px",
                borderRadius: "9px"
              }}>
                <div style={{ fontSize: "26px" }}>{item.icon}</div>
                <h3 style={{ margin: "15px 0 8px", fontSize: "17px" }}>{item.name}</h3>
                <p style={{ fontSize: "13px", color: "#71808c", lineHeight: "1.6" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

{/* Track Complaint */}
<section id="track-complaint" style={{
  background: "#e9eef1",
  padding: "30px",
  borderRadius: "10px",
  margin: "30px 0"
}}>
  <h2 style={{ color: "#263b50", fontSize: "28px" }}>
    Track your complaint
  </h2>

  <p style={{ color: "#647381" }}>
    Enter your Complaint ID to check the current status of your issue.
  </p>

  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
    <input
      type="text"
      id="complaintId"
      placeholder="Enter your Complaint ID"
      value={complaintId}
      onChange={(e) => setComplaintId(e.target.value)}
      style={{
        flex: "1",
        minWidth: "220px",
        padding: "12px",
        border: "1px solid #ddd",
        borderRadius: "6px"
      }}
    />

    <button
  type="button"
  style={styles.button}
  onClick={trackComplaint}
>
  Track Complaint
</button>
  </div>
  {trackMessage && (
  <p style={{ color: "#c0392b", marginTop: "15px" }}>
    {trackMessage}
  </p>
)}

{loading && (
  <p style={{ color: "#6686a3", marginTop: "15px" }}>
    Searching for your complaint...
  </p>
)}
{trackedComplaint && (
  <div style={{
    background: "#ffffff",
    borderRadius: "8px",
    padding: "20px",
    marginTop: "20px",
    border: "1px solid #dce3e8"
  }}>
    <h3 style={{ color: "#263b50" }}>Complaint Details</h3>

    <p><strong>Complaint ID:</strong> {trackedComplaint._id}</p>
    <p><strong>Student:</strong> {trackedComplaint.studentName}</p>
    <p><strong>Department:</strong> {trackedComplaint.department}</p>
    <p><strong>Category:</strong> {trackedComplaint.category}</p>
    <p><strong>Location:</strong> {trackedComplaint.location}</p>
    <p><strong>Description:</strong> {trackedComplaint.description}</p>
    <p><strong>Status:</strong> {trackedComplaint.status}</p>
    <p><strong>Submitted:</strong> {new Date(trackedComplaint.createdAt).toLocaleString()}</p>
  </div>
)}
</section>

{/* Complaint Form */}
<section id="complaint-form" style={{
  background: "#fff",
  padding: "30px",
  borderRadius: "10px",
  border: "1px solid #e5e8e5",
  margin: "30px 0"
}}>
  <h2 style={{ color: "#263b50", fontSize: "28px" }}>Report a campus issue</h2>
  <p style={{ color: "#263b50" }}>
    Fill in the details below so we can look into your problem.
  </p>

  <form onSubmit={async (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  const formData = new FormData(form);
  const complaint = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("https://smartcampus-backend-lt65.onrender.com/api/complaints", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(complaint)
    });

    const data = await response.json();

    if (response.ok) {
      alert(
   `Complaint submitted successfully!\nYour Complaint ID: ${data.complaint._id}`
    );
      form.reset();
      fetchComplaints();
    } else {
      alert(data.message || "Something went wrong");
    }

  } catch (error) {
    alert("Server connection failed. Please try again.");
  }
}}>
    <label>Your Name</label>
    <input type="text" placeholder="Enter your name" name= "studentName" required
      style={{ width: "100%", padding: "12px", margin: "10px 0 20px", border: "1px solid #ddd", borderRadius: "6px", color: "#202c39"}} />

    <label>Department</label>
    <select required name="department" style={{ width: "100%", padding: "12px", margin: "10px 0 20px", border: "1px solid #ddd", borderRadius: "6px" }}>
      <option value="">Select your department</option>
      <option>CSE</option>
      <option>IT</option>
      <option>ECE</option>
      <option>Mechanical</option>
      <option>Civil</option>
      <option>Other</option>
    </select>

    <label>Complaint Category</label>
    <select required name="category" style={{ width: "100%", padding: "12px", margin: "10px 0 20px", border: "1px solid #ddd", borderRadius: "6px" }}>
      <option value="">Select category</option>
      <option>Classroom</option>
      <option>Electricity</option>
      <option>Wi-Fi & Internet</option>
      <option>Water</option>
      <option>Cleanliness</option>
      <option>Hostel</option>
      <option>Other</option>
    </select>

    <label>Location</label>
    <input type="text" placeholder="e.g. Block B, Room 204" required name= "location"
      style={{ width: "100%", padding: "12px", margin: "10px 0 20px", border: "1px solid #ddd", borderRadius: "6px" }} />

    <label>Complaint Details</label>
    <textarea placeholder="Describe your issue here..." required rows="4" name="description"
      style={{ width: "100%", padding: "12px", margin: "10px 0 20px", border: "1px solid #ddd", borderRadius: "6px", resize: "vertical" }} />

    <button type="submit" style={styles.button}>
      Submit Complaint
    </button>
  </form>
</section>
        {/* About Section */}
        <section id="about" style={{
          margin: "35px 0",
          padding: "30px",
          background: "#e9eef1",
          borderRadius: "10px"
        }}>
          <h2 style={{ fontSize: "23px" }}>How does it work?</h2>
          <p style={{ color: "#647381", lineHeight: "1.8" }}>
            Submit your complaint, let it reach the concerned department, and
            check for updates until the issue is resolved. No need to keep
            visiting offices to ask about its status.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        padding: "25px",
        background: "#263b50",
        color: "#fff",
        textAlign: "center",
        fontSize: "13px"
      }}>
        SmartCampus · Student Grievance Portal · 2026
      </footer>
    </div>
  );
}

export default App;