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

// Europe
var urlUnzipped = "https://dl.dropboxusercontent.com/s/7jw460u2cad5gg3/PopData_All_Revised.csv?dl=1" + "&ym=" + dn.YearMonth();
var urlZipped = "https://dl.dropboxusercontent.com/s/1dryv0hrjo1mwol/PopData_All.zip?dl=1" + "&ym=" + dn.YearMonth();
var zippedFileName = "PopData_All.csv";

var urlUkraine = "https://dl.dropboxusercontent.com/s/qnnnudhn1tc7pvy/PopData_Ukraine.csv?dl=1" + "&ym=" + dn.YearMonth();
var urlUkrainians = "https://dl.dropboxusercontent.com/s/654jk4pbxnmunwt/PopData_Ukrainians.csv?dl=1" + "&ym=" + dn.YearMonth();

// The vis title defaults
var defaultTitleStart = "Refugees, asylum seekers, internally displaced persons, returnees and stateless persons ";
var defaultTitleEnd = " in Europe";


//----- The global regions
var ListGlobalRegions = [
    { "ID": 101, "Title": "Antarctica" },
    { "ID": 102, "Title": "Asia" },
    { "ID": 103, "Title": "South East Asia" },
    { "ID": 104, "Title": "South West Asia" },
    { "ID": 105, "Title": "Australasia" },
    { "ID": 106, "Title": "Central Africa" },
    { "ID": 107, "Title": "East Africa" },
    { "ID": 108, "Title": "North Africa" },
    { "ID": 109, "Title": "Southern Africa" },
    { "ID": 110, "Title": "West Africa" },
    { "ID": 111, "Title": "Carribean" },
    { "ID": 112, "Title": "Central America" },
    { "ID": 113, "Title": "North America" },
    { "ID": 114, "Title": "Pacific" },
    { "ID": 115, "Title": "South America" },
    { "ID": 116, "Title": "Europe" },
    { "ID": 117, "Title": "Middle East" },
    { "ID": 118, "Title": "Other" },
    { "ID": 119, "Title": "Stateless" },
    { "ID": 120, "Title": "Various" }
];

//----- The Europe regions
var ListEuropeRegions = [
    { "ID": 21, "Title": "Central" },
    { "ID": 22, "Title": "Eastern" },
    { "ID": 23, "Title": "Northern" },
    { "ID": 24, "Title": "South Eastern" },
    { "ID": 25, "Title": "Southern" },
    { "ID": 26, "Title": "Turkey" },
    { "ID": 27, "Title": "Western" }
];


