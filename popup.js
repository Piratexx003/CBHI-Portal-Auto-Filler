document.getElementById('fillDataBtn').addEventListener('click', () => {
  const fileInput = document.getElementById('uploadExcel');
  const statusElement = document.getElementById('status');

  if (!fileInput.files.length) {
    statusElement.innerText = "Please select a file.";
    return;
  }

  statusElement.innerText = "Extracting data...";
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {type: 'array'});
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(worksheet, {header: 1});
    
    let structuredData = []; 
    
    // Updated to include columns 19, 20, 21 (Overall Cases)
    const targetCols = [3, 4, 5, 7, 8, 9, 11, 12, 13, 15, 16, 17, 19, 20, 21, 23, 24, 25];

    for (let i = 8; i < rows.length; i++) {
      const row = rows[i];
      
      if (!row || row.length < 5) continue;
      
      const rowString = String(row).toUpperCase();
      if (rowString.includes("NOTES:")) break;
      
      if (rowString.includes("TOTAL:ALL AGES") || rowString.includes("TOTAL: ALL AGES")) {
        continue; 
      }

      let rowValues = [];
      targetCols.forEach(colIdx => {
        let cell = row[colIdx];
        if (cell !== undefined && cell !== null && String(cell).trim() !== '') {
          rowValues.push(parseInt(cell, 10) || 0);
        } else {
          rowValues.push(0);
        }
      });
      
      structuredData.push(rowValues);
    }

    if (structuredData.length === 0) {
      statusElement.innerText = "No data found.";
      return;
    }

    statusElement.innerText = `Sending ${structuredData.length} valid rows to webpage...`;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "fillCells", 
        data: structuredData
      }, function(response) {
        if(chrome.runtime.lastError) {
             statusElement.innerText = "Error: Please refresh the web portal and try again.";
        } else if (response && response.status === "success") {
             statusElement.innerText = `Success! Inserted ${response.filledCount} rows.`;
        }
      });
    });
  };

  reader.readAsArrayBuffer(file);
});