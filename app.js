
var fs = require("fs");
var { create } = require('xmlbuilder2');

//Read the input text file
var inputArray = fs.readFileSync('input.txt').toString().split("\n");

//Check that the list starts with a person
try {
    if (!inputArray[0].startsWith('P')) throw 'Add a person first'
} catch (error) {
    console.log(error);
    process.exit();
}

const splitTerm = '|';
var personClosed;
var familyClosed;
var tree = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('people');

for (let i = 0; i < inputArray.length; i++) {

    //Checking for person
    if (inputArray[i].startsWith('P')) {

        personClosed = false;
        familyClosed = true;

        var str = inputArray[i].split(splitTerm);

        //Error handling, missing input
        try {
            if (str[1] == undefined) throw 'No first name'
            if (str[2] == undefined) throw 'No last name'
        } catch (error) {
            console.log(error);
            process.exit();
        }

        tree
            .ele('person')
            .ele('firstname').txt(str[1]).up()
            .ele('lastname').txt(str[2].replace('\r', ''));

        //Checking for Family
    } else if (inputArray[i].startsWith('F') && !personClosed) {

        familyClosed = false;

        var str = inputArray[i].split(splitTerm);

        try {
            if (str[1] == undefined) throw 'No name'
            if (str[2] == undefined) throw 'No birth date'
        } catch (error) {
            console.log(error);
            process.exit();
        }

        tree
            .last()
            .ele('family')
            .ele('name').txt(str[1]).up()
            .ele('birthdate').txt(str[2].replace('\r', ''));

        //Checking for phone
    } else if (inputArray[i].startsWith('T') && !personClosed) {

        var str = inputArray[i].split(splitTerm);

        try {
            if (str[1] == undefined) throw 'No mobile number'
            if (str[2] == undefined) throw 'No fixed line number'
        } catch (error) {
            console.log(error);
            process.exit();
        }

        //If family is closed input phone to person 
        if (familyClosed) {
            tree
                .last()
                .ele('phone')
                .ele('mobile').txt(str[1]).up()
                .ele('fixedline').txt(str[2].replace('\r', ''));
        } else {
            tree
                .last()
                .last()
                .ele('phone')
                .ele('mobile').txt(str[1]).up()
                .ele('fixedline').txt(str[2].replace('\r', ''));
        }

        //Checking for Address
    } else if (inputArray[i].startsWith('A') && !personClosed) {

        var str = inputArray[i].split(splitTerm);
        //Error handling, missing input
        try {
            if (str[1] == undefined) throw 'No street name'
            if (str[2] == undefined) throw 'No city name'
        } catch (error) {
            console.log(error);
            process.exit();
        }

        //Check if postal code is missing
        if (str[3] == undefined) {
            str[3] = ' ';
            str[2] = str[2].replace('\r', '');
        }
        //If family is closed input address to person
        if (familyClosed) {
            tree
                .last()
                .ele('address')
                .ele('street').txt(str[1]).up()
                .ele('city').txt(str[2]).up()
                .ele('postalcode').txt(str[3].replace('\r', ''));
        } else {
            tree
                .last()
                .last()
                .ele('address')
                .ele('street').txt(str[1]).up()
                .ele('city').txt(str[2]).up()
                .ele('postalcode').txt(str[3].replace('\r', ''));

        }


    }

}

//Convert the xml to string
const xml = tree.end({ prettyPrint: true });

//Creates the output file 
fs.writeFile('./output.xml', xml, function (err) {
    if (err)
        return console.log(err);
    console.log('Output file was created');
});