import '../styles/auth-layout.css';

function AuthLayout({ title, children }) {
  return (
    <main className="auth-page">
      <section className="auth-container" aria-labelledby="auth-title">
        <h1 id="auth-title" className="auth-title">
          {title}
        </h1>
        {children}
      </section>
    </main>
  );
}

export default AuthLayout;