var ListCountries = [
    { ID: "ABW", Title: "Aruba", GR: 115, ER: "", Geo: [12.52, -69.98] },
    { ID: "AFG", Title: "Afghanistan", GR: 104, ER: "", Geo: [33.84, 66] },
    { ID: "AGO", Title: "Angola", GR: 106, ER: "", Geo: [-12.29, 17.54] },
    { ID: "AIA", Title: "Anguilla", GR: 111, ER: "", Geo: [18.22, -63.06] },
    { ID: "ALA", Title: "Åland Islands", GR: 116, ER: "23", Geo: [60.21, 19.95] },
    { ID: "ALB", Title: "Albania", GR: 116, ER: "24", Geo: [41.14, 20.05] },
    { ID: "AND", Title: "Andorra", GR: 116, ER: "25", Geo: [42.54, 1.56] },
    { ID: "ARG", Title: "Argentina", GR: 115, ER: "", Geo: [-35.38, -65.18] },
    { ID: "ARM", Title: "Armenia", GR: 116, ER: "22", Geo: [40.28, 44.92] },
    { ID: "ASM", Title: "American Samoa", GR: 114, ER: "", Geo: [-14.3, -170.72] },
    { ID: "ATA", Title: "Antarctica", GR: 101, ER: "", Geo: [-80.51, 19.92] },
    { ID: "ATF", Title: "French Southern Territories", GR: 101, ER: "", Geo: [-49.25, 69.23] },
    { ID: "ATG", Title: "Antigua and Barbuda", GR: 111, ER: "", Geo: [17.28, -61.79] },
    { ID: "AUS", Title: "Australia", GR: 105, ER: "", Geo: [-25.73, 134.49] },
    { ID: "AUT", Title: "Austria", GR: 116, ER: "27", Geo: [47.59, 14.13] },
    { ID: "AZE", Title: "Azerbaijan", GR: 116, ER: "22", Geo: [40.28, 47.54] },
    { ID: "BDI", Title: "Burundi", GR: 106, ER: "", Geo: [-3.36, 29.88] },
    { ID: "BEL", Title: "Belgium", GR: 116, ER: "27", Geo: [50.64, 4.64] },
    { ID: "BEN", Title: "Benin", GR: 110, ER: "", Geo: [9.64, 2.33] },
    { ID: "BES", Title: "Bonaire, Saint Eustatius and Saba", GR: 111, ER: "", Geo: [12.17, -68.38] },
    { ID: "BFA", Title: "Burkina Faso", GR: 110, ER: "", Geo: [12.27, -1.75] },
    { ID: "BGD", Title: "Bangladesh", GR: 103, ER: "", Geo: [23.87, 90.24] },
    { ID: "BGR", Title: "Bulgaria", GR: 116, ER: "21", Geo: [42.77, 25.22] },
    { ID: "BHR", Title: "Bahrain", GR: 117, ER: "", Geo: [26.04, 50.54] },
    { ID: "BHS", Title: "Bahamas", GR: 111, ER: "", Geo: [24.29, -76.63] },
    { ID: "BIH", Title: "Bosnia and Herzegovina", GR: 116, ER: "24", Geo: [44.17, 17.77] },
    { ID: "BLM", Title: "Saint Barthélemy", GR: 111, ER: "", Geo: [17.9, -62.84] },
    { ID: "BLR", Title: "Belarus", GR: 116, ER: "22", Geo: [53.53, 28.03] },
    { ID: "BLZ", Title: "Belize", GR: 112, ER: "", Geo: [17.2, -88.71] },
    { ID: "BMU", Title: "Bermuda", GR: 111, ER: "", Geo: [32.31, -64.75] },
    { ID: "BOL", Title: "Bolivia", GR: 115, ER: "", Geo: [-16.71, -64.69] }, // , Plurinational State of
    { ID: "BRA", Title: "Brazil", GR: 115, ER: "", Geo: [-10.79, -53.1] },
    { ID: "BRB", Title: "Barbados", GR: 111, ER: "", Geo: [13.18, -59.56] },
    { ID: "BRN", Title: "Brunei Darussalam", GR: 103, ER: "", Geo: [4.52, 114.72] },
    { ID: "BTN", Title: "Bhutan", GR: 103, ER: "", Geo: [27.41, 90.4] },
    { ID: "BVT", Title: "Bouvet Island", GR: 101, ER: "", Geo: [-54.42, 3.32] },
    { ID: "BWA", Title: "Botswana", GR: 109, ER: "", Geo: [-22.18, 23.8] },
    { ID: "CAF", Title: "Central African Republic", GR: 106, ER: "", Geo: [6.57, 20.47] },
    { ID: "CAN", Title: "Canada", GR: 113, ER: "", Geo: [61.36, -98.31] },
    { ID: "CCK", Title: "Cocos (Keeling) Islands", GR: 105, ER: "", Geo: [-12.02, 96.73] },
    { ID: "CHE", Title: "Switzerland", GR: 116, ER: "27", Geo: [47.1, 7.81] },
    { ID: "CHL", Title: "Chile", GR: 115, ER: "", Geo: [-37.73, -71.38] },
    { ID: "CHN", Title: "China", GR: 102, ER: "", Geo: [36.56, 103.82] },
    { ID: "CIV", Title: "Côte d'Ivoire", GR: 110, ER: "", Geo: [7.63, -5.57] },
    { ID: "CMR", Title: "Cameroon", GR: 110, ER: "", Geo: [5.69, 12.74] },
    { ID: "COD", Title: "Congo, the Dem. Rep. of", GR: 106, ER: "", Geo: [-2.88, 23.64] }, // the Democratic Republic of the
    { ID: "COG", Title: "Congo", GR: 106, ER: "", Geo: [-0.84, 15.22] },
    { ID: "COK", Title: "Cook Islands", GR: 105, ER: "", Geo: [-21.22, -159.79] },
    { ID: "COL", Title: "Colombia", GR: 115, ER: "", Geo: [3.91, -73.08] },
    { ID: "COM", Title: "Comoros", GR: 107, ER: "", Geo: [-11.88, 43.68] },
    { ID: "CPV", Title: "Cabo Verde", GR: 110, ER: "", Geo: [15.96, -23.96] },
    { ID: "CRI", Title: "Costa Rica", GR: 112, ER: "", Geo: [9.98, -84.19] },
    { ID: "CUB", Title: "Cuba", GR: 111, ER: "", Geo: [21.62, -79.02] },
    { ID: "CUW", Title: "Curaçao", GR: 115, ER: "", Geo: [12.2, -68.97] },
    { ID: "CXR", Title: "Christmas Island", GR: 105, ER: "", Geo: [-10.49, 105.55] },
    { ID: "CYM", Title: "Cayman Islands", GR: 111, ER: "", Geo: [19.43, -80.91] },
    { ID: "CYP", Title: "Cyprus", GR: 116, ER: "25", Geo: [34.92, 33] },
    { ID: "CZE", Title: "Czechia", GR: 116, ER: "21", Geo: [49.73, 15.31] },
    { ID: "DEU", Title: "Germany", GR: 116, ER: "27", Geo: [51.11, 10.39] },
    { ID: "DJI", Title: "Djibouti", GR: 107, ER: "", Geo: [11.75, 42.56] },
    { ID: "DMA", Title: "Dominica", GR: 111, ER: "", Geo: [15.44, -61.36] },
    { ID: "DNK", Title: "Denmark", GR: 116, ER: "23", Geo: [55.98, 10.03] },
    { ID: "DOM", Title: "Dominican Republic", GR: 111, ER: "", Geo: [18.89, -70.51] },
    { ID: "DZA", Title: "Algeria", GR: 108, ER: "", Geo: [28.16, 2.62] },
    { ID: "ECU", Title: "Ecuador", GR: 115, ER: "", Geo: [-1.42, -78.75] },
    { ID: "EGY", Title: "Egypt", GR: 108, ER: "", Geo: [26.5, 29.86] },
    { ID: "ERI", Title: "Eritrea", GR: 107, ER: "", Geo: [15.36, 38.85] },
    { ID: "ESH", Title: "Western Sahara", GR: 108, ER: "", Geo: [24.23, -12.22] },
    { ID: "ESP", Title: "Spain", GR: 116, ER: "25", Geo: [40.24, -3.65] },
    { ID: "EST", Title: "Estonia", GR: 116, ER: "23", Geo: [58.67, 25.54] },
    { ID: "ETH", Title: "Ethiopia", GR: 107, ER: "", Geo: [8.62, 39.6] },
    { ID: "FIN", Title: "Finland", GR: 116, ER: "23", Geo: [64.5, 26.27] },
    { ID: "FJI", Title: "Fiji", GR: 114, ER: "", Geo: [-17.43, 165.45] },
    { ID: "FLK", Title: "Falkland Islands (Malvinas)", GR: 115, ER: "", Geo: [-51.74, -59.35] },
    { ID: "FRA", Title: "France", GR: 116, ER: "27", Geo: [47.17, 1.5] },
    { ID: "FRO", Title: "Faroe Islands", GR: 116, ER: "23", Geo: [62.05, -6.88] },
    { ID: "FSM", Title: "Micronesia, Federated States of", GR: 114, ER: "", Geo: [7.45, 153.24] },
    { ID: "GAB", Title: "Gabon", GR: 106, ER: "", Geo: [-0.59, 11.79] },
    { ID: "GBR", Title: "United Kingdom", GR: 116, ER: "27", Geo: [52.02, -0.8] },
    { ID: "GEO", Title: "Georgia", GR: 116, ER: "22", Geo: [42.16, 43.5] },
    { ID: "GHA", Title: "Ghana", GR: 110, ER: "", Geo: [7.95, -1.22] },
    { ID: "GIN", Title: "Guinea", GR: 110, ER: "", Geo: [10.44, -10.94] },
    { ID: "GLP", Title: "Guadeloupe", GR: 112, ER: "", Geo: [16.15, -61.68] },
    { ID: "GMB", Title: "Gambia", GR: 110, ER: "", Geo: [13.45, -15.4] },
    { ID: "GNB", Title: "Guinea-Bissau", GR: 110, ER: "", Geo: [12.05, -14.95] },
    { ID: "GNQ", Title: "Equatorial Guinea", GR: 110, ER: "", Geo: [1.71, 10.34] },
    { ID: "GRC", Title: "Greece", GR: 116, ER: "25", Geo: [39.07, 22.96] },
    { ID: "GRD", Title: "Grenada", GR: 111, ER: "", Geo: [12.12, -61.68] },
    { ID: "GRL", Title: "Greenland", GR: 113, ER: "", Geo: [74.71, -41.34] },
    { ID: "GTM", Title: "Guatemala", GR: 112, ER: "", Geo: [15.69, -90.36] },
    { ID: "GUF", Title: "French Guiana", GR: 115, ER: "", Geo: [4.03, -54.21] },
    { ID: "GUM", Title: "Guam", GR: 114, ER: "", Geo: [13.44, 144.77] },
    { ID: "GUY", Title: "Guyana", GR: 115, ER: "", Geo: [4.79, -58.98] },
    { ID: "HKG", Title: "Hong Kong", GR: 102, ER: "", Geo: [22.4, 114.11] },
    { ID: "HMD", Title: "Heard Island and McDonald Islands", GR: 101, ER: "", Geo: [-53.09, 73.52] },
    { ID: "HND", Title: "Honduras", GR: 111, ER: "", Geo: [14.83, -86.62] },
    { ID: "HRV", Title: "Croatia", GR: 116, ER: "27", Geo: [45.58, 16.4] },
    { ID: "HTI", Title: "Haiti", GR: 111, ER: "", Geo: [18.94, -72.69] },
    { ID: "HUN", Title: "Hungary", GR: 116, ER: "21", Geo: [47.16, 19.4] },
    { ID: "IDN", Title: "Indonesia", GR: 103, ER: "", Geo: [-2.22, 117.24] },
    { ID: "IND", Title: "India", GR: 103, ER: "", Geo: [22.89, 79.61] },
    { ID: "IOT", Title: "British Indian Ocean Territory", GR: 102, ER: "", Geo: [-7.33, 72.45] },
    { ID: "IRL", Title: "Ireland", GR: 116, ER: "27", Geo: [53.18, -8.14] },
    { ID: "IRN", Title: "Iran, Islamic Republic of", GR: 104, ER: "", Geo: [32.58, 54.27] },
    { ID: "IRQ", Title: "Iraq", GR: 117, ER: "", Geo: [33.04, 43.74] },
    { ID: "ISL", Title: "Iceland", GR: 116, ER: "23", Geo: [65, -18.57] },
    { ID: "ISR", Title: "Israel", GR: 117, ER: "", Geo: [31.46, 35] },
    { ID: "ITA", Title: "Italy", GR: 116, ER: "25", Geo: [42.8, 12.07] },
    { ID: "JAM", Title: "Jamaica", GR: 111, ER: "", Geo: [18.16, -77.31] },
    { ID: "JOR", Title: "Jordan", GR: 117, ER: "", Geo: [31.25, 36.77] },
    { ID: "JPN", Title: "Japan", GR: 102, ER: "", Geo: [37.59, 138.03] },
    { ID: "KAZ", Title: "Kazakhstan", GR: 102, ER: "", Geo: [48.16, 67.29] },
    { ID: "KEN", Title: "Kenya", GR: 107, ER: "", Geo: [0.6, 37.8] },
    { ID: "KGZ", Title: "Kyrgyzstan", GR: 102, ER: "", Geo: [41.46, 74.54] },
    { ID: "KHM", Title: "Cambodia", GR: 103, ER: "", Geo: [12.72, 104.91] },
    { ID: "KIR", Title: "Kiribati", GR: 114, ER: "", Geo: [0.86, -45.61] },
    { ID: "KNA", Title: "Saint Kitts and Nevis", GR: 111, ER: "", Geo: [17.26, -62.69] },
    { ID: "KOR", Title: "Korea, Republic of", GR: 103, ER: "", Geo: [36.39, 127.84] },
    { ID: "KWT", Title: "Kuwait", GR: 117, ER: "", Geo: [29.33, 47.59] },
    { ID: "LAO", Title: "Lao People's Democratic Republic", GR: 103, ER: "", Geo: [18.5, 103.74] },
    { ID: "LBN", Title: "Lebanon", GR: 117, ER: "", Geo: [33.92, 35.88] },
    { ID: "LBR", Title: "Liberia", GR: 110, ER: "", Geo: [6.45, -9.32] },
    { ID: "LBY", Title: "Libya", GR: 108, ER: "", Geo: [27.03, 18.01] },
    { ID: "LCA", Title: "Saint Lucia", GR: 111, ER: "", Geo: [13.89, -60.97] },
    { ID: "LIE", Title: "Liechtenstein", GR: 116, ER: "27", Geo: [47.14, 9.54] },
    { ID: "LKA", Title: "Sri Lanka", GR: 103, ER: "", Geo: [7.61, 80.7] },
    { ID: "LSO", Title: "Lesotho", GR: 109, ER: "", Geo: [-29.58, 28.23] },
    { ID: "LTU", Title: "Lithuania", GR: 116, ER: "27", Geo: [55.33, 23.89] },
    { ID: "LUX", Title: "Luxembourg", GR: 116, ER: "27", Geo: [49.77, 6.07] },
    { ID: "LVA", Title: "Latvia", GR: 116, ER: "23", Geo: [56.85, 24.91] },
    { ID: "MAC", Title: "Macao", GR: 102, ER: "", Geo: [22.22, 113.51] },
    { ID: "MAF", Title: "Saint Martin (French part)", GR: 111, ER: "", Geo: [18.09, -63.06] },
    { ID: "MAR", Title: "Morocco", GR: 108, ER: "", Geo: [29.84, -8.46] },
    { ID: "MCO", Title: "Monaco", GR: 116, ER: "27", Geo: [43.75, 7.41] },
    { ID: "MDA", Title: "Moldova", GR: 116, ER: "21", Geo: [47.19, 28.46] }, // , Republic of
    { ID: "MDG", Title: "Madagascar", GR: 107, ER: "", Geo: [-19.37, 46.7] },
    { ID: "MDV", Title: "Maldives", GR: 103, ER: "", Geo: [3.73, 73.46] },
    { ID: "MEX", Title: "Mexico", GR: 112, ER: "", Geo: [23.95, -102.52] },
    { ID: "MHL", Title: "Marshall Islands", GR: 114, ER: "", Geo: [7, 170.34] },
    { ID: "MKD", Title: "North Macedonia", GR: 116, ER: "24", Geo: [41.6, 21.68] },
    { ID: "MLI", Title: "Mali", GR: 110, ER: "", Geo: [17.35, -3.54] },
    { ID: "MLT", Title: "Malta", GR: 116, ER: "25", Geo: [35.92, 14.41] },
    { ID: "MMR", Title: "Myanmar", GR: 103, ER: "", Geo: [21.19, 96.49] },
    { ID: "MNE", Title: "Montenegro", GR: 116, ER: "24", Geo: [42.79, 19.24] },
    { ID: "MNG", Title: "Mongolia", GR: 102, ER: "", Geo: [46.83, 103.05] },
    { ID: "MNP", Title: "Northern Mariana Islands", GR: 114, ER: "", Geo: [15.83, 145.62] },
    { ID: "MOZ", Title: "Mozambique", GR: 107, ER: "", Geo: [-17.27, 35.53] },
    { ID: "MRT", Title: "Mauritania", GR: 108, ER: "", Geo: [20.26, -10.35] },
    { ID: "MSR", Title: "Montserrat", GR: 111, ER: "", Geo: [16.74, -62.19] },
    { ID: "MTQ", Title: "Martinique", GR: 111, ER: "", Geo: [14.63, -61.15] },
    { ID: "MUS", Title: "Mauritius", GR: 107, ER: "", Geo: [-20.28, 57.57] },
    { ID: "MWI", Title: "Malawi", GR: 107, ER: "", Geo: [-13.22, 34.29] },
    { ID: "MYS", Title: "Malaysia", GR: 103, ER: "", Geo: [3.79, 109.7] },
    { ID: "MYT", Title: "Mayotte", GR: 107, ER: "", Geo: [-12.81, 45.02] },
    { ID: "NAM", Title: "Namibia", GR: 109, ER: "", Geo: [-22.13, 17.21] },
    { ID: "NCL", Title: "New Caledonia", GR: 105, ER: "", Geo: [-21.3, 165.68] },
    { ID: "NER", Title: "Niger", GR: 110, ER: "", Geo: [17.42, 9.39] },
    { ID: "NFK", Title: "Norfolk Island", GR: 105, ER: "", Geo: [-29.05, 167.95] },
    { ID: "NGA", Title: "Nigeria", GR: 110, ER: "", Geo: [9.59, 8.09] },
    { ID: "NIC", Title: "Nicaragua", GR: 112, ER: "", Geo: [12.85, -85.03] },
    { ID: "NIU", Title: "Niue", GR: 114, ER: "", Geo: [-19.05, -169.87] },
    { ID: "NLD", Title: "Netherlands", GR: 116, ER: "27", Geo: [52.1, 5.28] },
    { ID: "NOR", Title: "Norway", GR: 116, ER: "23", Geo: [60.75, 8.35] },
    { ID: "NPL", Title: "Nepal", GR: 103, ER: "", Geo: [28.25, 83.92] },
    { ID: "NRU", Title: "Nauru", GR: 114, ER: "", Geo: [-0.52, 166.93] },
    { ID: "NZL", Title: "New Zealand", GR: 105, ER: "", Geo: [-41.81, 171.48] },
    { ID: "OMN", Title: "Oman", GR: 117, ER: "", Geo: [20.61, 56.09] },
    { ID: "PAK", Title: "Pakistan", GR: 104, ER: "", Geo: [29.95, 69.34] },
    { ID: "PAN", Title: "Panama", GR: 112, ER: "", Geo: [8.52, -80.12] },
    { ID: "PCN", Title: "Pitcairn", GR: 114, ER: "", Geo: [-24.37, -128.32] },
    { ID: "PER", Title: "Peru", GR: 115, ER: "", Geo: [-9.15, -74.38] },
    { ID: "PHL", Title: "Philippines", GR: 103, ER: "", Geo: [11.78, 122.88] },
    { ID: "PLW", Title: "Palau", GR: 114, ER: "", Geo: [7.29, 134.41] },
    { ID: "PNG", Title: "Papua New Guinea", GR: 102, ER: "", Geo: [-6.46, 145.21] },
    { ID: "POL", Title: "Poland", GR: 116, ER: "21", Geo: [52.13, 19.39] },
    { ID: "PRI", Title: "Puerto Rico", GR: 111, ER: "", Geo: [18.23, -66.47] },
    { ID: "PRK", Title: "Korea, Democratic People's Republic of", GR: 103, ER: "", Geo: [40.15, 127.19] },
    { ID: "PRT", Title: "Portugal", GR: 116, ER: "25", Geo: [39.6, -8.5] },
    { ID: "PRY", Title: "Paraguay", GR: 115, ER: "", Geo: [-23.23, -58.4] },
    { ID: "PSE", Title: "State of Palestine", GR: 117, ER: "", Geo: [31.92, 35.2] },
    { ID: "GAZ", Title: "Palestinian", GR: 117, ER: "", Geo: [31.92, 35.196] },
    { ID: "PYF", Title: "French Polynesia", GR: 114, ER: "", Geo: [-14.72, -144.9] },
    { ID: "QAT", Title: "Qatar", GR: 117, ER: "", Geo: [25.31, 51.18] },
    { ID: "REU", Title: "Réunion", GR: 109, ER: "", Geo: [-21.13, 55.39] },
    { ID: "ROU", Title: "Romania", GR: 116, ER: "21", Geo: [45.85, 24.97] },
    { ID: "RUS", Title: "Russian Federation", GR: 116, ER: "22", Geo: [61.98, 48.69] },
    { ID: "RWA", Title: "Rwanda", GR: 106, ER: "", Geo: [-1.99, 29.92] },
    { ID: "SAU", Title: "Saudi Arabia", GR: 117, ER: "", Geo: [24.12, 44.54] },
    { ID: "SDN", Title: "Sudan", GR: 107, ER: "", Geo: [15.99, 29.94] },
    { ID: "SEN", Title: "Senegal", GR: 110, ER: "", Geo: [14.37, -14.47] },
    { ID: "SGP", Title: "Singapore", GR: 103, ER: "", Geo: [1.36, 103.82] },
    { ID: "SGS", Title: "South Georgia and the South Sandwich Islands", GR: 101, ER: "", Geo: [-54.46, -36.43] },
    { ID: "SHN", Title: "Saint Helena, Ascension and Tristan da Cunha", GR: 111, ER: "", Geo: [-12.4, -9.55] },
    { ID: "SJM", Title: "Svalbard and Jan Mayen", GR: 116, ER: "23", Geo: [75.05, -3.69] },
    { ID: "SLB", Title: "Solomon Islands", GR: 114, ER: "", Geo: [-8.92, 159.63] },
    { ID: "SLE", Title: "Sierra Leone", GR: 110, ER: "", Geo: [8.56, -11.79] },
    { ID: "SLV", Title: "El Salvador", GR: 112, ER: "", Geo: [13.74, -88.87] },
    { ID: "SMR", Title: "San Marino", GR: 116, ER: "25", Geo: [43.94, 12.46] },
    { ID: "SOM", Title: "Somalia", GR: 107, ER: "", Geo: [4.75, 45.71] },
    { ID: "SPM", Title: "Saint Pierre and Miquelon", GR: 111, ER: "", Geo: [46.92, -56.3] },
    { ID: "SRB", Title: "Serbia", GR: 116, ER: "24", Geo: [44.22, 20.79] },
    { ID: "SKO", Title: "Serbia and Kosovo (S/RES/1244 (1999))", GR: 116, ER: "24", Geo: [44.22, 20.79] },
    { ID: "SSD", Title: "South Sudan", GR: 107, ER: "", Geo: [7.31, 30.25] },
    { ID: "STP", Title: "Sao Tome and Principe", GR: 106, ER: "", Geo: [0.44, 6.72] },
    { ID: "SUR", Title: "Suriname", GR: 115, ER: "", Geo: [4.13, -55.91] },
    { ID: "SVK", Title: "Slovakia", GR: 116, ER: "21", Geo: [48.71, 19.48] },
    { ID: "SVN", Title: "Slovenia", GR: 116, ER: "27", Geo: [46.12, 14.8] },
    { ID: "SWE", Title: "Sweden", GR: 116, ER: "23", Geo: [62.78, 16.75] },
    { ID: "SWZ", Title: "Swaziland", GR: 109, ER: "", Geo: [-26.56, 31.48] },
    { ID: "SXM", Title: "Sint Maarten (Dutch part)", GR: 111, ER: "", Geo: [18.05, -63.06] },
    { ID: "SYC", Title: "Seychelles", GR: 107, ER: "", Geo: [-4.66, 55.48] },
    { ID: "SYR", Title: "Syrian Arab Republic", GR: 117, ER: "", Geo: [35.03, 38.51] },
    { ID: "TCA", Title: "Turks and Caicos Islands", GR: 111, ER: "", Geo: [21.83, -71.97] },
    { ID: "TCD", Title: "Chad", GR: 106, ER: "", Geo: [15.33, 18.64] },
    { ID: "TIB", Title: "Tibetan", GR: 102, ER: "", Geo: [31.6, 84.26] },
    { ID: "TGO", Title: "Togo", GR: 110, ER: "", Geo: [8.53, 0.96] },
    { ID: "THA", Title: "Thailand", GR: 103, ER: "", Geo: [15.12, 101] },
    { ID: "TJK", Title: "Tajikistan", GR: 102, ER: "", Geo: [38.53, 71.01] },
    { ID: "TKL", Title: "Tokelau", GR: 114, ER: "", Geo: [-8.96, -172.16] },
    { ID: "TKM", Title: "Turkmenistan", GR: 102, ER: "", Geo: [39.12, 59.37] },
    { ID: "TLS", Title: "Timor-Leste", GR: 103, ER: "", Geo: [-8.83, 125.84] },
    { ID: "TON", Title: "Tonga", GR: 114, ER: "", Geo: [-20.43, -174.81] },
    { ID: "TTO", Title: "Trinidad and Tobago", GR: 111, ER: "", Geo: [10.46, -61.27] },
    { ID: "TUN", Title: "Tunisia", GR: 108, ER: "", Geo: [34.12, 9.55] },
    { ID: "TUR", Title: "Turkey", GR: 116, ER: "26", Geo: [39.06, 35.16] },
    { ID: "TUV", Title: "Tuvalu", GR: 114, ER: "", Geo: [-8.3, 175.54] },
    { ID: "TWN", Title: "Taiwan, Province of China", GR: 102, ER: "", Geo: [23.75, 120.95] },
    { ID: "TZA", Title: "Tanzania", GR: 107, ER: "", Geo: [-6.28, 34.81] }, // , United Republic of
    { ID: "UGA", Title: "Uganda", GR: 107, ER: "", Geo: [1.27, 32.37] },
    { ID: "UKR", Title: "Ukraine", GR: 116, ER: "22", Geo: [49, 31.38] },
    { ID: "ARE", Title: "United Arab Emirates", GR: 117, ER: "", Geo: [23.91, 54.3] },
    { ID: "UMI", Title: "United States Minor Outlying Islands", GR: 113, ER: "", Geo: [13.86, 174.28] },
    { ID: "URY", Title: "Uruguay", GR: 115, ER: "", Geo: [-32.8, -56.02] },
    { ID: "USA", Title: "United States of America", GR: 113, ER: "", Geo: [45.68, -112.46] },
    { ID: "UZB", Title: "Uzbekistan", GR: 102, ER: "", Geo: [41.76, 63.14] },
    { ID: "VAT", Title: "Holy See", GR: 116, ER: "25", Geo: [41.9, 12.43] },
    { ID: "VCT", Title: "Saint Vincent and the Grenadines", GR: 111, ER: "", Geo: [13.22, -61.2] },
    { ID: "VEN", Title: "Venezuela", GR: 115, ER: "", Geo: [7.12, -66.18] }, // , Bolivarian Republic of
    { ID: "VGB", Title: "Virgin Islands, British", GR: 111, ER: "", Geo: [18.53, -64.47] },
    { ID: "VIR", Title: "Virgin Islands, U.S.", GR: 111, ER: "", Geo: [17.96, -64.8] },
    { ID: "VNM", Title: "Viet Nam", GR: 103, ER: "", Geo: [16.65, 106.3] },
    { ID: "VUT", Title: "Vanuatu", GR: 114, ER: "", Geo: [-16.23, 167.69] },
    { ID: "WLF", Title: "Wallis and Futuna", GR: 114, ER: "", Geo: [-13.89, -177.35] },
    { ID: "WSM", Title: "Samoa", GR: 114, ER: "", Geo: [-13.75, -172.16] },
    { ID: "YEM", Title: "Yemen", GR: 117, ER: "", Geo: [15.91, 47.59] },
    { ID: "ZAF", Title: "South Africa", GR: 109, ER: "", Geo: [-29, 25.08] },
    { ID: "ZMB", Title: "Zambia", GR: 107, ER: "", Geo: [-13.46, 27.77] },
    { ID: "ZWE", Title: "Zimbabwe", GR: 107, ER: "", Geo: [-19, 29.85] },
    { ID: "Other", Title: "Other", GR: 118, ER: "", Geo: [] },
    { ID: "STA", Title: "Stateless", GR: 119, ER: "", Geo: [] },
    { ID: "VAR", Title: "Various", GR: 120, ER: "", Geo: [] }
];


