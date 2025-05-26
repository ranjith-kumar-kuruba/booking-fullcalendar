import { LightningElement } from 'lwc';
import isValidBooking from '@salesforce/apex/BookingController.isValidBooking';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AddBooking extends LightningElement {

    async handleSubmit(event) {

        event.preventDefault();
        const fields = event.detail.fields;
        const isValid = await isValidBooking({
            vehicleId: fields.Vehicle__c,
            startDateTime: fields.Start_Datetime__c,
            endDateTime: fields.End_Datetime__c
        });

        if (!isValid) {
            this.showToast(
                'Error',
                'This time slot is already booked. Please choose a different time.',
                'error')
            return;
        }

        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleSuccess() {
        console.log('Entering success')
        this.dispatchEvent(new CustomEvent("recordsuccess"));
    }

    handleClose() {
        this.dispatchEvent(new CustomEvent("closemodal"));
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            })
        );
    }
}