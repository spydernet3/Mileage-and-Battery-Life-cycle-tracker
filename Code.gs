function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Vehicle & Battery Health Tracker')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mSheet = ss.getSheetByName('Mileage') || ss.insertSheet('Mileage');
  var bSheet = ss.getSheetByName('Battery') || ss.insertSheet('Battery');
  if (mSheet.getLastRow() === 0) mSheet.appendRow(['Date', 'Last Mileage', 'KM Driven', 'Petrol Ltr', 'Bunk', 'Density', 'Mode']);
  if (bSheet.getLastRow() === 0) bSheet.appendRow(['Date', 'Plug In', 'Plug Out', 'In %', 'Out %']);
  return { mileage: mSheet, battery: bSheet };
}

// Helper: Convert 24hr "13:30" to 12hr "01:30 PM"
function format12hr(timeStr) {
  if (!timeStr || !timeStr.includes(':')) return timeStr;
  var parts = timeStr.split(':');
  var hh = parseInt(parts[0]);
  var mm = parts[1];
  var ampm = hh >= 12 ? 'PM' : 'AM';
  hh = hh % 12;
  hh = hh ? hh : 12;
  return (hh < 10 ? '0' + hh : hh) + ':' + mm + ' ' + ampm;
}

function saveMileage(data) { 
  getSpreadsheet().mileage.appendRow([data.date, data.lastMileage, data.kmDriven, data.petrolLtr, data.bunkName, data.density, data.drivenMode]); 
  return true; 
}

function saveBattery(data) { 
  getSpreadsheet().battery.appendRow([data.date, data.plugInTime, data.plugOutTime, data.plugInCharge, data.plugOutCharge]); 
  return true; 
}

function getDashboardData() {
  var sheets = getSpreadsheet();
  var mData = sheets.mileage.getDataRange().getDisplayValues();
  var bData = sheets.battery.getDataRange().getDisplayValues();
  var bRawData = sheets.battery.getDataRange().getValues();
  
  var metrics = { 
    lastMileageDate: '-', 
    bunkName: '-', 
    lastMileage: '-', 
    lastChargeDate: '-', 
    cyclesCompleted: 0, 
    lastUsageDays: '-', 
    mileageEntries: mData.slice(1), 
    batteryEntries: [] 
  };

  if (mData.length > 1) {
    var lastM = mData[mData.length - 1];
    metrics.lastMileageDate = lastM[0]; 
    metrics.lastMileage = lastM[1]; 
    metrics.bunkName = lastM[4];
  }

  if (bData.length > 1) {
    var totalCharge = 0;
    for (var i = 1; i < bData.length; i++) {
      var row = bData[i];
      var pIn = parseFloat(row[3]) || 0; 
      var pOut = parseFloat(row[4]) || 0;
      if (pOut > pIn) totalCharge += (pOut - pIn);
      metrics.batteryEntries.push([row[0], row[1], row[2], calculateHHMM(row[1], row[2]), row[3], row[4]]);
    }
    metrics.cyclesCompleted = (totalCharge / 100).toFixed(2);
    metrics.lastChargeDate = bData[bData.length - 1][0];

    // PRECISE CALCULATION FIX
    if (bRawData.length > 2) {
      var lastIdx = bRawData.length - 1;
      var prevIdx = bRawData.length - 2;
      
      // Helper to safely get HH and MM from the "Plug Out" column (Index 2)
      function getHoursMins(val) {
        if (val instanceof Date) {
          return [val.getHours(), val.getMinutes()];
        }
        var s = val.toString().split(':');
        return [parseInt(s[0]) || 0, parseInt(s[1]) || 0];
      }

      var lastOutTime = getHoursMins(bRawData[lastIdx][2]);
      var prevOutTime = getHoursMins(bRawData[prevIdx][2]);
      
      var d1 = new Date(bRawData[prevIdx][0]);
      d1.setHours(prevOutTime[0], prevOutTime[1], 0, 0);
      
      var d2 = new Date(bRawData[lastIdx][0]);
      d2.setHours(lastOutTime[0], lastOutTime[1], 0, 0);
      
      var diffMs = d2.getTime() - d1.getTime();
      
      if (!isNaN(diffMs) && diffMs > 0) {
        var preciseDays = diffMs / (1000 * 60 * 60 * 24);
        metrics.lastUsageDays = preciseDays.toFixed(2) + ' days Used at Last';
      } else {
        metrics.lastUsageDays = '0.00 days';
      }
    }
  }
  return metrics;
}

function calculateHHMM(start, end) {
  if (!start || !end) return "00:00";
  var s = start.split(':'), e = end.split(':');
  var startDate = new Date(0, 0, 0, s[0], s[1], 0);
  var endDate = new Date(0, 0, 0, e[0], e[1], 0);
  var diff = endDate.getTime() - startDate.getTime();
  if (diff < 0) diff += 86400000; 
  var hours = Math.floor(diff / 3600000);
  var mins = Math.floor((diff % 3600000) / 60000);
  return (hours < 10 ? "0"+hours : hours) + ":" + (mins < 10 ? "0"+mins : mins);
}

function deleteRecord(s, i) { var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(s); if (sheet) { sheet.deleteRow(i); return true; } return false; }
