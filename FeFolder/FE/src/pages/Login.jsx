import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import hero from '../picture/ảnh nền login.png';
import { GoogleLogin } from '@react-oauth/google'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Giả lập request
    await new Promise((r) => setTimeout(r, 700));

    if (email.toLowerCase() === "test@gmail.com" && password === "123456") {
      alert("Đăng nhập thành công!");
      navigate("/dashboard");
    } else {
      alert("Sai email hoặc mật khẩu");
    }
    setLoading(false);
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${hero})` }}>

      <div className="login-form-wrapper">
        <div className="login-card">
          <header className="card-header">
            <div className="brand">
              <div className="logo">EV</div>
              <div className="brand-text">
                <div className="brand-title">EV Car Rental</div>
                <div className="brand-sub">Thuê xe điện thông minh – tiết kiệm – xanh sạch</div>
              </div>
            </div>
            <div className="page-title">Đăng nhập hệ thống</div>
          </header>

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group input-with-icon">
              <label htmlFor="email">Email hoặc số điện thoại</label>
              <div className="input-inner">
                <span className="icon email-icon" aria-hidden>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16v16H4z"/>
                    <path d="M22 6L12 13 2 6"/>
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="Email hoặc số điện thoại"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group input-with-icon">
              <label htmlFor="password">Mật khẩu</label>
              <div className="input-inner password-wrap">
                <span className="icon lock-icon" aria-hidden>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  title={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17.94 17.94A10.94 10.94 0 0112 20c-5.5 0-9.5-5.5-9.5-8 1.16-2.47 4.21-6 9.5-6 2.04 0 3.9.5 5.54 1.36" />
                      <path d="M1 1l22 22" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M2.5 12s4-7.5 9.5-7.5S21.5 12 21.5 12s-4 7.5-9.5 7.5S2.5 12 2.5 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="meta-row">
              <label className="remember">
                <input type="checkbox" /> Nhớ đăng nhập
              </label>
              <a className="forgot" onClick={() => alert("Chức năng quên mật khẩu chưa được cài đặt.")}>Quên mật khẩu?</a>
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng Nhập"}
            </button>

            <div className="or-row">Hoặc</div>
            <div className="sso-row">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  console.log('Google credentialResponse:', credentialResponse)
                  try {
                    const id_token = credentialResponse && credentialResponse.credential
                    if (!id_token) {
                      console.error('No id_token in Google response')
                      alert('Đăng nhập Google thất bại: không nhận được token từ Google (không có credential).')
                      return
                    }
                    const authServer = import.meta.env.VITE_AUTH_SERVER || 'http://localhost:3001'
                    console.log('authServer=', authServer)
                    // quick health check to ensure auth server is reachable
                    try {
                      const h = await fetch(`${authServer}/health`).catch((e) => { throw e })
                      if (!h.ok) throw new Error(`health check failed: ${h.status}`)
                      const health = await h.json().catch(() => ({}))
                      console.log('auth server health:', health)
                    } catch (e) {
                      console.error('Auth server unreachable:', e)
                      alert('Đăng nhập Google thất bại: không thể kết nối tới auth server. Kiểm tra server đang chạy và CORS. Xem console/server logs.')
                      return
                    }

                    const res = await fetch(`${authServer}/api/auth/google`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id_token })
                    })
                    if (!res.ok) {
                      const text = await res.text().catch(() => '')
                      throw new Error(`Auth failed (${res.status}): ${text}`)
                    }
                    const data = await res.json()
                    console.log('Server auth response', data)
                    alert(`Xin chào ${data.user.name}`)
                    localStorage.setItem('token', data.token)
                    navigate('/dashboard')
                  } catch (err) {
                    console.error('Google SSO error:', err)
                    alert('Đăng nhập Google thất bại: ' + (err.message || 'xảy ra lỗi'))
                  }
                }}
                onError={(err) => {
                  console.error('GoogleLogin onError', err)
                  alert('Đăng nhập Google thất bại (onError). Kiểm tra console để biết chi tiết.')
                }}
              />
            </div>
          </form>

          <div className="signup">
            Không có tài khoản? <button className="link" onClick={() => navigate("/register")}>Đăng ký tại đây</button>
          </div>
        </div>
      </div>
    </div>
  );
}
