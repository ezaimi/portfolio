import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { ALL_PROJECTS } from '../data/index'
import DevProjectPage from './project-layouts/DevProjectPage'
import UiuxProjectPage from './project-layouts/UiuxProjectPage'
import ProductDesignProjectPage from './project-layouts/ProductDesignProjectPage'

const mono = {
  fontFamily: '"Courier New", Courier, monospace',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
}

const LAYOUTS = {
  'Development':   DevProjectPage,
  'UI / UX Design': UiuxProjectPage,
  'Product Design': ProductDesignProjectPage,
}

export default function ProjectPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const project  = ALL_PROJECTS.find((p) => p.id === Number(id))

  if (!project) {
    return (
      <div style={{ backgroundColor: '#0c0c0c', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ padding: '160px 52px', flex: 1 }}>
          <p style={{ ...mono, fontSize: '0.85rem', color: '#909090' }}>Project not found.</p>
          <button onClick={() => navigate(-1)} style={{ ...mono, fontSize: '0.85rem', color: '#F9F3E2', background: 'none', border: 'none', cursor: 'pointer', marginTop: '24px' }}>
            Back
          </button>
        </main>
      </div>
    )
  }

  const prevProject = ALL_PROJECTS.find((p) => p.id === project.id - 1) ?? null
  const nextProject = ALL_PROJECTS.find((p) => p.id === project.id + 1) ?? null

  const Layout = LAYOUTS[project.category] ?? ProductDesignProjectPage

  return <Layout project={project} prevProject={prevProject} nextProject={nextProject} />
}
