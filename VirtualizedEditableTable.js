import React, { useState, useRef, useEffect } from "react";

const VirtualizedEditableTable = ({
  rows,
  columns,
  rowHeight,
  containerHeight,
  rowsPerPage = 10, // Rows per page
  pageGroupSize = 5, // Number of page buttons per group
}) => {
  const [currentPage, setCurrentPage] = useState(0); // Tracks the current page
  const [currentGroup, setCurrentGroup] = useState(0); // Tracks the current group of page numbers
  const [data, setData] = useState(rows);
  const [goToPageInput, setGoToPageInput] = useState(""); // Tracks the Go To input value
  const containerRef = useRef(null);

  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const totalGroups = Math.ceil(totalPages / pageGroupSize);

  // Calculate rows for the current page
  const pageStartIndex = currentPage * rowsPerPage;
  const visibleRows = data.slice(pageStartIndex, pageStartIndex + rowsPerPage);

  const handleCellChange = (rowIndex, columnIndex, value) => {
    const updatedData = [...data];
    updatedData[rowIndex][columnIndex] = value;
    setData(updatedData);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);

      // Adjust group if the new page is outside the current group range
      const newGroup = Math.floor(newPage / pageGroupSize);
      setCurrentGroup(newGroup);

      if (containerRef.current) {
        containerRef.current.scrollTop = 0; // Reset scroll on page change
      }
    }
  };

  const handleGroupChange = (newGroup) => {
    if (newGroup >= 0 && newGroup < totalGroups) {
      setCurrentGroup(newGroup);
      setCurrentPage(newGroup * pageGroupSize); // Jump to the first page in the new group
    }
  };

  // Calculate the range of page numbers for the current group
  const groupStartPage = currentGroup * pageGroupSize;
  const groupEndPage = Math.min(groupStartPage + pageGroupSize, totalPages);

  const handleGoToPage = () => {
    const targetPage = parseInt(goToPageInput, 10) - 1; // Convert to 0-based index
    if (!isNaN(targetPage) && targetPage >= 0 && targetPage < totalPages) {
      handlePageChange(targetPage);
    } else {
      alert("Invalid page number! Please enter a valid page.");
    }
    setGoToPageInput(""); // Clear input
  };

  return (
    <div>
      {/* Table container */}
      <div
        ref={containerRef}
        style={{
          height: `${containerHeight}px`,
          overflowY: "auto",
          position: "relative",
          border: "1px solid #ddd",
        }}
      >
        <div
          style={{
            height: `${visibleRows.length * rowHeight}px`,
            position: "relative",
          }}
        >
          {visibleRows.map((row, rowIndex) => (
            <div
              key={pageStartIndex + rowIndex}
              style={{
                display: "flex",
                position: "absolute",
                top: `${rowIndex * rowHeight}px`,
                height: `${rowHeight}px`,
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {row.map((cell, columnIndex) => (
                <input
                  key={columnIndex}
                  value={cell}
                  onChange={(e) =>
                    handleCellChange(
                      pageStartIndex + rowIndex,
                      columnIndex,
                      e.target.value
                    )
                  }
                  style={{
                    flex: 1,
                    padding: "5px",
                    border: "1px solid #ddd",
                    boxSizing: "border-box",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        {/* Previous Group Button */}
        <button
          disabled={currentGroup === 0}
          onClick={() => handleGroupChange(currentGroup - 1)}
        >
          Previous Group
        </button>

        {/* Previous Page Button */}
        <button
          disabled={currentPage === 0}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>

        {/* Page Numbers for Current Group */}
        {Array.from(
          { length: groupEndPage - groupStartPage },
          (_, index) => groupStartPage + index
        ).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            style={{
              margin: "0 5px",
              padding: "5px 10px",
              backgroundColor:
                currentPage === pageNumber ? "#007bff" : "#f1f1f1",
              color: currentPage === pageNumber ? "#fff" : "#000",
              border: "1px solid #ddd",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            {pageNumber + 1}
          </button>
        ))}

        {/* Next Page Button */}
        <button
          disabled={currentPage === totalPages - 1}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>

        {/* Next Group Button */}
        <button
          disabled={currentGroup === totalGroups - 1}
          onClick={() => handleGroupChange(currentGroup + 1)}
        >
          Next Group
        </button>

        {/* Go To Page Input */}
        <div style={{ marginTop: "10px" }}>
          <input
            type="number"
            value={goToPageInput}
            onChange={(e) => setGoToPageInput(e.target.value)}
            placeholder="Go to page"
            style={{
              width: "80px",
              padding: "5px",
              marginRight: "5px",
              textAlign: "center",
            }}
          />
          <button onClick={handleGoToPage} style={{ padding: "5px 10px" }}>
            Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualizedEditableTable;
