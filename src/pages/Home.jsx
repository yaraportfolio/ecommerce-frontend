import { Link } from 'react-router-dom';

export default function Home() {
  const features = [
    {
      icon: '🐳',
      title: 'Containerized',
      description: 'Docker containers orchestrated with Kubernetes and Helm'
    },
    {
      icon: '⚙️',
      title: 'Microservices',
      description: '4 independent services: Auth, Products, Orders, Reviews'
    },
    {
      icon: '🔄',
      title: 'CI/CD Ready',
      description: 'Automated deployment pipeline with Jenkins/GitLab'
    },
    {
      icon: '📊',
      title: 'Monitored',
      description: 'Prometheus + Grafana for real-time metrics'
    },
    {
      icon: '🔒',
      title: 'Secure',
      description: 'JWT authentication, HTTPS, security best practices'
    },
    {
      icon: '🌍',
      title: 'Scalable',
      description: 'Horizontal pod autoscaling, load balancing'
    }
  ];

  const techStack = [
    'Kubernetes', 'Docker', 'Helm', 'Node.js', 'React',
    'MariaDB', 'NGINX', 'Harbor', 'Prometheus', 'Grafana'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            DevOps E-Commerce Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Microservices architecture deployed on Kubernetes with CI/CD automation
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/products"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition text-lg font-semibold"
            >
              Browse Products
            </Link>
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition text-lg font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Architecture Overview</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="container mx-auto px-4 py-16 bg-white rounded-lg shadow-lg my-8">
        <h2 className="text-3xl font-bold text-center mb-12">Technology Stack</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {techStack.map((tech, index) => (
            <span
              key={index}
              className="bg-primary-100 text-primary-700 px-6 py-2 rounded-full font-medium text-lg"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
