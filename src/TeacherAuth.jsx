import { useState } from "react";
import "./TeacherAuth.css";

function TeacherAuth({ onLoginSuccess }) {
  const [mode, setMode] = useState("login");

  // Signup fields
  const [facultyId, setFacultyId] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // Password visibility
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // SIGNUP -> FASTAPI
  const handleSignup = async () => {
    if (!facultyId || !email || !mobile || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!email.endsWith("@banasthali.in")) {
      alert("Please use your institutional @banasthali.in email.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/teacher/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            faculty_id: facultyId,
            email: email,
            mobile_number: mobile,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Signup failed.");
        return;
      }

      alert("Teacher account created successfully!");

      // Clear signup fields
      setFacultyId("");
      setEmail("");
      setMobile("");
      setPassword("");
      setConfirmPassword("");

      // Go back to login
      setMode("login");
    } catch (error) {
      console.error("Signup error:", error);
      alert(
        "Cannot connect to backend. Please make sure FastAPI is running."
      );
    }
  };
  const handleLogin = async () => {
  if (!loginEmail || !loginPassword) {
    alert("Please enter email and password.");
    return;
  }

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/teacher/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Login failed.");
      return;
    }

    alert("Login successful!");

    if (onLoginSuccess) {
      onLoginSuccess();
    }

  } catch (error) {
    console.error("Login error:", error);
    alert(
      "Cannot connect to backend. Please make sure FastAPI is running."
    );
  }
};

  return (
    <div className="teacher-auth-page">
      <div className="wrap">

        {/* BRAND */}
        <div className="brand">
          <div className="mark">
            <img src="/logo.png" alt="IntelliOutcome" />
          </div>

          <div className="name">
            IntelliOutcome
          </div>
        </div>

        {/* CARD */}
        <div className="card">

          {/* LOGIN / SIGNUP TOGGLE */}
          <div className="toggle">

            <button
              id="tab-login"
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Log in
            </button>

            <button
              id="tab-signup"
              className={mode === "signup" ? "active" : ""}
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>

          </div>


          {/* LOGIN */}
          {mode === "login" && (
            <div id="panel-login">

              <h1>Teacher Login</h1>

              <p className="subtitle">
                Log in to access your courses and attainment data.
              </p>


              {/* EMAIL */}
              <div className="field">

                <span className="icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M4 4h16v16H4z"
                      opacity="0"
                    />
                    <path d="M22 6l-10 7L2 6" />
                    <path d="M2 6h20v12H2z" />
                  </svg>
                </span>

                <input
                    type="email"
                    placeholder="yourname@banasthali.in"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                />

              </div>


              {/* PASSWORD */}
              <div className="field">

                <span className="icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect
                      x="5"
                      y="11"
                      width="14"
                      height="9"
                      rx="2"
                    />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                </span>

                <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                />

                <button
                  className="toggle-eye"
                  type="button"
                  onClick={() =>
                    setShowLoginPassword(!showLoginPassword)
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>

              </div>


              {/* FORGOT PASSWORD */}
              <div className="row-between">

                <a
                  className="link"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </a>

              </div>


              {/* LOGIN BUTTON */}
              <button
                className="submit"
                type="button"
                onClick={handleLogin}
              >

                Log in

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>

              </button>


              {/* SWITCH TO SIGNUP */}
              <p className="switch-line">

                New teacher?{" "}

                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setMode("signup");
                  }}
                >
                  Sign up
                </a>

              </p>

            </div>
          )}


          {/* SIGNUP */}
          {mode === "signup" && (
            <div id="panel-signup">

              <h1>Create Teacher Account</h1>

              <p className="subtitle">
                Register with your institutional email to get started.
              </p>


              {/* FACULTY ID */}
              <div className="field">

                <span className="icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 20a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="8" r="4" />
                  </svg>
                </span>

                <input
                  type="text"
                  placeholder="Faculty ID"
                  value={facultyId}
                  onChange={(e) => setFacultyId(e.target.value)}
                />

              </div>


              {/* EMAIL */}
              <div className="field">

                <span className="icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 6l-10 7L2 6" />
                    <path d="M2 6h20v12H2z" />
                  </svg>
                </span>

                <input
                  type="email"
                  placeholder="yourname@banasthali.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

              </div>


              {/* MOBILE */}
              <div className="field">

                <span className="icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92V19a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 1h2.09a2 2 0 0 1 2 1.72c.12.9.35 1.78.68 2.6a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.48-1.34a2 2 0 0 1 2.11-.45c.82.33 1.7.56 2.6.68A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>

                <input
                  type="tel"
                  placeholder="Mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />

              </div>


              {/* PASSWORD */}
              <div className="field">

                <span className="icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect
                      x="5"
                      y="11"
                      width="14"
                      height="9"
                      rx="2"
                    />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                </span>

                <input
                  type={showSignupPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  className="toggle-eye"
                  type="button"
                  onClick={() =>
                    setShowSignupPassword(!showSignupPassword)
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>

              </div>


              {/* CONFIRM PASSWORD */}
              <div className="field">

                <span className="icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect
                      x="5"
                      y="11"
                      width="14"
                      height="9"
                      rx="2"
                    />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                </span>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />

                <button
                  className="toggle-eye"
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>

              </div>


              {/* VERIFICATION */}
              <div className="verify-label">
                Verification
              </div>

              <div className="verify-row">

                <div className="captcha-box">
                  4 − 10
                </div>

                <button
                  className="refresh-btn"
                  type="button"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M23 4v6h-6" />
                    <path d="M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
                    <path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                </button>

              </div>


              {/* CAPTCHA ANSWER */}
              <div className="field">

                <input
                  type="text"
                  placeholder="Enter the answer"
                  style={{ paddingLeft: "14px" }}
                />

              </div>


              {/* CREATE ACCOUNT */}
              <button
                className="submit"
                type="button"
                onClick={handleSignup}
              >

                Create account

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>

              </button>


              {/* SWITCH TO LOGIN */}
              <p className="switch-line">

                Already registered?{" "}

                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setMode("login");
                  }}
                >
                  Log in
                </a>

              </p>

            </div>
          )}

        </div>


        {/* FOOT NOTE */}
        <p className="foot-note">
          Access is restricted to registered faculty with a verified
          @banasthali.in address.
        </p>

      </div>
    </div>
  );
}

export default TeacherAuth;