//----- Origin Country
var ListCO = [];
var startCO = 2000;

//----- Country of asylum / residence
var ListCR = [];
var startCR = 3000;

//----- Population Type
var ListPT = [
    dn.BuildObj("AS", "Asylum-seekers"),
    dn.BuildObj("ID", "Internally displaced persons"),
    dn.BuildObj("RE", "Refugees"),
    dn.BuildObj("RI", "Returned IDPs"),
    dn.BuildObj("RR", "Returned refugees"),
    dn.BuildObj("ST", "Stateless persons"),
    dn.BuildObj("OT", "Others of concern")
];

// Colours for the donut - other options could be [2c8ac1 medium blue, 992e4a dark red, 53dd88 ]
var colourRampPT = colourbrewer.UNHCRPoCs[1];

// Colours for the donut - other options could be [2c8ac1 medium blue, 992e4a dark red, 53dd88 ]
//var colourRampPT = colourbrewer.UNHCRPoCs[1];
//var colourRampPT = [
//    "#d23f67",      // Asylum seekers
//    "#f7bb16",      // IDPs
//    "#e77b37",     // Refugees
//    "#a87f0f",       // Returned IDPs
//    "#a15626",     // Returned refugees
//    "#5ebdf5",    // Stateless
//    "#505050",    // Others of concern
//    "none"];

