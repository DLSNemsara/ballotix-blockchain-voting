import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useGetResults } from "../../components/hooks/get-results";
import AuthContext from "../../store/auth-context";
import { Skeleton } from "../../components/ui/skeleton";
/**
 * Component for displaying all election results
 * @returns {JSX.Element} The AllResults component
 */
const AllResults = () => {
  const [loading, setLoading] = useState(false);
  const { results, names } = useContext(AuthContext);

  // Hook to get results
  useGetResults(setLoading);

  return (
    <>
      {!loading && results.length !== 0 && (
        <div className="flex overflow-x-hidden overflow-y-hidden flex-col mt-5">
          <div className="overflow-x-auto -my-2 sm:px-4 sm:-mx-6 lg:px-8">
            <div className="inline-block py-2 min-w-full align-middle sm:px-6 lg:px-8">
              <div>
                <h2 className="mt-5 mb-8 text-3xl font-bold text-center text-gray-900">
                  All Results
                </h2>
              </div>
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <table className="overflow-x-scroll min-w-full divide-y divide-gray-300">
                  <thead className="bg-indigo-500">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase"
                      >
                        Address
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">View Result</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {names.map(
                      (electionName, i) =>
                        results[i] !==
                          "0x0000000000000000000000000000000000000000" && (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="text-sm font-medium text-gray-900">
                                  {names[i]}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-xs text-gray-900">
                                {results[i]}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <Link
                                to={`/results/${results[i]}`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                View Result
                              </Link>
                            </td>
                          </tr>
                        )
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-5">
                <Link
                  to="/"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-md border border-transparent hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
                >
                  Home Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="mt-5 text-center">
          <h2 className="text-3xl font-bold text-gray-900">No Results Found</h2>
          <div className="mt-5">
            <Link
              to="/"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-md border border-transparent hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
            >
              Home Page
            </Link>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center mt-5 w-full">
          {/* Page Title Skeleton */}
          <div className="mb-8 w-full max-w-4xl">
            <Skeleton className="mx-auto mb-4 w-1/3 h-10" />
          </div>
          {/* Table Skeleton */}
          <div className="w-full max-w-4xl">
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                {/* Table Header Skeleton */}
                <thead className="bg-indigo-500">
                  <tr>
                    <th className="px-6 py-3">
                      <Skeleton className="w-20 h-4" />
                    </th>
                    <th className="px-6 py-3">
                      <Skeleton className="w-32 h-4" />
                    </th>
                    <th className="px-6 py-3">
                      <Skeleton className="w-16 h-4" />
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">
                        <Skeleton className="w-24 h-4" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="w-40 h-4" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Skeleton className="ml-auto w-20 h-4" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Skeleton Button */}
            <div className="flex justify-center mt-8">
              <Skeleton className="w-36 h-10 rounded-md" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllResults;
