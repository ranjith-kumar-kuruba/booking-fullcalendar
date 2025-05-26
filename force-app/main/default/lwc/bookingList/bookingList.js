import { LightningElement, wire, api } from 'lwc';
import getBookings from '@salesforce/apex/BookingController.getBookings';

const bookingColumns = [
    {
        label: 'Vehicle Name',
        fieldName: 'VehicleLink',
        type: 'url',
        typeAttributes: { label: { fieldName: 'VehicleName' }, target: '_blank' }
    },
    { label: 'Vehicle Rent', fieldName: 'VehicleRent', type: 'currency' },
    { label: 'Customer Name', fieldName: 'CustomerName' },
    { label: 'Total Amount', fieldName: 'TotalAmount', type: 'currency' },
    { label: 'Status', fieldName: 'Status' },
    // { label: 'Start Date/Time', fieldName: 'StartDate' },
    // { label: 'End Date/Time', fieldName: 'EndDate' },
    // { label: 'Start Location', fieldName: 'StartLocation' },
    // { label: 'End Location', fieldName: 'EndLocation' }
];

export default class BookingList extends LightningElement {

    bookings = [];
    columns = bookingColumns;

    connectedCallback() {
        this.getBookingsData();
    }

    @api
    getBookingsData() {
        getBookings()
            .then((data) => {
                this.bookings = data;
                this.displayBookings(data);
                this.dispatchEvent(new CustomEvent('bookings', {
                    detail: {
                        bookings: this.bookings,
                        isInitialLoad: true
                    }
                }));
            }).catch((error) => {
                console.error('Error fetching bookings:', error);
            })
    }

    get isBookings() {
        return this.bookings.length > 0;
    }


    @api
    displayBookings(data) {
        let processedData = [];

        data.forEach(item => {
            let newData = { ...item };
            newData.VehicleLink = '/' + item.Id;
            newData.VehicleName = item.Vehicle__r.Name;
            newData.VehicleRent = item.Vehicle__r.Rent__c;
            newData.CustomerName = item.Customer__r.Name;
            newData.StartDate = item.Start_Datetime__c;
            newData.EndDate = item.End_Datetime__c;
            newData.StartLocation = item.Start_Location__r.Name;
            newData.EndLocation = item.End_Location__r.Name;
            newData.Status = item.Status__c;
            newData.TotalAmount = item.Total_Amount__c;
            processedData.push(newData);
        });
        this.bookings = processedData;
    }

}