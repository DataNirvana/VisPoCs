//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/* 
    Code to support the visualisation of the information in an infographic for persons of concern (refugees, asylum seekers, stateless etc) to Europe.

    When adding new charts, just three methods need changing - LoadData, UpdateAllCharts, GetValue
    You will also need to add the root and temp array declarations

    Version:  January 2020 - v1.3
    #########################################################################
    Copyright © 2020 Edgar Scrase

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
    #########################################################################
*/



//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*
 *  Handles the responsive redrawing of the visualisation
 *  It's like driving responsibly - geddit?!
*/
function DrawResponsively() {

    //--00-- Get the width and height of the browser (stored in Site.js)
    let { docWidth, docHeight } = dn.WidthAndHeight();
    //    let docWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    //    let docHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    //--01-- And if there is an iFrame defined, then it is because our data visualisation is embedded in e.g. the data portal...
    if (dn.IsDefined(urlEditor.GetParentUrl())) {
        let iframeList = document.getElementsByTagName('iframe');
        if (dn.IsDefined(iframeList) && iframeList.length > 0) {
            docWidth = iframeList[0].getAttribute('width');
            docHeight = iframeList[0].getAttribute('height');
        }
    }

    //--02-- We want to ignore small browser movements, otherwise we continue
    if (lastDrawResponsivelyWidth === 0) {                                                  // First use - Set a good initial if the last width has not yet been set...
        lastDrawResponsivelyWidth = docWidth;
    } else if (Math.abs(lastDrawResponsivelyWidth - docWidth) < 20) { // Ignore small browser movements...
        return;
    } else {                                                                                                        // Otherwise, update and continue...
        lastDrawResponsivelyWidth = docWidth;
    }

    //    console.log(docWidth, docHeight);

    /*
     *  --03-- 5 responsive views based on the width of the browser: 
     *      a) Big > 1920 * 1080 - this is about 30% of users globally
     *      b) 1920 * 1080 and 1366 * 768 - surprisingly small now compared to newer monitors available - about 15% of users globally
     *          We only show 10 CoO's and 10 CoArs so the Sankey etc can be shorter.  We also move the summary, the settings and the population type above the other charts so it's narrower
     *      c) Large tablets and smart phones; small laptops - 3 columns, with the Sankey taking two and the map taking three.
     *      d) Width between 600 and 992 - show two channels for the Summary and settings and CoO and CoAR, then one for the year (as a bar chart not a column chart) and one for the Sankey and the Map
     *      e) Width < 600 - Just one column, and dont show the map or the sankey as they are too detailed.  Well, maybe the Sankey then...
     */
    let responsiveMode = 1;             // Big default
    if (docWidth <= 600) {                  // Is small mobile
        responsiveMode = 5;
    } else if (docWidth <= 992) {       // Average IPAD or smart phone
        responsiveMode = 4;
    } else if (docWidth <= 1600) {       // Gucci IPAD or smart phone or small web browser
        responsiveMode = 3;
    } else if (docWidth <= 1920) {    // Average web browser
        responsiveMode = 2;
    }


    console.log("ResponsiveMode: " + responsiveMode);

    //--04-- Then letsLets set the parameters accordingly ...
    let yMap = -1000;
    let ySankey = 0;
    let xMapAndSankey = 600;
    let wMapAndSankey = 780;
    let showOriginCharts = true;

    //--05-- Special case 1 - Jan-20 - if the toggle map or flow is toggled off, swap them around
    if (document.getElementById("ToggleMapOrFlow").checked === false) {
        yMap = 0;
        ySankey = -1000;
    }

    //--06-- Special case 2 - Account for prefiltered data when the CoO list length is 1 and the CoAR are not filtered (e.g. Ukrainians abroad)
    // In this case we want to show the map, and hide the RoO and CoO charts
    if (filterListCoO.length === 1 && (filterListCoAR.length === 0 || filterOperation === true)) {
        yMap = 0;
        ySankey = -1000;

        xMapAndSankey = 260;
        wMapAndSankey = 1120;

        // Toggle the toggle button so that it is set to "Show Map"
        // We have to use the root element - by - id option as this triggers the CSS wrapper to change for the switch button
        document.getElementById("ToggleMapOrFlow").checked = false;

        showOriginCharts = false;

    } else {
        // Only in this instance do we draw the region of origin and country of origin charts ....
    }


    let visWidth = 0;

    //--07-- Apply the relevant sizes to the DCO object...
    if (responsiveMode === 1) {
        //**************************************************************CASE 1***** BIG Screens

        DCO["MaxNumToVisualise"] = 19;

        // Chart object [X,W,W,H,...]
        DCO["X1"] = [0, 0, 250, 300]; // Summary ...  
        DCO["X2"] = [0, 720, 250, 270]; // Settings
        DCO["PT"] = [0, 310, 250, 400]; // Population Type

        DCO["GR"] = [260, 0, 330, 300, showOriginCharts]; // Region of origin
        DCO["CP"] = [260, 310, 330, 400, showOriginCharts]; // Country of origin
        DCO["ER"] = [1390, 0, 330, 300, cTitleRoARLong]; // Europe region of asylum / residence
        DCO["CS"] = [1390, 310, 330, 400, cTitleCoARLong]; // European country of asylum / residence

        DCO["SA"] = [xMapAndSankey, ySankey, wMapAndSankey, 710, true]; // Sankey
        DCO["CR"] = [xMapAndSankey, yMap, wMapAndSankey, 710, true]; // Map - in this case we draw it ...

        DCO["YE"] = [260, 720, 1460, 270];

        d3.select(".ResetWidget").attr("class", "ResetWidget ResetWidget1");
        d3.select(".ShareWidget").attr("class", "ShareWidget ShareWidget1");
        d3.select(".ToggleWidget").attr("class", "ToggleWidget ToggleWidget1");

        d3.select(".PoCTotal").attr("class", "PoCTotal PoCTotal1");
        d3.select(".YearWrapper").attr("class", "YearWrapper YearWrapper1");
        d3.select(".YearComparisonWrapper").attr("class", "YearComparisonWrapper YearComparisonWrapper1");

        dn.defaultMapZoomLevel = 4;

        visWidth = 1720;
        d3.select(".VisWrapperPoCs")
            .style("width", visWidth + "px")
            .style("min-height", "1030px");

    } else if (responsiveMode === 2) {
        //**************************************************************CASE 2***** Average desktops

        // We just show the 10 most common on smaller screens...
        DCO["MaxNumToVisualise"] = 10;

        // Chart object [X,W,W,H,...]
        DCO["X1"] = [10, 0, 900, 95]; // Summary ...  
        DCO["X2"] = [920, 0, 550, 95]; // Settings
        DCO["PT"] = [10, 655, 330, 250]; // Population Type

        DCO["GR"] = [10, 105, 330, 300, showOriginCharts]; // Region of origin
        DCO["CP"] = [10, 415, 330, 230, showOriginCharts]; // Country of origin
        DCO["ER"] = [1140, 105, 330, 300, cTitleRoARLong]; // Europe region of asylum / residence
        DCO["CS"] = [1140, 415, 330, 230, cTitleCoARLong]; // European country of asylum / residence

        ySankey = (ySankey === 0) ? 105 : -1000;
        yMap = (yMap === 0) ? 105 : -1000;

        DCO["SA"] = [xMapAndSankey - 260 + 10, ySankey, wMapAndSankey, 540, true]; // Sankey
        DCO["CR"] = [xMapAndSankey - 260 + 10, yMap, wMapAndSankey, 540, true]; // Map - in this case we draw it ...

        DCO["YE"] = [350, 655, 1120, 250];

        d3.select(".PoCTotal").attr("class", "PoCTotal PoCTotal2");
        d3.select(".YearWrapper").attr("class", "YearWrapper YearWrapper2");
        d3.select(".YearComparisonWrapper").attr("class", "YearComparisonWrapper YearComparisonWrapper2");

        d3.select(".ResetWidget").attr("class", "ResetWidget ResetWidget2");
        d3.select(".ShareWidget").attr("class", "ShareWidget ShareWidget2");
        d3.select(".ToggleWidget").attr("class", "ToggleWidget ToggleWidget2");

        dn.defaultMapZoomLevel = 4;

        visWidth = 1470;
        d3.select(".VisWrapperPoCs")
            .style("width", visWidth + "px")
            .style("min-height", "950px");

    } else if (responsiveMode === 3) {
        //**************************************************************CASE 3***** Gucci Tablets and smart phones
        // We are going to show three columns where possible with this visualisation

        // We just show the 10 most common on smaller screens...
        DCO["MaxNumToVisualise"] = 10;

        // Three columns which will be the width - 10px padding left and right and in between the columns
        let colWidth = Math.floor((docWidth - 50) / 3); // An extra 10 for the scroller div...
        let doubleColWidth = (colWidth * 2) + 10;
        let tripleColWidth = (colWidth * 3) + 20;
        let xCol2L = colWidth + 20;
        let xCol3L = xCol2L + colWidth + 10;

        // Chart object [X,W,W,H,...]
        DCO["X1"] = [10, 0, colWidth, 230]; // Summary ...  
        DCO["X2"] = [10, 240, colWidth, 95]; // Settings
        DCO["PT"] = [xCol2L, 0, colWidth, 335]; // Population Type

        DCO["GR"] = [xCol3L, 0, colWidth, 335, true]; // Region of origin
        DCO["CP"] = [xCol3L, 345, colWidth, 230, true]; // Country of origin
        DCO["ER"] = [xCol3L, 585, colWidth, 300, cTitleRoARShort]; // Europe region of asylum / residence
        DCO["CS"] = [xCol3L, 895, colWidth, 230, cTitleCoARShort]; // European country of asylum / residence

        DCO["SA"] = [10, 345, doubleColWidth, 780, true]; // Sankey
        DCO["CR"] = [10, 1395, tripleColWidth, 640, true]; // Map - in this case we draw it ...

        DCO["YE"] = [10, 1135, tripleColWidth, 250];

        d3.select(".PoCTotal").attr("class", "PoCTotal PoCTotal1");
        d3.select(".YearWrapper").attr("class", "YearWrapper YearWrapper1");
        d3.select(".YearComparisonWrapper").attr("class", "YearComparisonWrapper YearComparisonWrapper1");

        d3.select(".ResetWidget").attr("class", "ResetWidget ResetWidget4");
        d3.select(".ShareWidget").attr("class", "ShareWidget ShareWidget4");
        d3.select(".ToggleWidget").attr("class", "ToggleWidget ToggleWidget4");

        dn.defaultMapZoomLevel = 4;

        d3.select(".VisWrapperPoCs")
            .style("width", "100%")
            .style("min-height", "2050px");

        visWidth = docWidth;

    } else if (responsiveMode === 4) {
        //**************************************************************CASE 4***** Tablets

        // We just show the 10 most common on smaller screens...
        DCO["MaxNumToVisualise"] = 10;

        // Two columns which will be the width - 10px padding left and right and in the middle
        let colWidth = Math.floor((docWidth - 40) / 2); // An extra 10 for the scroller div...
        let doubleColWidth = (colWidth * 2) + 10;
        let xCol2L = colWidth + 20;

        // Chart object [X,W,W,H,...]
        DCO["X1"] = [10, 0, colWidth, 230]; // Summary ...  
        DCO["X2"] = [10, 240, colWidth, 95]; // Settings
        DCO["PT"] = [xCol2L, 0, colWidth, 335]; // Population Type

        let heightAdj = 0;

        if (showOriginCharts) {
            DCO["GR"] = [10, 345, colWidth, 300, showOriginCharts]; // Region of origin
            DCO["CP"] = [10, 655, colWidth, 230, showOriginCharts]; // Country of origin
            DCO["ER"] = [xCol2L, 345, colWidth, 300, cTitleRoARShort]; // Europe region of asylum / residence
            DCO["CS"] = [xCol2L, 655, colWidth, 230, cTitleCoARShort]; // European country of asylum / residence

        } else {
            // Two less charts so shorter...
            heightAdj = 240;

            DCO["GR"] = [0, 0, colWidth, 300, showOriginCharts]; // Region of origin
            DCO["CP"] = [0, 0, colWidth, 230, showOriginCharts]; // Country of origin
            DCO["ER"] = [10, 345, colWidth, 300, cTitleRoARShort]; // Europe region of asylum / residence
            DCO["CS"] = [xCol2L, 345, colWidth, 300, cTitleCoARShort]; // European country of asylum / residence
        }

        DCO["SA"] = [10, 1155 - heightAdj, doubleColWidth, 540, true]; // Sankey
        DCO["CR"] = [10, 1705 - heightAdj, doubleColWidth, 640, true]; // Map - in this case we draw it ...

        DCO["YE"] = [10, 895 - heightAdj, doubleColWidth, 250];

        d3.select(".PoCTotal").attr("class", "PoCTotal PoCTotal1");
        d3.select(".YearWrapper").attr("class", "YearWrapper YearWrapper1");
        d3.select(".YearComparisonWrapper").attr("class", "YearComparisonWrapper YearComparisonWrapper1");

        d3.select(".ResetWidget").attr("class", "ResetWidget ResetWidget4");
        d3.select(".ShareWidget").attr("class", "ShareWidget ShareWidget4");
        d3.select(".ToggleWidget").attr("class", "ToggleWidget ToggleWidget4");

        dn.defaultMapZoomLevel = 4;

        d3.select(".VisWrapperPoCs")
            .style("width", "100%")
            .style("min-height", (2360 - heightAdj) + "px");

        visWidth = docWidth;

    } else if (responsiveMode === 5) {
        //**************************************************************CASE 5***** Small mobile phones ..

        // We just show the 10 most common on smaller screens...
        DCO["MaxNumToVisualise"] = 10;

        // Two columns which will be the width - 10px padding left and right and in the middle
        let colWidth = (docWidth - 20); // An extra 10 for the scroller div...

        // Chart object [X,W,W,H,...]
        DCO["X1"] = [5, 0, colWidth, 220]; // Summary ...  
        DCO["X2"] = [5, 230, colWidth, 95]; // Settings
        DCO["PT"] = [5, 335, colWidth, 270]; // Population Type

        let heightAdj = 0;

        if (showOriginCharts) {
            DCO["GR"] = [5, 615, colWidth, 300, showOriginCharts]; // Region of origin
            DCO["CP"] = [5, 925, colWidth, 230, showOriginCharts]; // Country of origin
            DCO["ER"] = [5, 1165, colWidth, 300, cTitleRoARShort]; // Europe region of asylum / residence
            DCO["CS"] = [5, 1475, colWidth, 230, cTitleCoARShort]; // European country of asylum / residence

        } else {
            // Two less charts so shorter...
            heightAdj = 550;

            DCO["GR"] = [0, 0, colWidth, 300, showOriginCharts]; // Region of origin
            DCO["CP"] = [0, 0, colWidth, 230, showOriginCharts]; // Country of origin
            DCO["ER"] = [5, 1165 - heightAdj, colWidth, 300, cTitleRoARShort]; // Europe region of asylum / residence
            DCO["CS"] = [5, 1475 - heightAdj, colWidth, 230, cTitleCoARShort]; // European country of asylum / residence
        }

        DCO["SA"] = [5, 1975 - heightAdj, colWidth, 540, true]; // Sankey
        DCO["CR"] = [5, 2525 - heightAdj, colWidth, 640, true]; // Map - in this case we draw it ...

        DCO["YE"] = [5, 1715 - heightAdj, colWidth, 250];

        d3.select(".PoCTotal").attr("class", "PoCTotal PoCTotal1");
        d3.select(".YearWrapper").attr("class", "YearWrapper YearWrapper1");
        d3.select(".YearComparisonWrapper").attr("class", "YearComparisonWrapper YearComparisonWrapper1");

        d3.select(".ResetWidget").attr("class", "ResetWidget ResetWidget5");
        d3.select(".ShareWidget").attr("class", "ShareWidget ShareWidget5");
        d3.select(".ToggleWidget").attr("class", "ToggleWidget ToggleWidget4");

        dn.defaultMapZoomLevel = 3;

        d3.select(".VisWrapperPoCs")
            .style("width", "100%")
            .style("min-height", (3180 - heightAdj) + "px");

        visWidth = docWidth;
    }


    //--08-- Set the widths of the title and footer
    d3.select(".VisTitle").style("width", (docWidth - 20) + "px").style("margin", 10 + "px");
    d3.select("#PoCsFooter").style("width", (docWidth - 30) + "px").style("margin", 10 + "px");
    //    d3.select("Body").style("min-width", (visWidth - 20) + "px");

    //--09-- Remove the chart objects and the div that wraps them as they will be redrawn
    let chartList = chartGroup.Charts();
    if (dn.IsDefined(chartList) && chartList.length > 0) {
        for (let i = 0; i < chartList.length; i++) {
            // CR is the map - we dont want to remove that...
            if (chartList[i].ChartID !== "CR") {

                d3.selectAll("#" + chartList[i].ChartID).remove();
                d3.selectAll("#" + chartList[i].ChartID + "Div").remove();
            }
        }
    }

    //--10-- Then lets redraw the visualisation (and we do the responsive redraw in a timeout to catch for and minimise the work associated with multiple consecutive drag events)
    if (!dn.IsDefined(initialURL)) {

        // Clear any existing timeout and set the new one
        clearTimeout(responsiveTimeout);
        responsiveTimeout = window.setTimeout("VisualiseData();", 100);
    } else {
        // First load, lets get straight to it
        VisualiseData();
    }
}




