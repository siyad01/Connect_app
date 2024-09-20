
const recommendations = [
  {
    name: "Sajad T P",
    title: "Computer Science Engineer",
    imgSrc: "https://via.placeholder.com/50",
    connectionLevel: "1st",
    action: "Message",
  },
  {
    name: "Anamika M.K",
    title: "Final Year Computer Science Engineering Student",
    imgSrc: "https://via.placeholder.com/50",
    connectionLevel: "2nd",
    action: "Connect",
  },
  {
    name: "Habib Nidal",
    title: "Final Year Computer Science Engineering Student",
    imgSrc: "https://via.placeholder.com/50",
    connectionLevel: "2nd",
    action: "Connect",
  },
  {
    name: "Adarsh C O",
    title: "Python Full Stack Developer",
    imgSrc: "https://via.placeholder.com/50",
    connectionLevel: "1st",
    action: "Message",
  },
  {
    name: "Amretha K",
    title: "B.Tech Computer Science | Skilled in Python, Java and W...",
    imgSrc: "https://via.placeholder.com/50",
    connectionLevel: "1st",
    action: "Message",
  },
];

const Recommendations = () => {
  return (
    <div className="bg-white w-full rounded-lg shadow-md p-4">
      <h2 className="text-gray-700 text-sm font-semibold mb-4">
        Others that may be interesting
      </h2>
      <div className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={recommendation.imgSrc}
                alt={recommendation.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-3">
                <p className="text-gray-800 text-sm font-medium">
                  {recommendation.name} • {recommendation.connectionLevel}
                </p>
                <p className="text-gray-600 text-sm">
                  {recommendation.title}
                </p>
              </div>
            </div>
            <button
              className={`text-sm font-medium py-1 px-3 rounded-full ${
                recommendation.action === "Message"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-blue-600 text-white"
              }`}
            >
              {recommendation.action === "Message" ? (
                <span>&#9993; Message</span>
              ) : (
                <span>&#128101; Connect</span>
              )}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button className="w-full py-2 text-blue-600 font-medium">
          Show all
        </button>
      </div>
    </div>
  );
};

export default Recommendations;
