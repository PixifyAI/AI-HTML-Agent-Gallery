import { getApps } from "@/lib/file-utils"
import Gallery from "@/components/gallery"
import AddFileButton from "@/components/add-file-button"

export default async function AppsPage() {
  const apps = await getApps()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center relative">
          <div className="absolute right-0 top-0">
            <AddFileButton type="apps" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-green-500 to-teal-500">
            AI-Generated Apps
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Single-file web applications created with agentic AI tools
          </p>
        </header>

        <Gallery items={apps} type="app" />
      </div>
    </main>
  )
}
