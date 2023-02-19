import { useEffect, useState } from "react";

export const useQuery = () => {
  const [query, setQuery] = useState<Record<string, string>>(
    {}
  );
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setQuery(Object.fromEntries(urlParams.entries()));
  }, [window.location.search]);
  return { query };
};
