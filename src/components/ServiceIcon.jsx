function ServiceIcon({ service }) {
  const iconMap = {
    moodle: '/icons/moodle.png',
    teams: '/icons/microsoft-teams-logo-png.png',
    webuntis: '/icons/webuntislogo.svg',
    easymensa: '/icons/easymensa.png',
    studysimplifier: '/icons/LogoStudySimplifier.png',
    default: '/icons/link.svg'
  }

  return (
    <div className="flex justify-center mb-4">
      <img 
        src={iconMap[service] || iconMap.default} 
        alt={`${service} icon`}
        className="w-16 h-16 object-contain"
      />
    </div>
  )
}

export default ServiceIcon 