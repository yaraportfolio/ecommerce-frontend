export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">DevOps E-Commerce</h3>
            <p className="text-gray-400">
              A production-ready microservices platform showcasing modern
              DevOps practices and cloud-native architecture on Kubernetes.
            </p>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="text-xl font-bold mb-4">Technologies</h3>
            <ul className="text-gray-400 space-y-2">
              <li>• Kubernetes & Helm</li>
              <li>• Docker & Harbor</li>
              <li>• CI/CD (Jenkins/GitLab)</li>
              <li>• Prometheus & Grafana</li>
            </ul>
          </div>

          {/* Portfolio */}
          <div>
            <h3 className="text-xl font-bold mb-4">Portfolio Project</h3>
            <p className="text-gray-400">
              Created by: <strong>YARA Mahi Mohamed</strong>
              <br />
              Cloud & DevOps Engineer
              <br />
              7 Active Cloud Certifications
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 DevOps E-Commerce Platform - Portfolio Project</p>
        </div>
      </div>
    </footer>
  );
}
