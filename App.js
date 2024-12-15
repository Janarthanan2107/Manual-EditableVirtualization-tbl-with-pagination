import React, { useState, useEffect } from "react";
import "./styles.css";
import VirtualizedEditableTable from "./VirtualizedList.js";

export default function App() {
  const [rows, setRows] = useState([]);
  const [containerHeight, setContainerHeight] = useState(
    window.innerHeight * 0.74
  );

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/photos"
        );
        const data = await response.json();

        // Transform the data for your table structure
        const formattedRows = data
          .slice(0, 5000)
          .map((item) => [
            item.id,
            item.title,
            item.url,
            item.thumbnailUrl,
            `Row ${item.id} Extra Data`,
          ]);

        setRows(formattedRows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Update container height on window resize
    const handleResize = () => {
      setContainerHeight(window.innerHeight * 0.74); // Adjust as needed
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log(rows, "rows");

  return (
    <div className="App">
      {rows.length > 0 ? (
        <VirtualizedEditableTable
          rows={rows}
          setRows={setRows}
          columns={5}
          rowHeight={40}
          containerHeight={containerHeight}
        />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}
