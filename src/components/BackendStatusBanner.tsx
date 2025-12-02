import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface BackendStatusBannerProps {
  isOnline: boolean;
  lastChecked: string;
  error?: string;
}

const BackendStatusBanner = ({ isOnline, lastChecked, error }: BackendStatusBannerProps) => {
  if (isOnline) {
    return (
      <div className="mb-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
              Backend Service Online
            </h3>
            <div className="mt-1 text-sm text-green-700 dark:text-green-300">
              <p>
                All services are running normally. Last checked: {new Date(lastChecked).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Backend Service Temporarily Unavailable
          </h3>
          <div className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
            <p>
              We're currently experiencing issues with our backend service. 
              You can still browse properties using our sample data.
            </p>
            <div className="mt-2 flex items-center text-xs text-yellow-600 dark:text-yellow-400">
              <Clock className="h-3 w-3 mr-1" />
              Last checked: {new Date(lastChecked).toLocaleTimeString()}
            </div>
            {error && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs font-medium text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100">
                  Technical Details
                </summary>
                <p className="mt-1 text-xs font-mono bg-yellow-100 dark:bg-yellow-800 p-2 rounded">
                  {error}
                </p>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendStatusBanner;
