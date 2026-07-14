import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import useKeyboardOffset from '../hooks/useKeyboardOffset.js';
import '../styles/auth-form.css';
import '../styles/login.css';

function LoginPage() {
  const navigate = useNavigate();
  const keyboardOffset = useKeyboardOffset();
  const emailInputRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <AuthLayout title="로그인">
      <button type="button" className="login-back-button" aria-label="이전 페이지" onClick={() => navigate(-1)}>
        <span aria-hidden="true" />
      </button>

      <form
        className="auth-form login-form"
        style={{ '--keyboard-offset': `${keyboardOffset}px` }}
        onSubmit={handleSubmit}
      >
        <div className="form-field">
          <label htmlFor="login-email" className="form-label login-label">
            이메일
          </label>
          <input
            id="login-email"
            type="email"
            className="text-input login-input"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="off"
            ref={emailInputRef}
          />
        </div>

        <div className="form-field login-password-field">
          <label htmlFor="login-password" className="form-label login-label">
            비밀번호
          </label>
          <input
            id="login-password"
            type="password"
            className="text-input login-input"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="auth-actions login-actions">
          <button type="submit" className="primary-button">
            로그인
          </button>
          <p className="bottom-login login-signup">
            <span>계정이 없으신가요?</span>
            <Link to="/signup" className="bottom-login-link">
              회원가입
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
