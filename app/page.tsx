import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Gallery from "@/components/gallery"
import { getApps, getGames } from "@/lib/file-utils"
import AddFileButton from "@/components/add-file-button"

export default async function Home() {
  const apps = await getApps()
  const games = await getGames()
  const allItems = [...apps, ...games]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-green-500 to-teal-500">
            AI HTML Creative Web Gallery
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Generate innovative single-file apps & games using our integrated agent, or upload your AI creations.
Explore community favorites, share your work, and discuss which impress the most!
          </p>
        </header>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="apps">Apps</TabsTrigger>
              <TabsTrigger value="games">Games</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <div data-state-apps className="hidden data-[state-apps=true]:block">
                <AddFileButton type="apps" />
              </div>
              <div data-state-games className="hidden data-[state-games=true]:block">
                <AddFileButton type="games" />
              </div>
            </div>
          </div>
          <TabsContent value="all" tabIndex={-1}>
            <div data-state-all="true" />
            <div data-state-apps="false" />
            <div data-state-games="false" />
            <Gallery items={allItems} type="all" />
          </TabsContent>
          <TabsContent value="apps" tabIndex={-1}>
            <div data-state-all="false" />
            <div data-state-apps="true" />
            <div data-state-games="false" />
            <Gallery items={apps} type="app" />
          </TabsContent>
          <TabsContent value="games" tabIndex={-1}>
            <div data-state-all="false" />
            <div data-state-apps="false" />
            <div data-state-games="true" />
            <Gallery items={games} type="game" />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
