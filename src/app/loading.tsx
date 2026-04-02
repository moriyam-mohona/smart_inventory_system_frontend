export default function RootLoading() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
      color: '#f8fafc',
      padding: '2rem'
    }}>
      <section style={{
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '3rem 2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #38bdf8, #0369a1)',
          boxShadow: '0 8px 16px rgba(56, 189, 248, 0.3)',
        }}>
          <svg style={{ animation: 'spin 1s linear infinite' }} width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
             <line x1="12" y1="2" x2="12" y2="6"></line>
             <line x1="12" y1="18" x2="12" y2="22"></line>
             <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
             <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
             <line x1="2" y1="12" x2="6" y2="12"></line>
             <line x1="18" y1="12" x2="22" y2="12"></line>
             <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
             <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spin { 100% { transform: rotate(360deg); } }
          `}} />
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>Loading</h1>
         <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '1.05rem' }}>Please wait while we set things up.</p>
      </section>
    </main>
  );
}