//----- The tile URLs and access token
dn.mapTileURL = "https://api.mapbox.com/styles/v1/unhcr/cizphbn5500ec2snueblxbmft/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidW5oY3IiLCJhIjoiOUQzQ2dnbyJ9.6ghfFmvxpu7HvHzXci_ogw";
dn.mapTileAccessToken = "pk.eyJ1IjoidW5oY3IiLCJhIjoiOUQzQ2dnbyJ9.6ghfFmvxpu7HvHzXci_ogw";

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// The chart group - lets start it with null data
var chartGroup = new DNChartGroup(null);
// Lets specify the single option dimension too
var singleOptionDimension = "YE";
// And lets declare our urlEditor here too
var urlEditor = new DNURLEditor();
var urlEditorChartIDs = ["YE", "GR", "CR", "CP", "ER", "CS", "PT"];
// e.g.
// http://localhost:57446/VisPoCs?YE=2018&FilterCoO=SYR,AFG,IRQ&FilterCoAR=SWE,NOR,DEU
// http://localhost:57446/VisPoCs?YE=2018&FilterCoO=UKR&FilterCoAR=UKR&FilterOperation=1
var filterListCoO = urlEditor.URLGetParameter("FilterCoO");
var filterListCoAR = urlEditor.URLGetParameter("FilterCoAR");
// It's AND or OR folks, that's it.  No fancy XOR stuff here.
var filterOperation = urlEditor.URLGetParameter("FilterOperation");
filterOperation = (dn.IsDefined(filterOperation) === false || filterOperation.length === 0 || filterOperation[0] === 0) ? true : false;

