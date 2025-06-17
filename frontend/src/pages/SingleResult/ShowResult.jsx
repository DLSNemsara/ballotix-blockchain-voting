const ShowResult = ({ candidate, isDraw, id }) => {
  const voteCount = BigInt(candidate.votes);
  console.log(`[ShowResult] candidate:`, candidate);
  console.log(`[ShowResult] typeof voteCount:`, typeof voteCount);

  return (
    <div className="flex justify-start mx-5 mt-5 mb-3">
      <div
        className={`flex filter flex-col lg:flex-row rounded-lg ${
          id === 0 && !isDraw && voteCount > 0n
            ? "bg-winner drop-shadow-3xl shadow-card"
            : "bg-gray-200 drop-shadow-md shadow-xl"
        } ${id === 0 && isDraw && "bg-indigo-200 drop-shadow-xl shadow-xl"}`}
      >
        <div className="justify-center items-center pl-2 mx-auto my-auto">
          <img
            className="object-cover mt-3 w-32 max-w-lg h-32 rounded-full lg:h-20 lg:w-20 md:h-16 md:w-16"
            src={candidate.url}
            alt={candidate.name}
          />
          <h5 className="mb-2 font-medium text-center text-gray-900 lg:text-lg md:text-md">
            {candidate.name}
          </h5>
        </div>

        <div className="flex flex-col justify-start px-2 py-4 md:max-w-l lg:max-w-md">
          <p className="mb-4 text-sm text-gray-700">
            {candidate.description || "No description available"}
          </p>
          <div className="inline-flex items-center">
            <p
              className={`${
                !isDraw && id === 0
                  ? "text-indigo-700"
                  : isDraw && id === 0
                    ? "text-indigo-900"
                    : "text-black"
              } text-lg font-bold`}
            >
              Votes: {voteCount.toLocaleString("en-US")}
            </p>
            {id === 0 && !isDraw && voteCount > 0n && (
              <p className="flex pr-4 ml-auto text-lg font-bold text-indigo-700">
                Winner
              </p>
            )}
            {id === 0 && isDraw && (
              <p className="flex pr-4 ml-auto text-lg font-bold text-indigo-900">
                Draw
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowResult;
