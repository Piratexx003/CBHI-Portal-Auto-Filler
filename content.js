// Helper to set native value for React/Angular portals
function setNativeValue(element, value) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  nativeInputValueSetter.call(element, value);
  const event = new Event('input', { bubbles: true });
  element.dispatchEvent(event);
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fillCells") {
    const dataRows = request.data;
    
    (async () => {
      const tableRows = document.querySelectorAll('tr');
      let dataIndex = 0;
      let rowsFilled = 0;

      // Absolute Table Cell (TD) Mapping
      // These numbers represent the exact column structural index on the webpage
      const targetTdIndices = [
        2, 3, 4,       // Gen OPD (M, F, Tr)
        6, 7, 8,       // Emerg OPD (M, F, Tr)
        10, 11, 12,    // IPD Gen (M, F, Tr)
        14, 15, 16,    // IPD Emerg (M, F, Tr)
        18, 19, 20,    // Overall Cases (M, F, Tr) - The locked columns
        22, 23, 24     // General Deaths (M, F, Tr)
      ];

      for (let tr of tableRows) {
        
        // THE BYPASS FILTER: Skip "TOTAL" rows on the webpage entirely
        const rowText = tr.innerText.toUpperCase();
        if (rowText.includes("TOTAL:ALL AGES") || rowText.includes("TOTAL: ALL AGES")) {
          continue; 
        }

        const tds = tr.querySelectorAll('td');
        
        // A valid CBHI data row has at least 25 columns
        if (tds.length >= 25 && dataIndex < dataRows.length) {
          
          let firstTargetInput = tds[2].querySelector('input');
          
          if (firstTargetInput) {
            let rowData = dataRows[dataIndex];
            
            // Loop through all 18 targets
            for(let i = 0; i < 18; i++) {
              let tdIndex = targetTdIndices[i];
              let td = tds[tdIndex];
              
              if (td) {
                let input = td.querySelector('input');
                
                // Only inject if the box exists and is empty or zero
                if (input && (input.value === "" || input.value === "0" || input.value === null)) {
                  
                  // THE LOCK PICK: Force the website to unlock the cell
                  input.readOnly = false;
                  input.disabled = false;
                  input.removeAttribute('readonly');
                  input.removeAttribute('disabled');

                  input.focus();
                  
                  // Inject the value natively
                  setNativeValue(input, rowData[i]);
                  
                  // Light Orange highlight to prove the Force-Unlock worked
                  input.style.backgroundColor = "#ffe0b2"; 
                  
                  input.dispatchEvent(new Event('change', { bubbles: true }));
                  input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                  input.blur();
                  
                  // Pause to let the portal calculate its totals safely
                  await sleep(35); 
                }
              }
            }
            rowsFilled++;
            dataIndex++;
          }
        }
      }
      
      sendResponse({status: "success", filledCount: rowsFilled});
    })();
    
    return true; 
  }
});