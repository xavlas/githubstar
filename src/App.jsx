import { useState, useEffect } from 'react';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { Star, GitFork, CircleAlert, TrendingUp, Calendar, Code2, Globe } from 'lucide-react';

const TIMEFRAMES = [
  { id: 'daily', label: 'Today' },
  { id: 'weekly', label: 'This Week' },
  { id: 'monthly', label: 'This Month' },
  { id: 'yearly', label: 'This Year' },
];

const LANGUAGES = [
  'All', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin'
];

function App() {
  const [timeframe, setTimeframe] = useState('daily');
  const [language, setLanguage] = useState('All');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let date;
        const now = new Date();
        switch (timeframe) {
          case 'daily': date = subDays(now, 1); break;
          case 'weekly': date = subDays(now, 7); break;
          case 'monthly': date = subMonths(now, 1); break;
          case 'yearly': date = subYears(now, 1); break;
          default: date = subDays(now, 1);
        }
        
        const dateStr = format(date, 'yyyy-MM-dd');
        let q = `created:>${dateStr}`;
        if (language !== 'All') {
          q += ` language:${language}`;
        }
        
        const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=30`);
        
        if (!res.ok) {
          if (res.status === 403) throw new Error("GitHub API rate limit exceeded. Please try again later.");
          throw new Error(`GitHub API Error: ${res.status}`);
        }
        
        const data = await res.json();
        setRepos(data.items || []);
        setLastUpdated(new Date());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
    
    // Polling every 10 minutes
    const interval = setInterval(() => {
      fetchTrending();
    }, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [timeframe, language]);

  return (
    <div className="min-h-screen bg-background text-gray-200 font-sans selection:bg-primary/30">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-white">GitHub<span className="font-light text-gray-400">Trends</span></h1>
          </div>
          
          <div className="flex gap-2 p-1 bg-surface rounded-xl border border-border">
            {TIMEFRAMES.map(tf => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  timeframe === tf.id 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-surface-hover'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar / Filters */}
          <div className="w-full md:w-64 shrink-0">
            <div className="sticky top-28 space-y-6">
              <div>
                <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-4 flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  Languages
                </h3>
                <div className="flex flex-col gap-1">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`text-left px-3 py-2 text-sm rounded-lg transition-colors flex justify-between items-center ${
                        language === lang 
                          ? 'bg-primary/20 text-primary font-medium' 
                          : 'text-gray-400 hover:text-gray-200 hover:bg-surface'
                      }`}
                    >
                      {lang}
                      {language === lang && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">
                Trending {language === 'All' ? 'Repositories' : `${language} Repositories`}
              </h2>
              <div className="flex items-center gap-4">
                {lastUpdated && (
                  <div className="text-xs text-gray-500 hidden sm:block">
                    Updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-400 bg-surface px-3 py-1.5 rounded-full border border-border">
                  <Calendar className="w-4 h-4" />
                  <span>{TIMEFRAMES.find(t => t.id === timeframe)?.label}</span>
                </div>
              </div>
            </div>

            {error ? (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3">
                <CircleAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-surface border border-border rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-10 h-10 bg-surface-hover rounded-full shrink-0" />
                        <div className="h-5 bg-surface-hover rounded w-1/3" />
                      </div>
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="h-4 bg-surface-hover rounded w-3/4" />
                      <div className="h-4 bg-surface-hover rounded w-1/2" />
                    </div>
                    <div className="flex gap-4">
                      <div className="h-4 bg-surface-hover rounded w-16" />
                      <div className="h-4 bg-surface-hover rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : repos.length === 0 ? (
              <div className="text-center py-20 bg-surface/50 rounded-xl border border-border border-dashed">
                <Globe className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-gray-300">No trending repositories found</h3>
                <p className="text-gray-500 mt-1">Try selecting a different language or timeframe.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {repos.map((repo, index) => (
                  <a 
                    key={repo.id} 
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="group bg-surface hover:bg-surface-hover border border-border hover:border-border/80 transition-all duration-300 rounded-xl p-6 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-500 w-6">#{index + 1}</span>
                        <img 
                          src={repo.owner.avatar_url} 
                          alt={repo.owner.login} 
                          className="w-8 h-8 rounded-full ring-2 ring-border/50 group-hover:ring-primary/30 transition-all"
                          loading="lazy"
                        />
                        <h3 className="text-lg font-semibold text-primary group-hover:text-primary-hover truncate max-w-[200px] sm:max-w-md">
                          <span className="font-normal text-gray-400">{repo.owner.login} / </span>
                          {repo.name}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm mt-3 mb-5 line-clamp-2 pl-11">
                      {repo.description || "No description provided."}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-400 pl-11">
                      {repo.language && (
                        <div className="flex items-center gap-1.5 bg-background px-2.5 py-1 rounded-md border border-border/50">
                          <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                          <span>{repo.language}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
                        <Star className="w-4 h-4" />
                        <span>{repo.stargazers_count.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 hover:text-white transition-colors">
                        <GitFork className="w-4 h-4" />
                        <span>{repo.forks_count.toLocaleString()}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
