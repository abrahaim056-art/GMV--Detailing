interface LogoProps {
  tamano?: number;
}
 
// Icono sencillo de un auto con destello, en dorado.
function Logo({ tamano = 30 }: LogoProps) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#c9a227"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 15v-3l2-5h10l2 5v3" />
      <path d="M3 15h14" />
      <circle cx="7" cy="17" r="1.6" />
      <circle cx="13" cy="17" r="1.6" />
      <path d="M20 4v4M18 6h4" />
    </svg>
  );
}
 
export default Logo;