

import  { useEffect, useState } from 'react';
import axios from 'axios';

const NewsComponent = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
            `https://newsapi.org/v2/everything?q=technology OR tech OR innovation OR software OR hardware OR AI OR "machine learning" OR blockchain OR internships OR jobs OR careers OR employment OR recruitment OR "job market" OR "hiring trends" OR "IT firms" OR MNCs OR corporations OR enterprise OR "big tech" OR startups OR "Silicon Valley" OR professions OR "industry trends" OR workplace OR "professional development" OR leadership OR management OR upskilling OR reskilling OR talent OR HR&language=en&sortBy=publishedAt&apiKey=f5713111279f4950bf2141aff6a922b2`

        );
        setArticles(response.data.articles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-xs">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-900">Connect News</h2>
        <span className="text-gray-400 text-sm">
          <i className="fas fa-info-circle"></i>
        </span>
      </div>
      <h3 className="text-gray-700 text-sm mb-1">Top stories</h3>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          articles
            .slice(0, expanded ? 10 : 5)
            .map((article, index) => (
              <div key={index} className="mb-2">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 text-sm hover:underline font-semibold"
                >
                  {article.title}
                </a>
                <div className="text-gray-500 text-xs">
                  {new Date(article.publishedAt).toLocaleDateString()} ago &middot;{" "}
                  {Math.floor(Math.random() * 10000)} readers
                </div>
              </div>
            ))
        )}
      </div>
      <button
        onClick={handleToggle}
        className="mt-4 text-gray-700 text-sm hover:underline"
      >
        Show {expanded ? "less" : "more"} <i className={`fas fa-chevron-${expanded ? "up" : "down"}`}></i>
      </button>
    </div>
  );
};

export default NewsComponent;
