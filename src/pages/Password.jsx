import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import useKeyboardOffset from '../hooks/useKeyboardOffset.js';
import '../styles/auth-form.css';
import '../styles/password.css';

function PasswordPage() {
  const navigate = useNavigate();
  const keyboardOffset = useKeyboardOffset();
  const passwordInputRef = useRef(null);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!password.trim() || !passwordConfirm.trim()) {
      setErrorMessage('비밀번호를 입력해 주세요.');
      passwordInputRef.current?.focus();
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    setErrorMessage('');
    navigate('/login');
  };

  return (
    <AuthLayout title="비밀번호 설정">
      <form
        className="auth-form"
        style={{ '--keyboard-offset': `${keyboardOffset}px` }}
        onSubmit={handleSubmit}
      >
        <div className="form-field password-field">
          <label htmlFor="password" className="form-label">
            비밀번호
          </label>
          <div className="password-input-wrap">
            <input
              id="password"
              type={isPasswordVisible ? 'text' : 'password'}
              className="text-input password-input"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="off"
              ref={passwordInputRef}
            />
            <button
              type="button"
              className="password-toggle-button"
              aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
              onClick={() => setIsPasswordVisible((prevVisible) => !prevVisible)}
            >
              <span
                className={`password-eye ${!isPasswordVisible ? 'password-eye-visible' : ''}`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <div className="form-field password-field">
          <label htmlFor="password-confirm" className="form-label">
            비밀번호 확인
          </label>
          <div className="password-input-wrap">
            <input
              id="password-confirm"
              type={isPasswordConfirmVisible ? 'text' : 'password'}
              className="text-input password-input"
              placeholder="비밀번호를 다시 입력해주세요."
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              autoComplete="off"
            />
            <button
              type="button"
              className="password-toggle-button"
              aria-label={isPasswordConfirmVisible ? '비밀번호 확인 숨기기' : '비밀번호 확인 보기'}
              onClick={() => setIsPasswordConfirmVisible((prevVisible) => !prevVisible)}
            >
              <span
                className={`password-eye ${!isPasswordConfirmVisible ? 'password-eye-visible' : ''}`}
                aria-hidden="true"
              />
            </button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>

        <div className="auth-actions">
          <button type="submit" className="primary-button">
            다음
          </button>
          <p className="bottom-login">
            <span>계정이 있으신가요?</span>
            <Link to="/login" className="bottom-login-link">
              로그인
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default PasswordPage;
