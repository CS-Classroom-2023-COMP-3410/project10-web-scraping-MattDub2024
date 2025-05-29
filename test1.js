const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

axios.get("https://bulletin.du.edu/undergraduate/majorsminorscoursedescriptions/traditionalbachelorsprogrammajorandminors/computerscience/#coursedescriptionstext")
    .then(response => {
        const $ = cheerio.load(response.data);
        // Extract data using jQuery-like selectors
        const pageTitle = $('title').text();
        console.log('Page Title:', pageTitle);


        //const courseDescriptions = $('#coursedescriptionstextcontainer .sc_sccoursedescs .courseblock .courseblocktitle').text();
        // console.log('Course Descriptions:', courseDescriptions);


        const data = [];
        const courselist = [];

        $('#coursedescriptionstextcontainer .sc_sccoursedescs .courseblock').each((index, row) => {

            const cells = $(row).find('.courseblocktitle');
            const rowData = cells.map((cellIndex, cell) => $(cell).text()).get();

            const description = $(row).find('.courseblockdesc');


            const a = description.find('a');
            //checking if link is not there and it is a 3000 level class
            if (a.length === 0 && rowData[0][5] === '3') {
                data.push(rowData[0]);
                courselist.push({
                    course: rowData[0].slice(0,9),
                    tittle: rowData[0].slice(10, -1)
                });
            }


            const jsonOutput = {
                courses: courselist
            };

            fs.writeFileSync('results/bulletin.json', JSON.stringify(jsonOutput, null, 2));
        });


        console.log('Course Descriptions:', data);
    })

    .catch(error => {
        console.error('Error fetching and parsing the page:', error);
    });
