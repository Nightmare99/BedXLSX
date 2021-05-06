const axios = require('axios');
const Excel = require('exceljs');

fetchHospitalData = async () => {
    
    let reqBody = {
        "searchString":"",
        "sortCondition":{"Name":1},
        "pageNumber":1,
        "pageLimit":1000,
        "SortValue":"Availability",
        "Districts":["5ea0abd2d43ec2250a483a40"],
        "BrowserId":"16df21cb442c881ab72c041e7d704543",
        "IsGovernmentHospital":true,
        "IsPrivateHospital":true,
        "FacilityTypes":["CHO","CHC","CCC"]
    }
    
    let res = await axios.post('https://tncovidbeds.tnega.org/api/hospitals', reqBody);
    let results = res.data.result;

    let data = [];
    results.forEach(item => {
        data.push({
            name: item.Name,
            type: item.Type.Name,
            landline: item.Landline,
            mobile: item.MobileNumber,
            totalBedsAlloted: item.CovidBedDetails.BedsAllotedForCovidTreatment,
            oxygenBedsAllotted: item.CovidBedDetails.AllotedO2Beds,
            oxygenBedsVacant: item.CovidBedDetails.VaccantO2Beds,
            icuBedsAlotted: item.CovidBedDetails.AllotedICUBeds,
            icuBedsVacant: item.CovidBedDetails.VaccantICUBeds,
            normalBedsAlloted: item.CovidBedDetails.OccupancyNonO2Beds,
            normalBedsVacant: item.CovidBedDetails.VaccantNonO2Beds,
            mapLink: `https://www.google.com/maps/search/?api=1&query=${item.Latitude},${item.Longitude}`
        });
    }); 
    console.log("Bed Data fetched.");
    return data;
}

writeXLSX = (data) => {
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile('sheet.xlsx')
        .then(function() {
            workbook.removeWorksheet("Sheet1");
            workbook.addWorksheet("Sheet1");
            var worksheet = workbook.getWorksheet("Sheet1");
            worksheet.columns = [
                { header: 'Name', key: 'name', width: 32 },
                { header: 'Hospital type', key: 'type', width: 32 },
                { header: 'Landline', key: 'landline', width: 15},
                { header: 'Mobile', key: 'mobile', width: 15},
                { header: 'Normal Beds Occupied', key: 'normalBedsAlloted', width: 32},
                { header: 'Normal Beds Vacant', key: 'normalBedsVacant', width: 32},
                { header: 'Beds with Oxygen Occupied', key: 'oxygenBedsAllotted', width: 32},
                { header: 'Beds with Oxygen Vacant', key: 'oxygenBedsVacant', width: 32},
                { header: 'ICU Beds Occupied', key: 'icuBedsAlotted', width: 32},
                { header: 'ICU Beds Vacant', key: 'icuBedsVacant', width: 32},
                { header: 'Location', key: 'mapLink', width: 32},
              ];
            data.forEach(item => {
                worksheet.addRow(item);
                // console.log(item);
            });

            return workbook.xlsx.writeFile('sheet.xlsx');
        });
}



let rowData = fetchHospitalData()
    .then(data => {
        writeXLSX(data);
    });
