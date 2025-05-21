import { getApps, getGames } from "@/lib/file-utils"

export default async function DebugPage() {
  const apps = await getApps()
  const games = await getGames()

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Debug Information</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Environment</h2>
        <pre className="bg-slate-800 p-4 rounded overflow-auto">
          {JSON.stringify(
            {
              nodeEnv: process.env.NODE_ENV,
              cwd: process.cwd(),
            },
            null,
            2,
          )}
        </pre>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Apps ({apps.length})</h2>
        <div className="space-y-4">
          {apps.map((app) => (
            <div key={app.id} className="bg-slate-800 p-4 rounded">
              <h3 className="font-medium mb-2">{app.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-semibold">ID:</span> {app.id}
                </div>
                <div>
                  <span className="font-semibold">AI Tool:</span> {app.aiTool}
                </div>
                <div>
                  <span className="font-semibold">Model:</span> {app.model}
                </div>
                <div>
                  <span className="font-semibold">Date Added:</span> {app.dateAdded}
                </div>
                <div className="md:col-span-2">
                  <span className="font-semibold">URL:</span>
                  <a
                    href={app.fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 ml-1 hover:underline"
                  >
                    {app.fullUrl}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Games ({games.length})</h2>
        <div className="space-y-4">
          {games.map((game) => (
            <div key={game.id} className="bg-slate-800 p-4 rounded">
              <h3 className="font-medium mb-2">{game.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-semibold">ID:</span> {game.id}
                </div>
                <div>
                  <span className="font-semibold">AI Tool:</span> {game.aiTool}
                </div>
                <div>
                  <span className="font-semibold">Model:</span> {game.model}
                </div>
                <div>
                  <span className="font-semibold">Date Added:</span> {game.dateAdded}
                </div>
                <div className="md:col-span-2">
                  <span className="font-semibold">URL:</span>
                  <a
                    href={game.fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 ml-1 hover:underline"
                  >
                    {game.fullUrl}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
