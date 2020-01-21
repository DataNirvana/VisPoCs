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

var urlUnzipped = "https://dl.dropboxusercontent.com/s/8zl6j1k5gh3b1mr/PopData_All.csv?dl=1" + "&ym=" + dn.YearMonth();
var urlZipped = "https://dl.dropboxusercontent.com/s/1dryv0hrjo1mwol/PopData_All.zip?dl=1" + "&ym=" + dn.YearMonth();
//let urlZipped = "/JSON/PopData_All.zip?ym=" + dn.YearMonth();
var zippedFileName = "PopData_All.csv";

// old unzipped "https://dl.dropboxusercontent.com/s/vwydylb0991tatb/PopData_All.csv?dl=1"
// old zipped "https://dl.dropboxusercontent.com/s/g2uxar13dx4zur8/PopData_All.zip?dl=1"


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


//----- List of all countries in the world; with the global and europe regions included
// Note all values are strings for optimisation as the core of d3 (e.g. d3.nest) stringifies data
/*
    { 
        "ID": "AFG", 
        "Title": "Afghanistan",
        "GR": "104",
        "ER": "",
     },
*/
var ListCountries = [
    { "ID": "ABW", "Title": "Aruba", "GR": "115", "ER": "" },
    { "ID": "AFG", "Title": "Afghanistan", "GR": "104", "ER": "" },
    { "ID": "AGO", "Title": "Angola", "GR": "106", "ER": "" },
    { "ID": "AIA", "Title": "Anguilla", "GR": "111", "ER": "" },
    { "ID": "ALA", "Title": "Åland Islands", "GR": "116", "ER": "23" },
    { "ID": "ALB", "Title": "Albania", "GR": "116", "ER": "24" },
    { "ID": "AND", "Title": "Andorra", "GR": "116", "ER": "25" },
    { "ID": "ARE", "Title": "Egypt", "GR": "108", "ER": "" },
    { "ID": "UAE", "Title": "Egypt", "GR": "108", "ER": "" },
    { "ID": "ARG", "Title": "Argentina", "GR": "115", "ER": "" },
    { "ID": "ARM", "Title": "Armenia", "GR": "116", "ER": "22" },
    { "ID": "ASM", "Title": "American Samoa", "GR": "114", "ER": "" },
    { "ID": "ATA", "Title": "Antarctica", "GR": "101", "ER": "" },
    { "ID": "ATF", "Title": "French Southern Territories", "GR": "101", "ER": "" },
    { "ID": "ATG", "Title": "Antigua and Barbuda", "GR": "111", "ER": "" },
    { "ID": "AUS", "Title": "Australia", "GR": "105", "ER": "" },
    { "ID": "AUL", "Title": "Australia", "GR": "105", "ER": "" },
    { "ID": "AUT", "Title": "Austria", "GR": "116", "ER": "27" },
    { "ID": "AZE", "Title": "Azerbaijan", "GR": "116", "ER": "22" },
    { "ID": "BDI", "Title": "Burundi", "GR": "106", "ER": "" },
    { "ID": "BEL", "Title": "Belgium", "GR": "116", "ER": "27" },
    { "ID": "BEN", "Title": "Benin", "GR": "110", "ER": "" },
    { "ID": "BES", "Title": "Bonaire, Saint Eustatius and Saba", "GR": "111", "ER": "" },
    { "ID": "BFA", "Title": "Burkina Faso", "GR": "110", "ER": "" },
    { "ID": "BGD", "Title": "Bangladesh", "GR": "103", "ER": "" },
    { "ID": "BGR", "Title": "Bulgaria", "GR": "116", "ER": "21" },
    { "ID": "BHR", "Title": "Bahrain", "GR": "117", "ER": "" },
    { "ID": "BHS", "Title": "Bahamas", "GR": "111", "ER": "" },
    { "ID": "BIH", "Title": "Bosnia and Herzegovina", "GR": "116", "ER": "24" },
    { "ID": "BLM", "Title": "Saint Barthélemy", "GR": "111", "ER": "" },
    { "ID": "BLR", "Title": "Belarus", "GR": "116", "ER": "22" },
    { "ID": "BLZ", "Title": "Belize", "GR": "112", "ER": "" },
    { "ID": "BMU", "Title": "Bermuda", "GR": "111", "ER": "" },
    { "ID": "BOL", "Title": "Bolivia, Plurinational State of", "GR": "115", "ER": "" },
    { "ID": "BRA", "Title": "Brazil", "GR": "115", "ER": "" },
    { "ID": "BRB", "Title": "Barbados", "GR": "111", "ER": "" },
    { "ID": "BRN", "Title": "Brunei Darussalam", "GR": "103", "ER": "" },
    { "ID": "BTN", "Title": "Bhutan", "GR": "103", "ER": "" },
    { "ID": "BVT", "Title": "Bouvet Island", "GR": "101", "ER": "" },
    { "ID": "BWA", "Title": "Botswana", "GR": "109", "ER": "" },
    { "ID": "CAF", "Title": "Central African Republic", "GR": "106", "ER": "" },
    { "ID": "CAN", "Title": "Canada", "GR": "108", "ER": "" },
    { "ID": "CCK", "Title": "Cocos (Keeling) Islands", "GR": "105", "ER": "" },
    { "ID": "CHE", "Title": "Switzerland", "GR": "116", "ER": "27" },
    { "ID": "CHL", "Title": "Chile", "GR": "115", "ER": "" },
    { "ID": "CHN", "Title": "China", "GR": "102", "ER": "" },
    { "ID": "CIV", "Title": "Côte d'Ivoire", "GR": "110", "ER": "" },
    { "ID": "CMR", "Title": "Cameroon", "GR": "110", "ER": "" },
    { "ID": "COD", "Title": "Congo, Dem. Rep. of the", "GR": "106", "ER": "", "Prefix": "the " },
    { "ID": "COG", "Title": "Congo", "GR": "106", "ER": "" },
    { "ID": "COK", "Title": "Cook Islands", "GR": "105", "ER": "" },
    { "ID": "COL", "Title": "Colombia", "GR": "115", "ER": "" },
    { "ID": "COM", "Title": "Comoros", "GR": "107", "ER": "" },
    { "ID": "CPV", "Title": "Cabo Verde", "GR": "110", "ER": "" },
    { "ID": "CRI", "Title": "Costa Rica", "GR": "112", "ER": "" },
    { "ID": "CUB", "Title": "Cuba", "GR": "111", "ER": "" },
    { "ID": "CUW", "Title": "Curaçao", "GR": "115", "ER": "" },
    { "ID": "CXR", "Title": "Christmas Island", "GR": "105", "ER": "" },
    { "ID": "CYM", "Title": "Cayman Islands", "GR": "111", "ER": "" },
    { "ID": "CYP", "Title": "Cyprus", "GR": "116", "ER": "25" },
    { "ID": "CZE", "Title": "Czechia", "GR": "116", "ER": "21" },
    { "ID": "DEU", "Title": "Germany", "GR": "116", "ER": "27" },
    { "ID": "DJI", "Title": "Djibouti", "GR": "107", "ER": "" },
    { "ID": "DMA", "Title": "Dominica", "GR": "111", "ER": "" },
    { "ID": "DNK", "Title": "Denmark", "GR": "116", "ER": "23" },
    { "ID": "DOM", "Title": "Dominican Republic", "GR": "111", "ER": "" },
    { "ID": "DZA", "Title": "Algeria", "GR": "108", "ER": "" },
    { "ID": "ECU", "Title": "Ecuador", "GR": "115", "ER": "" },
    { "ID": "EGY", "Title": "Egypt", "GR": "108", "ER": "" },
    { "ID": "ERI", "Title": "Eritrea", "GR": "107", "ER": "" },
    { "ID": "ESH", "Title": "Western Sahara", "GR": "108", "ER": "" },
    { "ID": "ESP", "Title": "Spain", "GR": "116", "ER": "25" },
    { "ID": "EST", "Title": "Estonia", "GR": "116", "ER": "23" },
    { "ID": "ETH", "Title": "Ethiopia", "GR": "107", "ER": "" },
    { "ID": "FIN", "Title": "Finland", "GR": "116", "ER": "23" },
    { "ID": "FJI", "Title": "Fiji", "GR": "114", "ER": "" },
    { "ID": "FLK", "Title": "Falkland Islands (Malvinas)", "GR": "115", "ER": "" },
    { "ID": "FRA", "Title": "France", "GR": "116", "ER": "27" },
    { "ID": "FRO", "Title": "Faroe Islands", "GR": "116", "ER": "23" },
    { "ID": "FSM", "Title": "Micronesia, Federated States of", "GR": "114", "ER": "" },
    { "ID": "GAB", "Title": "Gabon", "GR": "106", "ER": "" },
    { "ID": "GBR", "Title": "United Kingdom", "GR": "116", "ER": "27", "Prefix": "the " },
    { "ID": "GEO", "Title": "Georgia", "GR": "116", "ER": "22" },
    { "ID": "GHA", "Title": "Ghana", "GR": "110", "ER": "" },
    { "ID": "GIN", "Title": "Guinea", "GR": "110", "ER": "" },
    { "ID": "GLP", "Title": "Guadeloupe", "GR": "112", "ER": "" },
    { "ID": "GMB", "Title": "Gambia", "GR": "110", "ER": "" },
    { "ID": "GNB", "Title": "Guinea-Bissau", "GR": "110", "ER": "" },
    { "ID": "GNQ", "Title": "Equatorial Guinea", "GR": "110", "ER": "" },
    { "ID": "GRC", "Title": "Greece", "GR": "116", "ER": "25" },
    { "ID": "GRD", "Title": "Grenada", "GR": "111", "ER": "" },
    { "ID": "GRL", "Title": "Greenland", "GR": "113", "ER": "" },
    { "ID": "GTM", "Title": "Guatemala", "GR": "112", "ER": "" },
    { "ID": "GUF", "Title": "French Guiana", "GR": "115", "ER": "" },
    { "ID": "GUM", "Title": "Guam", "GR": "114", "ER": "" },
    { "ID": "GUY", "Title": "Guyana", "GR": "115", "ER": "" },
    { "ID": "HKG", "Title": "Hong Kong", "GR": "102", "ER": "" },
    { "ID": "HMD", "Title": "Heard Island and McDonald Islands", "GR": "101", "ER": "" },
    { "ID": "HND", "Title": "Honduras", "GR": "111", "ER": "" },
    { "ID": "HRV", "Title": "Croatia", "GR": "116", "ER": "21" },
    { "ID": "HTI", "Title": "Haiti", "GR": "111", "ER": "" },
    { "ID": "HUN", "Title": "Hungary", "GR": "116", "ER": "21" },
    { "ID": "IDN", "Title": "Indonesia", "GR": "103", "ER": "" },
    { "ID": "IND", "Title": "India", "GR": "103", "ER": "" },
    { "ID": "IOT", "Title": "British Indian Ocean Territory", "GR": "102", "ER": "" },
    { "ID": "IRL", "Title": "Ireland", "GR": "116", "ER": "27" },
    { "ID": "IRN", "Title": "Iran, Islamic Rep. of", "GR": "104", "ER": "" },
    { "ID": "IRQ", "Title": "Iraq", "GR": "117", "ER": "" },
    { "ID": "ISL", "Title": "Iceland", "GR": "116", "ER": "23" },
    { "ID": "ISR", "Title": "Israel", "GR": "117", "ER": "" },
    { "ID": "ITA", "Title": "Italy", "GR": "116", "ER": "25" },
    { "ID": "JAM", "Title": "Jamaica", "GR": "111", "ER": "" },
    { "ID": "JOR", "Title": "Jordan", "GR": "117", "ER": "" },
    { "ID": "JPN", "Title": "Japan", "GR": "102", "ER": "" },
    { "ID": "KAZ", "Title": "Kazakhstan", "GR": "102", "ER": "" },
    { "ID": "KEN", "Title": "Kenya", "GR": "107", "ER": "" },
    { "ID": "KGZ", "Title": "Kyrgyzstan", "GR": "102", "ER": "" },
    { "ID": "KHM", "Title": "Cambodia", "GR": "103", "ER": "" },
    { "ID": "KIR", "Title": "Kiribati", "GR": "114", "ER": "" },
    { "ID": "KNA", "Title": "Saint Kitts and Nevis", "GR": "111", "ER": "" },
    { "ID": "KOR", "Title": "Korea, Republic of", "GR": "103", "ER": "" },
    { "ID": "KWT", "Title": "Kuwait", "GR": "117", "ER": "" },
    { "ID": "LAO", "Title": "Lao People's Dem. Rep.", "GR": "103", "ER": "" },
    { "ID": "LBN", "Title": "Lebanon", "GR": "117", "ER": "" },
    { "ID": "LBR", "Title": "Liberia", "GR": "110", "ER": "" },
    { "ID": "LBY", "Title": "Libya", "GR": "108", "ER": "" },
    { "ID": "LCA", "Title": "Saint Lucia", "GR": "111", "ER": "" },
    { "ID": "LIE", "Title": "Liechtenstein", "GR": "116", "ER": "27" },
    { "ID": "LKA", "Title": "Sri Lanka", "GR": "103", "ER": "" },
    { "ID": "LSO", "Title": "Lesotho", "GR": "109", "ER": "" },
    { "ID": "LTU", "Title": "Lithuania", "GR": "116", "ER": "23" },
    { "ID": "LUX", "Title": "Luxembourg", "GR": "116", "ER": "27" },
    { "ID": "LVA", "Title": "Latvia", "GR": "116", "ER": "23" },
    { "ID": "MAC", "Title": "Macao", "GR": "102", "ER": "" },
    { "ID": "MAF", "Title": "Saint Martin (French part)", "GR": "111", "ER": "" },
    { "ID": "MAR", "Title": "Morocco", "GR": "108", "ER": "" },
    { "ID": "MCO", "Title": "Monaco", "GR": "116", "ER": "27" },
    { "ID": "MDA", "Title": "Moldova, Republic of", "GR": "116", "ER": "21" },
    { "ID": "MDG", "Title": "Madagascar", "GR": "107", "ER": "" },
    { "ID": "MDV", "Title": "Maldives", "GR": "103", "ER": "" },
    { "ID": "MEX", "Title": "Mexico", "GR": "112", "ER": "" },
    { "ID": "MHL", "Title": "Marshall Islands", "GR": "114", "ER": "" },
    { "ID": "MKD", "Title": "North Macedonia", "GR": "116", "ER": "24" },
    { "ID": "MLI", "Title": "Mali", "GR": "110", "ER": "" },
    { "ID": "MLT", "Title": "Malta", "GR": "116", "ER": "25" },
    { "ID": "MMR", "Title": "Myanmar", "GR": "103", "ER": "" },
    { "ID": "MNE", "Title": "Montenegro", "GR": "116", "ER": "24" },
    { "ID": "MNG", "Title": "Mongolia", "GR": "102", "ER": "" },
    { "ID": "MNP", "Title": "Northern Mariana Islands", "GR": "114", "ER": "" },
    { "ID": "MOZ", "Title": "Mozambique", "GR": "107", "ER": "" },
    { "ID": "MRT", "Title": "Mauritania", "GR": "108", "ER": "" },
    { "ID": "MSR", "Title": "Montserrat", "GR": "111", "ER": "" },
    { "ID": "MTQ", "Title": "Martinique", "GR": "111", "ER": "" },
    { "ID": "MUS", "Title": "Mauritius", "GR": "107", "ER": "" },
    { "ID": "MWI", "Title": "Malawi", "GR": "107", "ER": "" },
    { "ID": "MYS", "Title": "Malaysia", "GR": "103", "ER": "" },
    { "ID": "MYT", "Title": "Mayotte", "GR": "107", "ER": "" },
    { "ID": "NAM", "Title": "Namibia", "GR": "109", "ER": "" },
    { "ID": "NCL", "Title": "New Caledonia", "GR": "105", "ER": "" },
    { "ID": "NER", "Title": "Niger", "GR": "110", "ER": "" },
    { "ID": "NFK", "Title": "Norfolk Island", "GR": "105", "ER": "" },
    { "ID": "NGA", "Title": "Nigeria", "GR": "110", "ER": "" },
    { "ID": "NIC", "Title": "Nicaragua", "GR": "112", "ER": "" },
    { "ID": "NIU", "Title": "Niue", "GR": "114", "ER": "" },
    { "ID": "NLD", "Title": "Netherlands", "GR": "116", "ER": "27", "Prefix": "the " },
    { "ID": "NOR", "Title": "Norway", "GR": "116", "ER": "23" },
    { "ID": "NPL", "Title": "Nepal", "GR": "103", "ER": "" },
    { "ID": "NRU", "Title": "Nauru", "GR": "114", "ER": "" },
    { "ID": "NZL", "Title": "New Zealand", "GR": "105", "ER": "" },
    { "ID": "OMN", "Title": "Oman", "GR": "117", "ER": "" },
    { "ID": "PAK", "Title": "Pakistan", "GR": "104", "ER": "" },
    { "ID": "PAN", "Title": "Panama", "GR": "112", "ER": "" },
    { "ID": "PCN", "Title": "Pitcairn", "GR": "114", "ER": "" },
    { "ID": "PER", "Title": "Peru", "GR": "115", "ER": "" },
    { "ID": "PHL", "Title": "Philippines", "GR": "103", "ER": "" },
    { "ID": "PLW", "Title": "Palau", "GR": "114", "ER": "" },
    { "ID": "PNG", "Title": "Papua New Guinea", "GR": "102", "ER": "" },
    { "ID": "POL", "Title": "Poland", "GR": "116", "ER": "21" },
    { "ID": "PRI", "Title": "Puerto Rico", "GR": "111", "ER": "" },
    { "ID": "PRK", "Title": "Korea, Dem. People's Rep. of", "GR": "103", "ER": "" },
    { "ID": "PRT", "Title": "Portugal", "GR": "116", "ER": "25" },
    { "ID": "PRY", "Title": "Paraguay", "GR": "115", "ER": "" },
    { "ID": "PSE", "Title": "State of Palestine", "GR": "117", "ER": "" },
    { "ID": "GAZ", "Title": "Palestinian", "GR": "117", "ER": "" },
    { "ID": "PYF", "Title": "French Polynesia", "GR": "114", "ER": "" },
    { "ID": "QAT", "Title": "Qatar", "GR": "117", "ER": "" },
    { "ID": "REU", "Title": "Réunion", "GR": "109", "ER": "" },
    { "ID": "ROU", "Title": "Romania", "GR": "116", "ER": "21" },
    { "ID": "RUS", "Title": "Russian Federation", "GR": "116", "ER": "22" },
    { "ID": "RWA", "Title": "Rwanda", "GR": "106", "ER": "" },
    { "ID": "SAU", "Title": "Saudi Arabia", "GR": "117", "ER": "" },
    { "ID": "SDN", "Title": "Sudan", "GR": "107", "ER": "" },
    { "ID": "SEN", "Title": "Senegal", "GR": "110", "ER": "" },
    { "ID": "SGP", "Title": "Singapore", "GR": "103", "ER": "" },
    { "ID": "SGS", "Title": "South Georgia and the South Sandwich Islands", "GR": "101", "ER": "" },
    { "ID": "SHN", "Title": "Saint Helena, Ascension and Tristan da Cunha", "GR": "111", "ER": "" },
    { "ID": "SJM", "Title": "Svalbard and Jan Mayen", "GR": "116", "ER": "23" },
    { "ID": "SLB", "Title": "Solomon Islands", "GR": "114", "ER": "" },
    { "ID": "SLE", "Title": "Sierra Leone", "GR": "110", "ER": "" },
    { "ID": "SLV", "Title": "El Salvador", "GR": "112", "ER": "" },
    { "ID": "SMR", "Title": "San Marino", "GR": "116", "ER": "25" },
    { "ID": "SOM", "Title": "Somalia", "GR": "107", "ER": "" },
    { "ID": "SPM", "Title": "Saint Pierre and Miquelon", "GR": "111", "ER": "" },
    { "ID": "SRB", "Title": "Serbia", "GR": "116", "ER": "24" },
    { "ID": "SKO", "Title": "Serbia and Kosovo *", "GR": "116", "ER": "24" }, // Serbia and Kosovo (S/RES/1244 (1999))
    { "ID": "SSD", "Title": "South Sudan", "GR": "107", "ER": "" },
    { "ID": "STP", "Title": "Sao Tome and Principe", "GR": "106", "ER": "" },
    { "ID": "SUR", "Title": "Suriname", "GR": "115", "ER": "" },
    { "ID": "SVK", "Title": "Slovakia", "GR": "116", "ER": "21" },
    { "ID": "SVN", "Title": "Slovenia", "GR": "116", "ER": "21" },
    { "ID": "SWE", "Title": "Sweden", "GR": "116", "ER": "23" },
    { "ID": "SWZ", "Title": "Swaziland", "GR": "109", "ER": "" },
    { "ID": "SXM", "Title": "Sint Maarten (Dutch part)", "GR": "111", "ER": "" },
    { "ID": "SYC", "Title": "Seychelles", "GR": "107", "ER": "" },
    { "ID": "SYR", "Title": "Syrian Arab Republic", "GR": "117", "ER": "", "Prefix":"the " },
    { "ID": "TCA", "Title": "Turks and Caicos Islands", "GR": "111", "ER": "" },
    { "ID": "TCD", "Title": "Chad", "GR": "106", "ER": "" },
    { "ID": "TIB", "Title": "Tibetan", "GR": "102", "ER": "" },
    { "ID": "TGO", "Title": "Togo", "GR": "110", "ER": "" },
    { "ID": "THA", "Title": "Thailand", "GR": "103", "ER": "" },
    { "ID": "TJK", "Title": "Tajikistan", "GR": "102", "ER": "" },
    { "ID": "TKL", "Title": "Tokelau", "GR": "114", "ER": "" },
    { "ID": "TKM", "Title": "Turkmenistan", "GR": "102", "ER": "" },
    { "ID": "TLS", "Title": "Timor-Leste", "GR": "103", "ER": "" },
    { "ID": "TON", "Title": "Tonga", "GR": "114", "ER": "" },
    { "ID": "TTO", "Title": "Trinidad and Tobago", "GR": "111", "ER": "" },
    { "ID": "TUN", "Title": "Tunisia", "GR": "108", "ER": "" },
    { "ID": "TUR", "Title": "Turkey", "GR": "116", "ER": "26" },
    { "ID": "TUV", "Title": "Tuvalu", "GR": "114", "ER": "" },
    { "ID": "TWN", "Title": "Taiwan, Province of China", "GR": "102", "ER": "" },
    { "ID": "TZA", "Title": "Tanzania, United Republic of", "GR": "107", "ER": "" },
    { "ID": "UGA", "Title": "Uganda", "GR": "107", "ER": "" },
    { "ID": "UKR", "Title": "Ukraine", "GR": "116", "ER": "22" },
    { "ID": "UMI", "Title": "United States Minor Outlying Islands", "GR": "113", "ER": "" },
    { "ID": "URY", "Title": "Uruguay", "GR": "115", "ER": "" },
    { "ID": "ARE", "Title": "United Arab Emirates", "GR": "117", "ER": "" },
    { "ID": "USA", "Title": "United States of America", "GR": "113", "ER": "" },
    { "ID": "UZB", "Title": "Uzbekistan", "GR": "102", "ER": "" },
    { "ID": "VAT", "Title": "Holy See", "GR": "116", "ER": "25" },
    { "ID": "VCT", "Title": "Saint Vincent and the Grenadines", "GR": "111", "ER": "" },
    { "ID": "VEN", "Title": "Venezuela, Bolivarian Republic of", "GR": "115", "ER": "" },
    { "ID": "VGB", "Title": "Virgin Islands, British", "GR": "111", "ER": "" },
    { "ID": "VIR", "Title": "Virgin Islands, U.S.", "GR": "111", "ER": "" },
    { "ID": "VNM", "Title": "Viet Nam", "GR": "103", "ER": "" },
    { "ID": "VUT", "Title": "Vanuatu", "GR": "114", "ER": "" },
    { "ID": "WLF", "Title": "Wallis and Futuna", "GR": "114", "ER": "" },
    { "ID": "WSM", "Title": "Samoa", "GR": "114", "ER": "" },
    { "ID": "YEM", "Title": "Yemen", "GR": "117", "ER": "" },
    { "ID": "ZAF", "Title": "South Africa", "GR": "109", "ER": "" },
    { "ID": "ZMB", "Title": "Zambia", "GR": "107", "ER": "" },
    { "ID": "ZWE", "Title": "Zimbabwe", "GR": "107", "ER": "" },
    { "ID": "Other", "Title": "Other", "GR": "118", "ER": "" },
    { "ID": "STA", "Title": "Stateless", "GR": "119", "ER": "" },
    { "ID": "VAR", "Title": "Various", "GR": "120", "ER": "" }
];