//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function VisualiseData() {
    // Check what is going on...
    //console.log("Vis data: ", chartGroup.origJSData.length, chartGroup.filteredJSData.length, chartGroup.objsToFilter);

    //----- SECTION 1 - DEFINE PARAMETERS -----

    //--X01-- Set the dynamically generated data attributes (default is probably 19)
    let maxNumToVisualise = DCO["MaxNumToVisualise"];
    chartGroup.SetDynamicallyGeneratedDataAttribute("CP", "MaxNumValues", maxNumToVisualise);
    chartGroup.SetDynamicallyGeneratedDataAttribute("CS", "MaxNumValues", maxNumToVisualise);
      
        
    //----- SECTION 2 - DRAW THE CHARTS -----

    //--CHART-01-- Draw the column chart
    let y2 = dn.Chart();
    y2.ColumnChart("YE", "DataVis", chartGroup, DCO["YE"][0], DCO["YE"][1], DCO["YE"][2], DCO["YE"][3], 42, "CChart4", false, 0, "", yearDescriptionList, "Year", true, false);
    y2.DrawColumnChart(y2FullDataRange);

   
    //--CHART-02-- Population Type
    // UNHCR colours: colourbrewer.UNHCRPoCs[1]
    new DNChart().PieChart("PT", "DataVis", chartGroup, DCO["PT"][0], DCO["PT"][1], DCO["PT"][2], DCO["PT"][3], 10, colourRampPT, ListPT, "Type of population", true);
    
    // Charts for the region and country of origin are not shown if the CoO has been prefiltered, so we need to manage this here.
    if (DCO["GR"][4] === true) {

        //--CHART-03-- Origin region
        let rooChart = new DNChart();
        rooChart.BarChart("GR", "DataVis", chartGroup, DCO["GR"][0], DCO["GR"][1], DCO["GR"][2], DCO["GR"][3], 150, "BChart1", true, 30, "", ListGlobalRegions, "Region of origin", true);

        //--CHART-04-- Origin country CO/CP
        let cooChart = new DNChart();
        cooChart.BarChart("CP", "DataVis", chartGroup, DCO["CP"][0], DCO["CP"][1], DCO["CP"][2], DCO["CP"][3], 150, "BChart1", true, 30, "", ListCO, "Country of origin", true);

    } else {
        // Remove them if they existed already...
        d3.selectAll("#GR").remove();
        d3.selectAll("#GRDiv").remove();
        d3.selectAll("#CP").remove();
        d3.selectAll("#CPDiv").remove();
    }
            
    //--CHART-05-- Do a map CR    
    let mapGraphic = new DNChart();
        mapGraphic.Map("CR", null, "DataVis", chartGroup, DCO["CR"][0], DCO["CR"][1], DCO["CR"][2], DCO["CR"][3], ListCR, null, "Country of asylum / residence in Europe",
            dn.defaultMapCentroid, dn.defaultMapZoomLevel, false);

    // Set the max value for the maps and then draw the map itself
    mapGraphic.SetMapMaxValue(maxMapValue);    
    // Draw the map
    mapGraphic.DrawMap(chartGroup.GetInfoIDNumericKey("CR"), chartGroup.GetInfoIDNumericKey(null));

        
    //--CHART-06-- Do a Sankey CO/CP and CR/CS
    let sankeyChart = new DNChart();  

    sankeyChart.SankeyChart("SA", "DataVis", chartGroup, DCO["SA"][0], DCO["SA"][1], DCO["SA"][2], DCO["SA"][3], true, colourbrewer["UNHCRBlue"][1], colourbrewer["UNHCRRed"][1],
            ListCO, ListCR, "CP", "CS", "Flow of persons of concern", false);
    // Note that, unusually, we want to use the filtered data to produce this as the original data will contain ALL years! (which we dont want)
    // This is the heaviest processing of the data as we need to restructure it in links and nodes...
    sankeyChart.DrawSankey(chartGroup.SankifyData(sankeyChart.ChartID, true));   


    //--CHART-07-- Region of asylum / resettlement (the titles are abbreviated for small screens)
    let roARChart = new DNChart();
    roARChart.BarChart("ER", "DataVis", chartGroup, DCO["ER"][0], DCO["ER"][1], DCO["ER"][2], DCO["ER"][3], 150, "BChart3", true, 30, "", ListEuropeRegions, DCO["ER"][4], true);

    //--CHART-08-- Country of asylum / resettlement (the titles are abbreviated for small screens) CR/CS
    let coARChart = new DNChart();
    coARChart.BarChart("CS", "DataVis", chartGroup, DCO["CS"][0], DCO["CS"][1], DCO["CS"][2], DCO["CS"][3], 150, "BChart3", true, 30, "", ListCR, DCO["CS"][4], true);                    
    

    //--X07-- If any filters need to be applied based on the parameters in the initial URL, then do that filtering and redrawing and updating of the charts here
    // We only need to do this once, so after doing the apply, we reset the initialURL to be null, so that e.g. if the screen is resized, this is not reapplied
    // Note that we need to do this after the stock dimension has been drawn... and indeed after all the visualisations are re-drawn, otherwise the filtering is TOO AGGRESSIVE
    // We always want to apply the filter, but if this is an initial draw we also want to consume any parameters specified in the URL
    let urlChartID = chartGroup.singleOptionDimension.ID;

    if (dn.IsDefined(initialURL) && initialURL !== "") {
        // Apply the URL filters (if any were provided)
        urlChartID = urlEditor.URLApplyFilters(urlEditorChartIDs, initialURL, chartGroup, true);
        // If the URL chart ID was not defined, lets set it to the single option dimension (this will probably only happen in the default option)
        if (!dn.IsDefined(urlChartID) || urlChartID === "") {
            urlChartID = chartGroup.singleOptionDimension.ID;
        }
        // clear the initialURL so it does not get reapplied
        initialURL = null;
    }
    
    // We always need to reapply the filter for the initial load and for responsive loads too (which redraws the charts, and updates everything that's needed)
    chartGroup.ApplyFilter(urlChartID, false, true, true);
    

    //--X08-- And lastly, lets show the summary, settings and source blocks
    // Style the PoCs summary
    d3.select("#PoCsSummary")
        .style("left", DCO["X1"][0] + "px")
        .style("top", DCO["X1"][1] + "px")
        .style("width", DCO["X1"][2] + "px")
        .style("height", DCO["X1"][3] + "px")
        .style("display", "");

    // Stype the PoCs settings
    d3.select("#PoCsSettings")
        .style("left", DCO["X2"][0] + "px")
        .style("top", DCO["X2"][1] + "px")
        .style("width", DCO["X2"][2] + "px")
        .style("height", DCO["X2"][3] + "px")
        .style("display", "");

    d3.select("#PoCsFooter").style("display", "");

}


//----- Entry Point -----
//--01-- Setup the map
dn.defaultMapCentroid = [52.5, 15.5];
dn.defaultMapZoomLevel = 4;
dn.defaultMapBubbleRadiusPercent = 7; // reduce from 10%
dn.defaultMapMaxZoomLevel = 8; // Granular enough for individual countries - the user cannot zoom in further than this
dn.defaultMapBubbleSizeModifier = 0.7; // add a slight log of the data as the range of the PoC data in Europe is huge with Turkey and Ukraine in the millions and other countries in the 100's.  Otherwise we end up with 2-3 big bubbles and the rest being tiny.
dn.defaultMapMinRadius = 3; // reduced from 7

//--02-- Set the max map value - if the data changes this will need to be regenerated in ProcessData
maxMapValue = 3994236; 

//--03-- Load the data
LoadData(urlUnzipped, false);
