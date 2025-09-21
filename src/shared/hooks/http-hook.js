import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]); // useRef stores a value that persists across re-renders

  const sendRequest = useCallback(
    async (url, method = "GET", headers={}, body=null) => {
      setIsLoading(true);
      const httpAbortController = new AbortController();
      activeHttpRequests.current.push(httpAbortController);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortController.signal // links abort controller to this request
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortController);
        
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        if(err.name === 'AbortError') {
          console.log('Request was aborted');
          setIsLoading(false);
          return;
        }
        // activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortController);
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  }

  useEffect(() => {
    return () => {
        console.log('Cleanup function called, aborting all active http requests')
        activeHttpRequests.current.forEach(abortController => abortController.abort());
        // activeHttpRequests.current = [];
    }; // Cleanup function
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