//----- The centroids for Europe...
var ListEuropeCentroids = [
    { ID: "ALB", Longitude: 20.05, Latitude: 41.14 },
    { ID: "AND", Longitude: 1.56, Latitude: 42.54 },
    { ID: "AUT", Longitude: 14.13, Latitude: 47.59 },
    { ID: "ARM", Longitude: 44.92, Latitude: 40.28 },
    { ID: "BLR", Longitude: 28.03, Latitude: 53.53 },
    { ID: "AZE", Longitude: 47.54, Latitude: 40.28 },
    { ID: "BEL", Longitude: 4.64, Latitude: 50.64 },
    { ID: "BIH", Longitude: 17.77, Latitude: 44.17 },
    { ID: "BGR", Longitude: 25.22, Latitude: 42.77 },
    { ID: "HRV", Longitude: 16.40, Latitude: 45.58 },
    { ID: "CZE", Longitude: 15.31, Latitude: 49.73 },
    { ID: "CYP", Longitude: 33.00, Latitude: 34.92 },
    { ID: "DNK", Longitude: 10.03, Latitude: 55.98 },
    { ID: "EST", Longitude: 25.54, Latitude: 58.67 },
    { ID: "FIN", Longitude: 26.27, Latitude: 64.50 },
    { ID: "FRA", Longitude: 1.5, Latitude: 47.17 },
    { ID: "DEU", Longitude: 10.39, Latitude: 51.11 },
    { ID: "GRC", Longitude: 22.96, Latitude: 39.07 },
    { ID: "HUN", Longitude: 19.40, Latitude: 47.16 },
    { ID: "GEO", Longitude: 43.50, Latitude: 42.16 },
    { ID: "ISL", Longitude: -18.57, Latitude: 65.00 },
    { ID: "IRL", Longitude: -8.14, Latitude: 53.18 },
    { ID: "ITA", Longitude: 12.07, Latitude: 42.80 },
    { ID: "LVA", Longitude: 24.91, Latitude: 56.85 },
    { ID: "LIE", Longitude: 9.54, Latitude: 47.14 },
    { ID: "LTU", Longitude: 23.89, Latitude: 55.33 },
    { ID: "LUX", Longitude: 6.07, Latitude: 49.77 },
    { ID: "MKD", Longitude: 21.68, Latitude: 41.60 },
    { ID: "MLT", Longitude: 14.41, Latitude: 35.92 },
    { ID: "MDA", Longitude: 28.46, Latitude: 47.19 },
    { ID: "MCO", Longitude: 7.41, Latitude: 43.75 },
    { ID: "MNE", Longitude: 19.24, Latitude: 42.79 },
    { ID: "NLD", Longitude: 5.28, Latitude: 52.10 },
    { ID: "NOR", Longitude: 8.35, Latitude: 60.75 },
    { ID: "POL", Longitude: 19.39, Latitude: 52.13 },
    { ID: "PRT", Longitude: -8.50, Latitude: 39.60 },
    { ID: "SKO", Longitude: 20.79, Latitude: 44.22 },
    { ID: "ROU", Longitude: 24.97, Latitude: 45.85 },
    { ID: "RUS", Longitude: 48.69, Latitude: 61.98 },
    { ID: "SVK", Longitude: 19.48, Latitude: 48.71 },
    { ID: "SVN", Longitude: 14.80, Latitude: 46.12 },
    { ID: "ESP", Longitude: -3.65, Latitude: 40.24 },
    { ID: "SWE", Longitude: 16.75, Latitude: 62.78 },
    { ID: "CHE", Longitude: 7.81, Latitude: 47.10 },
    { ID: "UKR", Longitude: 31.38, Latitude: 49.00 },
    { ID: "GBR", Longitude: -0.8, Latitude: 52.02 },
    { ID: "TUR", Longitude: 35.16, Latitude: 39.06 }
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

//var jsonFullOriginalData = null;

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
/*
JSZipUtils.getBinaryContent(urlZipped, function (err, data) {
    if (err) {
        console.error("dn.js - Unzipping the file " + urlZipped + " failed.  Check the internet connection.");
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
*/
d3.csv(urlUnzipped).then(function (data) {
    ProcessData(data);
});

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


    // Data will be of this format ... ensure that the raw data is numeric
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
        d.ER = europeRegion;

        obj = listCountriesHash[d.CoO];
        let globalRegion = 0; 
        if (dn.IsDefined(obj)) {
            globalRegion = +obj.GR;
        }
        d.GR = globalRegion;

        // Note - Population Type - no need to do anything
        // And the CO and CR are not yet set
//        d.CO = +d.CO;
//        d.CR = +d.CR;

    }
       

    // Now set the CR - the country of asylum / residence code - ListCR will be empty when added
    ListCR = ApplyCodesAndBuildLookupList(rawJSData, ListCountries, "CoAR", "CR", startCR);

    // Lets assign the Lat and Long here this should be very fast as the list of countries in the region is not long.
    for (let i = 0; i < ListCR.length; i++) {
        let obj = ListEuropeCentroids.find(o => o.ID === ListCR[i].IDStr);

        let lat = 0;
        let long = 0;
        if (dn.IsDefined(obj)) {
            lat = obj.Latitude;
            long = obj.Longitude;
        }

        ListCR[i].Latitude = lat;
        ListCR[i].Longitude = long;

    }   

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

    //--01-- Setup the map
    dn.defaultMapCentroid = [52.5, 15.5];
    dn.defaultMapZoomLevel = 4;
    dn.defaultMapBubbleRadiusPercent = 7; // reduce from 10%
    dn.defaultMapMaxZoomLevel = 8; // Granular enough for individual countries - the user cannot zoom in further than this
    dn.defaultMapBubbleSizeModifier = 0.7; // add a slight log of the data as the range of the PoC data in Europe is huge with Turkey and Ukraine in the millions and other countries in the 100's.  Otherwise we end up with 2-3 big bubbles and the rest being tiny.
    dn.defaultMapMinRadius = 3; // reduced from 7

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
    maxMapValue = 3994236; // chartGroup.FindMaxValue("CR", "YE");
    
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
//});


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
        //rooChart.SetOptions({
        //    ChartID: "GR",
        //    ChartType: 100,
        //    DivID: "DataVis",
        //    ChartGroup: chartGroup,
        //    OffsetX: DCO["GR"][0],
        //    OffsetY: DCO["GR"][1],
        //    MaxWidth: DCO["GR"][2],
        //    MaxHeight: DCO["GR"][3],
        //    LegendOffset: 150,
        //    CssClass: "CChart1",
        //    SortByValue: true,
        //    MaxNumValues: 30,
        //    ColToSum: "",
        //    Names1: ListGlobalRegions,
        //    ChartTitle: "Region of origin",
        //    DoDraw: true
        //}).DrawBarChart(chartGroup.GetInfo1D("GR"));

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
            let title = dn.GetObjInList(sourceLookupList, "ID", sourceVal).Title;

            // Create the object containing our lookup element values
            targetObj = {
                ID: currentID,
                IDStr: sourceVal,
                Title: title
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
        Title: "Other"
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

     //-----YYY----- Update the title
    let defaultTitleStart = "Refugees, asylum seekers, internally displaced persons, returnees and stateless persons ";
    let defaultTitleEnd = " in Europe";

    // Lets try to get the 3 most common types of PoCs in a formatted list
    let popTypes = dn.GetObjInList(chartGroup.Charts(), "ChartID", "PT");
    if (dn.IsDefined(popTypes)) {

        // Identify the most common population types in the filtered data
        let popTypesFilteredData = chartGroup.GetInfo2DFlex("PT", null, chartGroup.filteredJSData, true, null, "Count");
        // Remove popTypes with zero count.
        popTypesFilteredData = popTypesFilteredData.filter(function (v) {
            return v.Count > 0;
        });

        let listLength = 3;
        let fullListLonger = popTypesFilteredData.length > listLength;

        if (dn.IsDefined(popTypesFilteredData) && popTypesFilteredData.length > 0) {

            let t = "";
            for (let i = 0; i < popTypesFilteredData.length && i < listLength; i++) {

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
    d3.select(".VisTitle").style("width", (docWidth-20) + "px").style("margin", 10 + "px");
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


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Resize the content when the browser window is resized.  Not really needed for the mobile apps, but very useful for all the debugging
window.addEventListener('resize', function (event) {
    // We encapsulate the DrawResponsively in a timeout as otherwise we get a taking too long warning violation in Chrome...
    // And we dont want to let this fire off until the chartGroup has been initialised ...
    if (!dn.IsDefined(initialURL)) {
        window.setTimeout("DrawResponsively();", 1);
    }
    
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Add the event listener for the popstate too
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

