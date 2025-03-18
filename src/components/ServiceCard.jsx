import ServiceIcon from './ServiceIcon'

function ServiceCard({ title, service, url }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <div className="bg-white dark:bg-[#242424] p-6 rounded-lg cursor-pointer transition-transform hover:scale-105 shadow-md">
        <ServiceIcon service={service} />
        <h3 className="text-center text-lg font-medium mt-2">{title}</h3>
    </div>
    </a>
  )
}

export default ServiceCard 