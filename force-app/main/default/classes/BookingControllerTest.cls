@IsTest
public class BookingControllerTest {
    @testSetup
    static void setupTestData() {
        Vehicle__c vehicle = new Vehicle__c(Name = 'Test Vehicle', Rent__c = 100);
        insert vehicle;

        Contact customer = new Contact(LastName = 'Test Customer');
        insert customer;

        Location__c startLocation = new Location__c(Name = 'Start Location');
        insert startLocation;

        Location__c endLocation = new Location__c(Name = 'End Location');
        insert endLocation;

        Booking__c booking = new Booking__c(
            Vehicle__c = vehicle.Id,
            Customer__c = customer.Id,
            Start_Datetime__c = DateTime.now(),
            End_Datetime__c = DateTime.now().addHours(2),
            Start_Location__c = startLocation.Id,
            End_Location__c = endLocation.Id,
            Status__c = 'Confirmation'
        );
        insert booking;
    }

    @IsTest
    static void testGetBookings() {
        // Call the method to be tested
        List<Booking__c> bookings = BookingController.getBookings();

        // Assert the results
        System.assertEquals(1, bookings.size(), 'Expected one booking record');
        Booking__c booking = bookings[0];
        System.assertEquals('Test Vehicle', booking.Vehicle__r.Name, 'Incorrect vehicle name');
        System.assertEquals(100, booking.Vehicle__r.Rent__c, 'Incorrect vehicle rent');
        System.assertEquals('Test Customer', booking.Customer__r.Name, 'Incorrect customer name');
        System.assertEquals('Start Location', booking.Start_Location__r.Name, 'Incorrect start location name');
        System.assertEquals('End Location', booking.End_Location__r.Name, 'Incorrect end location name');
        System.assertEquals('Confirmation', booking.Status__c, 'Incorrect booking status');
    }
    
    @IsTest
    static void testIsValidBooking() {
        Vehicle__c vehicle = new Vehicle__c(Name = 'Test Vehicle', Rent__c = 100);
        insert vehicle;

        Booking__c booking = new Booking__c(
            Vehicle__c = vehicle.Id,
            Start_Datetime__c = DateTime.now(),
            End_Datetime__c = DateTime.now().addHours(2),
            Status__c = 'Confirmation'
        );
        insert booking;

        Test.startTest();
        Boolean isValid = BookingController.isValidBooking(vehicle.Id, DateTime.now().addHours(1), DateTime.now().addHours(3));
        Test.stopTest();

        System.assertEquals(false, isValid, 'Booking should not be valid during overlapping time');
    }

}