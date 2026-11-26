export default function Logo({ grande = false, children }) {
  return (
    <div className={grande ? 'logo login-logo' : 'logo'} aria-label="Logo">
      <div className="icone" />
      {children}
    </div>
  );
}
