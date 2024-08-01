// const weatherForm = document.querySelector('form');
const p1 = document.querySelector('#m1');
const p2 = document.querySelector('#m2');
const facilitiesListButton = document.querySelector('#facilities-list')
const facilitiesEquipmentListForm = document.querySelector('#facility-equipment-list')
const equipmentSensorListForm = document.querySelector('#equipment-sensor-list')
const sensorLatestForm = document.querySelector('#sensor-latest')
const sensorIdTargetLatest = sensorLatestForm.querySelector('#sensorId')
const numReadingsTargetLatest = sensorLatestForm.querySelector('#numReadings')
const sensorSpikesForm = document.querySelector('#sensor-spikes')
const sensorIdTargetSpikes = sensorSpikesForm.querySelector('#sensorId')
const numReadingsTargetSpikes = sensorSpikesForm.querySelector('#numReadings')
const paramTargetSpikes = sensorSpikesForm.querySelector('#parameter')
const facilityIdTarget = facilitiesEquipmentListForm.querySelector('input');
const equipmentIdTarget = equipmentSensorListForm.querySelector('input');


facilitiesListButton.addEventListener('click', () => {
    p1.textContent = 'Loading list of facilities in refinery...'
    fetch('/api/facilities').then( response => {
        response.json().then( data => {
            if (data.error){
                p1.textContent = data.error;
                p2.textContent = ' ';
            }
            else{
                p1.textContent = "The following is the list of facilities in the refinery:\n" + data
            }
        })
    })
})


facilitiesEquipmentListForm.addEventListener('submit', e => {
    e.preventDefault();
    const facilityId = facilityIdTarget.value;
    p1.textContent = "Loading Facility Information...";
    p2.textContent = "";
    let url = '/api/facilities/' + facilityId + '/equipment'
    console.log(url)
    fetch(url).then( response => {
    response.json().then( data => {
        if (data.error){
            p1.textContent = data.error;
            p2.textContent = ' ';
        }
        else{
            p1.textContent = "The following is the list of equipment in the facility:\n" + data
        }
    })
})
})

equipmentSensorListForm.addEventListener('submit', e => {
    e.preventDefault();
    const equipmentId = equipmentIdTarget.value;
    p1.textContent = "Loading Equipment Information...";
    p2.textContent = "";
    let url = '/api/equipment/' + equipmentId + '/sensors'
    console.log(url)
    fetch(url).then( response => {
    response.json().then( data => {
        if (data.error){
            p1.textContent = data.error;
            p2.textContent = ' ';
        }
        else{
            p1.textContent = "The following is the list of sensors monitoring the equipment:\n" + data
        }
    })
})
})


sensorLatestForm.addEventListener('submit', e => {
    e.preventDefault();
    const sensorId = sensorIdTargetLatest.value
    const numReadings = numReadingsTargetLatest.value
    p1.textContent = "Loading Sensor Readings...";
    p2.textContent = "";
    let url = '/api/sensor/' + sensorId + '/latest?num=' + numReadings
    console.log(url)
    fetch(url).then( response => {
    response.json().then( data => {
        if (data.error){
            p1.textContent = data.error;
            p2.textContent = ' ';
        }
        else{
            p1.textContent = "The following is the readings of sensors monitoring the equipment:\n" + data
        }
    })
})
})


sensorSpikesForm.addEventListener('submit', e => {
    e.preventDefault();
    const sensorId = sensorIdTargetSpikes.value
    const numReadings = numReadingsTargetSpikes.value
    const param = paramTargetSpikes.value
    p1.textContent = "Loading Sensor Readings...";
    p2.textContent = "";
    let url = '/api/sensor/' + sensorId + '/spikes?num=' + numReadings + '&parameter=' + param
    console.log(url)
    fetch(url).then( response => {
    response.json().then( data => {
        if (data.error){
            p1.textContent = data.error;
            p2.textContent = ' ';
        }
        else{
            p1.textContent = "The following is the spikes in readings of sensors monitoring the equipment:\n" + data
        }
    })
})
})