//--X04-- Lets get the URL which we will use once the visualisation has been loaded to see if any filters have been applied (and we will then re-apply these and then redraw and update the charts)
// We only do this once on first load - so after the first load, this will be null.
var initialURL = new URL(window.location.href);

// Make a note of the last width so that we only need to redraw if the changes are significant...
var lastDrawResponsivelyWidth = 0;
// the DimensionsChartObjects chart object dimensions of the form "ChartID": [X,Y,W,H,ChartType, IsVisible]
var DCO = {};

// So that the map bubbles remain consistent between years.
var maxMapValue = 0;
// These will store the other ID - extracted from the list of CoO and CoAR noted above.
//var otherCO = "";
//var otherCR = "";

var yearDescriptionList = [];
var y2FullDataRange = [];

// Abbreviate the titles for the mobile versions
var cTitleRoARLong = "Region of asylum / residence in Europe";
var cTitleRoARShort = "Region of asylum / residence";
var cTitleCoARLong = "Country of asylum / residence in Europe";
var cTitleCoARShort = "Country of asylum / residence";

var responsiveTimeout = "";

var titleListLength = 3;

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//-- We want to summarise the total number of people currently being displayed, the year and the % change from the previous year
function SetSummary() {
    let total = 0;

    // No point continuing if we don't have a chart group...
    if (dn.IsDefined(chartGroup)) {

        //--1-- Get the list of dimensions and objects to filter ([{ID:1234, Objs:[a,b,c]},...]) - note that this is a cloned list...
        let objList = chartGroup.GetObjectIDsToFilter();

        //--2a-- Get the current year and calculate the total number of people currently being displayed
        let currentYear = dn.GetObjInList(objList, "ID", singleOptionDimension).Objs[0];

        //--2b-- Calculate the total number of people currently being displayed
        total = chartGroup.filteredJSData.reduce((acc, b) => acc + b.Count, 0);

        //--2c-- Present the current total and the year
        d3.select("#TotalPersons").html(dn.NumberWithCommas(total));
        d3.select("#YearText").html(currentYear);

        //--3a-- Get the data for the previous year
        let prevYear = currentYear - 1;
        // update the object list replacing the current year
        objList.find(x => x.ID === singleOptionDimension).Objs[0] = prevYear;
        // Filter to show get the previous year's data
        let prevYearFilteredData = chartGroup.GetFilteredDataBase(objList, null, null);

        //--3b-- Calculate the total for the previous year
        let prevYearTotal = prevYearFilteredData.reduce((acc, b) => acc + b.Count, 0);

        //--4-- Calculate the percentage difference string
        let percDiffData = dn.CalculatePercentageDifference(prevYear, prevYearTotal, total, "ComparisonPos", "ComparisonNeg");

        d3.select("#YearComparisonDifference").html(percDiffData[0]);
        d3.select("#YearComparisonDifference").attr("class", percDiffData[2]);
        d3.select("#YearComparisonLogic").html(percDiffData[1]);

        // Lastly, lets set the Visualisation Title
        SetVisTitle();

    }
}


