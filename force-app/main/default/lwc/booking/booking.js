import { LightningElement, track, wire } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import fullCalendarJS from '@salesforce/resourceUrl/fullCalendarJS';
import { displayEvents } from 'c/utils'

export default class Booking extends LightningElement {

    vehicleId;
    events = []
    allBookings = []
    bookings = []

    displayInfo = {
        primaryField: 'Name',
        additionalFields: ['Rent__c'],
    };

    handleChange(event) {
        this.vehicleId = event.detail.recordId;
        const data = this.vehicleId === null ? this.allBookings : this.allBookings.filter(booking => booking.Vehicle__c === this.vehicleId);
        this.template.querySelector('c-booking-list').displayBookings(data);
        this.bookings = data;
        this.events = []
        this.renderCalendar(data)
    }

    get isBookings() {
        return this.bookings.length > 0;
    }

    handleBookings(event) {
        const data = event.detail;
        this.allBookings = data.bookings;
        this.bookings = data.bookings;
        if (data.isInitialLoad && this.bookings.length > 0)
            this.renderCalendar(data.bookings);
    }

    renderCalendar(data) {
        this.events = displayEvents(data);
        console.log(this.events.length)
        if (this.events.length > 0) {
            const calendarElement = this.template.querySelector('.calendar');
            if (calendarElement === null) {
                this.isRendred = false;
                this.initCalendar();
            } else if (calendarElement) {
                $(calendarElement).fullCalendar('destroy')
                this.initCalendar();
                //$(calendarElement).fullCalendar('renderEvents', this.events, true)
            }

        }
    }


    isRendred = false;

    renderedCallback() {
        if (this.isRendred) {
            return;
        }
        this.isRendred = true;

        Promise.all([
            loadScript(this, fullCalendarJS + '/fullcalendarV3/lib/jquery.min.js'),
            loadScript(this, fullCalendarJS + '/fullcalendarV3/lib/moment.min.js'),
            loadScript(this, fullCalendarJS + '/fullcalendarV3/fullcalendar.js'),
            loadStyle(this, fullCalendarJS + '/fullcalendarV3/fullcalendar.css'),
        ])
            .then(() => {
                console.log('FullCalender Loaded -->' + this.events.length)
                this.initCalendar();
            })
            .catch((error) => {
                console.log('Error While Loading FullCalendar Resources', JSON.stringify(error));
            })

    }

    initCalendar() {
        try {
            const calendarElement = this.template.querySelector('.calendar');
            $(calendarElement).fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'basicDay,basicWeek,month,nextYear'
                },
                defaultDate: new Date(),
                eventLimit: true,
                events: this.events,
                eventClick: function (calEvent, jsEvent, view) {
                    const titleDescription = calEvent.title + ' - ' + calEvent.description;
                    alert('Event: ' + titleDescription);
                    // alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
                    // alert('View: ' + view.name);
                    // $(this).css('border-color', 'red');
                }
            });

        } catch (error) {
            console.error('Error while Rendering the Calendar', JSON.stringify(error));

        }
    }

    isModal = false;

    handleBooking() {
        this.isModal = true;
    }

    handleSuccess() {
        console.log('Engering')
        this.isModal = false;
        this.template.querySelector('c-booking-list').getBookingsData(false);
    }

    handleClose() {
        this.isModal = false;
    }

}