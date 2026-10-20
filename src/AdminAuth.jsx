import { useState } from "react";

function AdminAuth({ onLoginSuccess }) {
  const [mode, setMode] = useState("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [adminName, setAdminName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      alert("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Admin login failed.");
        return;
      }

      alert("Admin login successful!");

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error("Admin login error:", error);

      alert(
        "Cannot connect to backend. Please make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (
      !adminName ||
      !signupEmail ||
      !signupPassword ||
      !confirmPassword
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (signupPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/admin/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: adminName,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Admin signup failed.");
        return;
      }

      alert("Admin account created successfully!");

      setAdminName("");
      setSignupEmail("");
      setSignupPassword("");
      setConfirmPassword("");

      setMode("login");
      setLoginEmail(signupEmail);
    } catch (error) {
      console.error("Admin signup error:", error);

      alert(
        "Cannot connect to backend. Please make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "400px",
          maxWidth: "100%",
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1
            style={{
              margin: 0,
              color: "#1d264d",
              fontSize: "28px",
            }}
          >
            Admin {mode === "login" ? "Login" : "Signup"}
          </h1>

          <p
            style={{
              color: "#666",
              marginTop: "8px",
              fontSize: "14px",
            }}
          >
            IntelliOutcome Administration
          </p>
        </div>

        {mode === "login" ? (
          <>
            {/* LOGIN EMAIL */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Admin Email
              </label>

              <input
                type="email"
                placeholder="Enter admin email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  border: "1px solid #d5d9e2",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              />
            </div>

            {/* LOGIN PASSWORD */}
            <div style={{ marginBottom: "25px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Password
              </label>

              <input
                type="password"
                placeholder="Enter admin password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  border: "1px solid #d5d9e2",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                border: "none",
                borderRadius: "8px",
                background: loading ? "#9aa3b8" : "#1d264d",
                color: "white",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* SWITCH TO SIGNUP */}
            <p
              style={{
                textAlign: "center",
                marginTop: "22px",
                color: "#666",
                fontSize: "14px",
              }}
            >
              Don't have an admin account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                style={{
                  border: "none",
                  background: "none",
                  color: "#1d264d",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Sign up
              </button>
            </p>
          </>
        ) : (
          <>
            {/* ADMIN NAME */}
            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Admin Name
              </label>

              <input
                type="text"
                placeholder="Enter admin name"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  border: "1px solid #d5d9e2",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              />
            </div>

            {/* SIGNUP EMAIL */}
            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Admin Email
              </label>

              <input
                type="email"
                placeholder="Enter admin email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  border: "1px solid #d5d9e2",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              />
            </div>

            {/* PASSWORD */}
            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Password
              </label>

              <input
                type="password"
                placeholder="Create password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  border: "1px solid #d5d9e2",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div style={{ marginBottom: "25px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  border: "1px solid #d5d9e2",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              />
            </div>

            {/* SIGNUP BUTTON */}
            <button
              type="button"
              onClick={handleSignup}
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                border: "none",
                borderRadius: "8px",
                background: loading ? "#9aa3b8" : "#1d264d",
                color: "white",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating account..." : "Create Admin Account"}
            </button>

            {/* SWITCH TO LOGIN */}
            <p
              style={{
                textAlign: "center",
                marginTop: "22px",
                color: "#666",
                fontSize: "14px",
              }}
            >
              Already have an admin account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                style={{
                  border: "none",
                  background: "none",
                  color: "#1d264d",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Login
              </button>
            </p>
          </>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            fontSize: "13px",
            color: "#888",
          }}
        >
          IntelliOutcome · Admin Portal
        </p>
      </div>
    </div>
  );
}

export default AdminAuth;