//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*
    --01--Load--- Use JS zip to load the zip file.
    This is functionally equivalent to d3.csv(downloadURL).then(function (rawJSData) {
    But should be a lot faster for decent sized datasets.  So for a 2.5mb zip file that zips to 382kb, this was slightly faster
    End to end both approaches were about 3 seconds for the full refresh and for the normal refresh:  1.5 seconds for the zip versus 2 seconds for the unzipped.
*/
function LoadData(url, isZipped) {

    if (isZipped) {
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if (err) {
                console.error("dn.js - Unzipping the file " + url + " failed.  Check the internet connection.");
            } else {

                //--02--Load--- Lets get unzipped!
                let unzipper = new JSZip();

                unzipper.loadAsync(data).then(function () {

                    //--03--Load--- Extract our file
                    unzipper.file(zippedFileName).async("string").then(function (rawData) {

                        //--04--Load--- Parse our data with D3
                        let data = d3.csvParse(rawData);

                        //--05--Load--- Process the data ...
                        ProcessData(data);
                    });
                });
            }
        });

    } else {
        d3.csv(url).then(function (data) {
            ProcessData(data);
        });
    }
    // Add the event listeners after processing the data
    AddEventListeners();

}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function ProcessData(rawJSData) {

    // Test the parent URL / document referral...
    console.log("Test get parent URL: " + urlEditor.GetParentUrl());

    //-----AAA----- Do the Pre-filtering if the relevant parameters have been provided and update the title
    // Seems to work pretty well - test with:
    // http://localhost:57446/VisPoCs?YE=2018&FilterCoO=SYR,AFG,IRQ&FilterCoAR=SWE,NOR,DEU
    // http://localhost:57446/VisPoCs?YE=2018&FilterCoO=UKR&FilterCoAR=UKR&FilterOperation=1
    rawJSData = DoPreFilterData(rawJSData);

    // Lets hash the ListCountries on ID (checking hashes is faster than a lookup)
    let listCountriesHash = dn.HashArray(ListCountries, "ID"); // {};


    // Data will be of this format:  therefore ensure that the count and year are  numeric
    //"YE", "CoAR", "CoO", "PopType", "Count"
    //1990, "AUT", "VAR", "RE", 34938
    for (let i = 0; i < rawJSData.length; i++) {
        let d = rawJSData[i];
        d.Count = +d.Count;

        // Sep-19 - coerce data into numeric form to enable comparison using === which is more efficient.
        d.YE = +d.YE;

        // Apply the GR and ER (Global and Europe regions)
        let obj = listCountriesHash[d.CoAR];
        let europeRegion = 0;
        if (dn.IsDefined(obj)) {
            europeRegion = +obj.ER;
        }
        // Hack for Ukrainians - set the Europe region to 99 if not set === "Other"
        if (europeRegion === 0) {
            europeRegion = 99;
        }
        d.ER = europeRegion;

        obj = listCountriesHash[d.CoO];
        let globalRegion = 0;
        if (dn.IsDefined(obj)) {
            globalRegion = +obj.GR;
        }
        d.GR = globalRegion;

        // Note - Population Type, CoAR and CoO - no need to do anything
    }

    // Now set the CR - the country of asylum / residence code - ListCR will be empty when added
    ListCR = ApplyCodesAndBuildLookupList(rawJSData, ListCountries, "CoAR", "CR", startCR);

    // Now set the CO - the country of origin code
    ListCO = ApplyCodesAndBuildLookupList(rawJSData, ListCountries, "CoO", "CO", startCO);

    // Dec-19 - moved these here as they make more logical sense as "one time" operations ...
    //--00-- Bar charts have big numbers here, so lets increase the right hand margin (default is 45)
    dn.defaultBarChartMargins.right = 60;
    // Override the default ColumnChart margins so that there is more space on the left for the Y-Axis legend with numbers in millions.
    dn.defaultColumnChartMargins.left = 65;

    //--02-- Define the chart group and set the URL editor
    chartGroup = new DNChartGroup(rawJSData);
    chartGroup.urlEditor = urlEditor; // new DNURLEditor();

    //--00-- Setup the default font and hide the dropshadows
    chartGroup.defaultFont = "Open Sans";
    chartGroup.SetDropShadow(false);


    //--02-- Build the list of years and get the latest year as a string.
    let yearList = YearList(rawJSData, "YE");
    yearDescriptionList = dn.GetYearDescriptionList(yearList);
    y2FullDataRange = dn.ExpandRange(chartGroup.GetInfo1D("YE"), yearList);
    let latestYear = yearList[yearList.length - 1];

    //--03-- Setup the data visualisation as STOCK figures: Set the stock dimension to be Years, and specify that the default year is the latest year ...
    chartGroup.SetSingleOptionDimension(singleOptionDimension, latestYear);

    //--04-- Set the pivot dimensions
    chartGroup.SetPivotDimensions(["GR", "ER", "PT"]);

    //--05-- Set up the dynamically generated data
    let sMaxNumToVis = dn.defaultSankeyMaxNumToVisualise;
    // Note that the other IDs will be the last in the list.  These are used to ensure that the other information is listed last in the summary code.
    chartGroup.AddDynamicallyGeneratedDataVariable("CO", "CP", "Count", sMaxNumToVis, ListCO[ListCO.length - 1].ID);
    chartGroup.AddDynamicallyGeneratedDataVariable("CR", "CS", "Count", sMaxNumToVis, ListCR[ListCR.length - 1].ID);

    //--06-- Identify the maximum value to scale the map with (Obviously faster not to have to regenerate it each time!)
    //maxMapValue = chartGroup.FindMaxValue("CR", "YE");
    //maxMapValue = chartGroup.FindMaxValue("CO", "YE");
    //console.log(maxMapValue);

    //--07-- Then apply the filter for the year (the stock dimension).  All we need to do in fact is to set the filtered data - the ApplyFilter below in VisualiseData handles all the rest
    // We probably only need to do this for the default SingleDimensionOption case, but it is essential for e.g. calculating the map values
    // This does reduce the dataset from 90, 000 records to 5,000 so by doing it in all cases, all subsequent queries will be faster.
    // BUT, the intial load was noticeable slower... perceptions matter and this default will be the most common entry point.
    chartGroup.SetFilteredData(
        chartGroup.GetFilteredData(null));

    //--08-- then lets dynamically generate the data (this has to happen after the filtering by the single option).  The sankey diagram in particular is dependent on this.
    chartGroup.DynamicallyGenerateData();

    //--09-- Then lets draw the visualisation responsively
    DrawResponsively();

}



