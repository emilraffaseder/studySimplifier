import React from 'react';

function LogoStudySimplifier({ className, color }) {
  // Die Farbe wird entweder als Prop übergeben oder die Standardthemenfarbe aus CSS-Variable verwendet
  const logoColor = color || 'var(--theme-color)';
  
  return (
    <svg 
      className={className} 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Kreis/Hintergrund */}
      <circle cx="100" cy="100" r="90" fill={logoColor} />
      
      {/* Die beiden S-Formen */}
      <path 
        d="M59 55 
           C 42 55, 35 70, 44 85 
           C 52 100, 52 115, 40 120 
           M 141 55 
           C 124 55, 117 70, 126 85 
           C 134 100, 134 115, 122 120" 
        stroke="white" 
        strokeWidth="16" 
        fill="none" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Horizontale Verbindungslinie */}
      <line x1="53" y1="85" x2="147" y2="85" stroke="white" strokeWidth="15" />
    </svg>
  );
}

export default LogoStudySimplifier; 