"use client";

import { useEffect, useState } from "react";

export default function DataFetching() {
  const [data, setData] = useState<any>();
  useEffect(() => {
    fetch("/api/data/land?land=by")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);
  return <>{JSON.stringify(data)}</>;
}
