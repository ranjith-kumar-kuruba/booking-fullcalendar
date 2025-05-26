import { LightningElement, api, wire } from 'lwc';
import getLocationById from '@salesforce/apex/BookingController.getLocationById';

export default class BookingMap extends LightningElement {
    @api recordId;
    isLoaded = false;
    mapMarkers = []

    @wire(getLocationById, { recordId: '$recordId' })
    wiredData({ error, data }) {
        if (data) {
            this.displayMap(data)
            this.isLoaded = true;
        } else if (error) {
            console.error('Error:', error);
        }
    }

    displayMap(data) {
        data.forEach(item => {
            const startMarkers = {
                location: {
                    Latitude: item.Start_Location__r.Geolocation__Latitude__s,
                    Longitude: item.Start_Location__r.Geolocation__Longitude__s
                },
                title: item.Start_Location__r.Name,
                value: 'Start Location'

            }
            const endMarkers = {
                location: {
                    Latitude: item.End_Location__r.Geolocation__Latitude__s,
                    Longitude: item.End_Location__r.Geolocation__Longitude__s
                },
                title: item.End_Location__r.Name,
                value: 'End Location'

            }
            this.mapMarkers.push(startMarkers);
            this.mapMarkers.push(endMarkers)
        });
    }

}