//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//----- Builds a complete list of years by identify the min and max in the dataset.
function YearList(dataCube, yearColName) {

    // Build the list of years
    let maxYear = Math.max.apply(null, dataCube.map(function (e) {
        return e[yearColName];
    }));
    let minYear = Math.min.apply(null, dataCube.map(function (e) {
        return e[yearColName];
    }));

    let yearList = [];
    for (let i = minYear; i <= maxYear; i++) {
        yearList.push(i);
    }

    return yearList;
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//----- Builds a lookup list of ID, ID string and title values from the sourceColumn of the data cube.  Also sets the key from the source lookup list in the target column of the dataCube.
// The titles are sourced from the sourceLookupList, with the addition of "Other"
function ApplyCodesAndBuildLookupList(dataCube, sourceLookupList, sourceColumn, targetColumn, startValue) {

    // declare the target lookup list
    let targetLookupList = [];

    // Lets hash this to make it run faster - the hash is the source value (i.e - the unique values from the source column) and for each we store the ID
    let lookupHash = {};

    // Loop through the data and see if the value in the source column exists already in our lookup list (and hash), if it does, then apply the code and move on,
    // otherwise add the source ID, the target (numeric) ID and the title to the lookup list
    for (let i = 0; i < dataCube.length; i++) {
        let d = dataCube[i];

        // Get the source value
        let sourceVal = d[sourceColumn];

        // Try to get the code from the lookup list if it's been built already (e.g. the Country of asylum / residence)
        let targetObj = lookupHash[sourceVal];

        // If it exists already lets set it and move on
        if (dn.IsDefined(targetObj)) {
            d[targetColumn] = targetObj.ID;
        } else {
            // If it does not exist then we assign the code to our dataset and increment the new code.
            let currentID = startValue++;
            d[targetColumn] = currentID;

            // Then lets get the title from the source lookup list and append it to the lookup list and hash
            let title = "";
            let latitude = null;
            let longitude = null;

            let lkObj = dn.GetObjInList(sourceLookupList, "ID", sourceVal);
            if (!dn.IsDefined(lkObj)) {
                console.log("Possibly missing ", sourceVal);
            } else {
                title = lkObj.Title;
                // The latitude and longitude are stored in an array in variable Geo
                if (dn.IsDefined(lkObj.Geo) && lkObj.Geo.length >= 2) {
                    latitude = lkObj.Geo[0];
                    longitude = lkObj.Geo[1];
                }
            }

            // Create the object containing our lookup element values
            targetObj = {
                ID: currentID,
                IDStr: sourceVal,
                Title: title,
                Latitude: latitude,
                Longitude: longitude
            };

            // Then add it to both our lookup list and our lookup hash, so that the next time we see this ID we find it quickly
            targetLookupList.push(targetObj);
            lookupHash[sourceVal] = targetObj;
        }
    }

    // Lastly, Others: Now add the other label, using the next available ID
    targetLookupList.push({
        ID: startValue,
        IDStr: "OTH",
        Title: "Other",
        Latitude: null,
        Longitude: null
    });

    return targetLookupList;
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function DoToggleMapOrFlow(cBox) {

    //--01-- Get the defaults for the y dimension of the sankey or the map
    let visY = DCO["SA"][1];
    if (visY < 0) {
        visY = DCO["CR"][1];
    }

    // The default is to show the Sankey
    let ySA = visY;
    let yCR = -1000;

    //--02-- Leaflet seems to have some special behaviour with display:none, so we shufffle the map up and down to "hide" it
    if (dn.IsDefined(cBox) && dn.IsDefined(cBox.checked) && cBox.checked === true) {
        // Do nothing...
    } else {
        ySA = yCR;
        yCR = visY;
    }

    //--03-- Set the top of the Map and the Sankey accordingly
    d3.select("#SADiv").style("top", ySA + "px"); // 0
    d3.select("#CRDiv").style("top", yCR + "px");

    //--04-- we need to update the OffsetY of the SA and CR charts too incase these are redrawn - e.g. by an animation or on reset...
    dn.GetObjInList(chartGroup.charts, "ChartID", "SA").OffsetY = ySA;
    dn.GetObjInList(chartGroup.charts, "ChartID", "CR").OffsetY = yCR;

}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Useful for e.g. CoO or CoAR
function GetCountryName(isoCode) {
    let obj = (ListCountries.find(o => o.ID === isoCode));
    let cName = "";
    if (dn.IsDefined(obj) && dn.IsDefined(obj.ID)) {
        cName = obj.Title;
        if (dn.IsDefined(obj.Prefix)) {
            cName = obj.Prefix + cName;
        }
    }
    return cName;
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function GetCountryList(isoCodeList) {
    let list = "";

    for (let i = 0; i < isoCodeList.length; i++) {
        list = list + GetCountryName(isoCodeList[i]);

        // Use the right grammar!
        if (i < isoCodeList.length - 2) {
            list = list + ", ";
        } else if (i < isoCodeList.length - 1) {
            list = list + " and ";
        }
    }

    return list;
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function DoPreFilterData(rawJSData) {

    //-----XXX----- Do the Pre-filtering if the relevant parameters have been provided
    // Seems to work pretty well - test with:
    // http://localhost:57446/VisPoCs?YE=2018&FilterCoO=SYR,AFG,IRQ&FilterCoAR=SWE,NOR,DEU
    // http://localhost:57446/VisPoCs?YE=2018&FilterCoO=UKR&FilterCoAR=UKR&FilterOperation=1

    // Build this filter list
    let filterList = [];
    filterList.push({ ID: "CoO", Objs: filterListCoO });
    filterList.push({ ID: "CoAR", Objs: filterListCoAR });

    // Pre-filter the data
    rawJSData = dn.PreFilterData(filterList, rawJSData, filterOperation);

    return rawJSData;
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function SetVisTitle() {

     //-----YYY----- Update the title - now set as globals
//    let defaultTitleStart = "Refugees, asylum seekers, internally displaced persons, returnees and stateless persons ";
//    let defaultTitleEnd = " in Europe";

    // Lets try to get the 3 most common types of PoCs in a formatted list
    let popTypes = dn.GetObjInList(chartGroup.Charts(), "ChartID", "PT");
    if (dn.IsDefined(popTypes)) {

        // Identify the most common population types in the filtered data
        let popTypesFilteredData = chartGroup.GetInfo2DFlex("PT", null, chartGroup.filteredJSData, true, null, "Count");
        // Remove popTypes with zero count.
        popTypesFilteredData = popTypesFilteredData.filter(function (v) {
            return v.Count > 0;
        });

//        let listLength = 3;
        let fullListLonger = popTypesFilteredData.length > titleListLength;

        if (dn.IsDefined(popTypesFilteredData) && popTypesFilteredData.length > 0) {

            let t = "";
            for (let i = 0; i < popTypesFilteredData.length && i < titleListLength; i++) {

                if (t.length > 0) {
                    if (i === popTypesFilteredData.length - 1 && fullListLonger === false) {
                        t = t + " and ";
                    } else {
                        t = t + ", ";
                    }
                }

                let currentTitle = dn.GetObjInList(ListPT, "ID", popTypesFilteredData[i].ID).Title;
                if (i > 0) {
                    currentTitle = currentTitle.toLowerCase();
                }
                t = t + currentTitle;
            }

            if (fullListLonger === true) {
                // Add a generic placeholder / catchall
                t = t + " and other persons of concern to UNHCR ";
            }

            defaultTitleStart = t;
        }
    }


    if (filterListCoO.length === 0 && filterListCoAR.length === 0) {
        // Default case - do nothing

    } else if (filterListCoO.length === 1 && filterListCoAR.length === 1 && filterOperation === false && filterListCoO[0] === filterListCoAR[0]) {
        // Special case if there is just one country for CoAR and CoO, which is the same, and this is an OR operation.
        // In Europe, this probably only makes sense for Ukraine!!!
        defaultTitleEnd = " from and/or in " + GetCountryName(filterListCoO[0]);

    } else {
        if (filterListCoO.length > 0) {
            defaultTitleStart = defaultTitleStart + " from " + GetCountryList(filterListCoO);
        }
        if (filterListCoAR.length > 0) {
            defaultTitleEnd = " in " + GetCountryList(filterListCoAR);
        }
    }
    d3.select("#VisTitle").html(defaultTitleStart + defaultTitleEnd);

}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function AddEventListeners() {

    //--01-- Resize the content when the browser window is resized.  Not really needed for the mobile apps, but very useful for all the debugging
    window.addEventListener('resize', function (event) {
        // We encapsulate the DrawResponsively in a timeout as otherwise we get a taking too long warning violation in Chrome...
        // And we dont want to let this fire off until the chartGroup has been initialised ...
        if (!dn.IsDefined(initialURL)) {
            window.setTimeout("DrawResponsively();", 1);
        }

    });


    //--02-- Add the event listener for the popstate too
    window.addEventListener('popstate', e => {

        //--08-- Sep-19 -  Check the URL to see if any filters have been applied when loading the page - if so then set them and then redraw and update the charts
        // The latest URL will be extracted in the method itself, so there is no need to do it here
        let urlChartID = urlEditor.URLApplyFilters(urlEditorChartIDs, null, chartGroup, true);

        console.log("Popstate: ", urlChartID);

        if (dn.IsDefined(urlChartID) && urlChartID !== "") {

            // Note that we want to force the ghosting to be setup in this context.
            chartGroup.ApplyFilter(urlChartID, false, true, true);
        }
    });

}


