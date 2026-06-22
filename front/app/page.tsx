export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb-1 absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-violet-700 opacity-25 blur-[120px] pointer-events-none" />
      <div className="orb-2 absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-800 opacity-20 blur-[100px] pointer-events-none" />
      <div className="orb-3 absolute top-[50%] left-[60%] w-[300px] h-[300px] rounded-full bg-indigo-700 opacity-15 blur-[80px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-900/50">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">TodoFlow</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors px-4 py-2"
          >
            Sign in
          </a>
          <a
            href="/register"
            className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-violet-900/40"
          >
            Get started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium px-4 py-1.5 rounded-full mb-8 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Simple. Focused. Productive.
        </div>

        <h1 className="text-6xl font-bold tracking-tight leading-tight max-w-2xl bg-gradient-to-b from-white via-violet-100 to-purple-400 bg-clip-text text-transparent">
          Get things done, one task at a time
        </h1>

        <p className="mt-6 text-muted text-lg max-w-md leading-relaxed">
          TodoFlow helps you organize your work, set priorities, and stay on top of what matters most.
        </p>

        <div className="flex items-center gap-4 mt-10">
          <a
            href="/register"
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-900/50 hover:shadow-violet-700/50 hover:-translate-y-0.5 text-sm"
          >
            Start for free
          </a>
          <a
            href="/login"
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-foreground font-medium rounded-xl transition-all text-sm"
          >
            Sign in
          </a>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-24 max-w-3xl w-full">
          {[
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              ),
              title: "Organize",
              desc: "Create and manage all your tasks in one clean, distraction-free space.",
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              ),
              title: "Prioritize",
              desc: "Mark tasks as high, medium, or low priority so you always know what to tackle next.",
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              ),
              title: "Track",
              desc: "Check off completed tasks and watch your progress build over time.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="relative rounded-2xl p-px bg-gradient-to-b from-violet-500/20 to-transparent"
            >
              <div className="bg-surface/60 backdrop-blur-xl rounded-2xl p-6 text-left h-full">
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    {icon}
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-muted text-xs py-6 border-t border-white/5">
        © {new Date().getFullYear()} TodoFlow. Built to keep you focused.
      </footer>
    </div>
  );
}
