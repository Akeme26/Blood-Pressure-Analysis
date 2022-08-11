//Collecting user inputs

const arrayHeader = ["Name", "Email", "Systolic", "Diastolic"];

let Name = document.getElementById('name');
let email = document.getElementById('email');
let topValue = document.getElementById('top');
let bottomValue = document.getElementById('bottom');

//Setting & Getting database
let userRecords = []

if (!localStorage.getItem('database')) {
	localStorage.setItem('database', JSON.stringify(userRecords));
}

//function to calculate BP
let diastolic_value = document.getElementById('bottom');

diastolic_value.addEventListener('keyup', BP);

//BP Analysis Function

function BP() {
    let topValue = document.querySelector('#top').value;
    let bottomValue = document.querySelector('#bottom').value;
    
    if (topValue && bottomValue != ""){
        if (topValue < 120 && bottomValue < 80){
            
            result = document.getElementById("result1");
            result.style.backgroundColor = "lightgreen";
            result.innerHTML = "Blood Pressure is NORMAL"
            
        } else if ((topValue >= 120 && topValue <= 129) && (bottomValue < 80)) {
            
            result = document.getElementById("result1");
            result.style.backgroundColor = "orange";
            result.innerHTML = "Blood Pressure is ELEVATED"
            
        } else if ((topValue >= 130 && topValue <= 139) || (bottomValue >= 80 && bottomValue <= 89)) {
            
            result = document.getElementById("result1");
            result.style.backgroundColor = "darkorange";
            result.innerHTML = "Blood Pressure is High (Stage 1 Hypertension)"
            
        } else if ((topValue >= 140 && topValue <= 180) || (bottomValue >= 90 && bottomValue <=120) ) {
            
            result = document.getElementById("result1");
            result.style.backgroundColor = "red";
            result.innerHTML = "Blood Pressure is High (Stage 2 Hypertension)"
            
        } else if ((topValue > 180) && (bottomValue > 120)) {
        
            result = document.getElementById("result1");
            result.style.backgroundColor = "darkred";
            result.innerHTML = "Patient is in Hypertensive Crisis (Seek Medical Attention ASAP)"
            
        } else if ((topValue > 180) || (bottomValue > 120)) {
            
            result = document.getElementById("result1");
            result.style.backgroundColor = "darkred";
            result.innerHTML = "Patient is in Hypertensive Crisis (Seek Medical Attention ASAP)"
            
        }
    }
}

//Function to add user data to csv  @Tested 100%
function add_data_To_database() {
    if (Name.value !== '' && email.value !== '' && topValue.value !== '' && bottomValue.value !== '') {
    
        let database = JSON.parse(localStorage.getItem('database'));
        
        let sub_data = new Object();
        sub_data.Name = Name.value;
        sub_data.Email = email.value;
        sub_data.Systolic =  topValue.value;
        sub_data.Diastolic = bottomValue.value;
        
        database.push(sub_data)
        localStorage.setItem('database', JSON.stringify(database));

        //clear user input
        Name.value = '';
        email.value = '';
        topValue.value = '';
        bottomValue.value = '';
        
        
        console.log(database);
        console.log('record added');
        notification()

        result = document.getElementById("result1");
        result.style.backgroundColor = "red";
        result.innerHTML = "Your result will show here"

    } else {
        errorSaving();
    }
}

//Function to notify user of saved record @TESTED 100%
const alertPlaceholder = document.getElementById('liveAlertPlaceholder');


const alert = (message, type) => {
	const wrapper = document.createElement('div')
	wrapper.innerHTML = [
		`<div class="alert alert-${type} alert-dismissible" role="alert">`,
		`   <div>${message}</div>`,
		'   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
		'</div>'
	].join('')
	alertPlaceholder.append(wrapper)
}

async function delay(delayInms) {
	return new Promise(resolve  => {
		setTimeout(() => {
			resolve(2);
		}, delayInms);
	});
}


async function notification() {
	alert('Succefully added Record to Database!', 'success');
	let delayres = await delay(3000);
	//Hide alert
	alertPlaceholder.innerHTML = '';
}

async function errorSaving() {
	alert('Failed to Add Record!!... All inputs must be filled.', 'danger');
	let delayres = await delay(3000);
	//Hide alert
	alertPlaceholder.innerHTML = '';
}

//Function to download a csv of all records in database object @100% tested

let delimiter = ',';
fileName = 'user_data';

function export_csv() {
    let header = arrayHeader.join(',') + '\n';
    let csv = header;
	let database = JSON.parse(localStorage.getItem('database'));
    database.forEach( obj => {
        let row = [];
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                row.push(obj[key]);
            }
        }
        csv += row.join(',')+"\n";
    });

    let csvData = new Blob([csv], { type: 'text/csv' });  
    let csvUrl = URL.createObjectURL(csvData);

    let hiddenElement = document.createElement('a');
    hiddenElement.href = csvUrl;
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName + '.csv';
    hiddenElement.click();
}
