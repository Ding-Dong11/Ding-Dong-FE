import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import useKeyboardOffset from '../hooks/useKeyboardOffset.js';
import '../styles/auth-form.css';
import '../styles/signup.css';

const AUTH_CODE_LIMIT_SECONDS = 180;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isAuthCodeSent, setIsAuthCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(AUTH_CODE_LIMIT_SECONDS);
  const [errorMessage, setErrorMessage] = useState('');
  const emailInputRef = useRef(null);
  const authCodeInputRef = useRef(null);
  const nextButtonRef = useRef(null);
  const keyboardOffset = useKeyboardOffset();

  useEffect(() => {
    const focusTimer = window.setTimeout(() => {
      emailInputRef.current?.focus();
    }, 100);

    return () => window.clearTimeout(focusTimer);
  }, []);

  useEffect(() => {
    if (!isAuthCodeSent) return undefined;

    const countdownTimer = window.setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          window.clearInterval(countdownTimer);
          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(countdownTimer);
  }, [isAuthCodeSent]);

  const handleSendAuthCode = () => {
    if (!email.trim()) {
      setErrorMessage('이메일을 작성해 주세요.');
      emailInputRef.current?.focus();
      return;
    }

    setErrorMessage('');
    setIsAuthCodeSent(true);
    setTimeLeft(AUTH_CODE_LIMIT_SECONDS);
    authCodeInputRef.current?.focus();
  };

  const handleEmailKeyDown = (event) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    handleSendAuthCode();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isAuthCodeSent) {
      handleSendAuthCode();
      return;
    }

    navigate('/password');
  };

  return (
    <AuthLayout title="회원가입">
      <form
        className="auth-form"
        style={{ '--keyboard-offset': `${keyboardOffset}px` }}
        onSubmit={handleSubmit}
      >
        <div className="form-field">
          <label htmlFor="email" className="form-label">
            이메일
          </label>
          <div className="email-row">
            <input
              id="email"
              type="email"
              className="text-input"
              placeholder="내용을 입력해주세요."
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyDown={handleEmailKeyDown}
              autoComplete="off"
              ref={emailInputRef}
            />
            <button
              type="button"
              className={`secondary-button ${isAuthCodeSent ? 'secondary-button-sent' : ''}`}
              onClick={handleSendAuthCode}
            >
              인증
            </button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="auth-code" className="form-label">
            인증 코드
          </label>
          <div className="code-row">
            <input
              id="auth-code"
              type="text"
              className="text-input code-input"
              placeholder={isAuthCodeSent ? '내용을 입력해주세요.' : '인증 요청 후 입력하세요.'}
              disabled={!isAuthCodeSent}
              autoComplete="off"
              ref={authCodeInputRef}
            />
            {isAuthCodeSent && (
              <span className={`timer ${timeLeft > 0 ? 'timer-active' : 'timer-expired'}`}>
                {timeLeft > 0 ? formatTime(timeLeft) : '시간 만료'}
              </span>
            )}
          </div>
        </div>

        <div className="auth-actions">
          <button type="submit" className="primary-button" ref={nextButtonRef}>
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

export default SignupPage;
