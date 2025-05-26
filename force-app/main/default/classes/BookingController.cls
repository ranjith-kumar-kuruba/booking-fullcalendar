public with sharing class BookingController {
    
    @AuraEnabled
    public static List<Booking__c> getBookings(){
        return [SELECT Id, 
                Name, 
                Vehicle__c,
                Vehicle__r.Name,
                Vehicle__r.Rent__c, 
                Customer__r.Name, 
                Start_Datetime__c, 
                End_Datetime__c,
                End_Location__r.Name,
                Start_Location__r.Name,
                Status__c,
                No_Of_Hours__c,
                Total_Amount__c
                FROM  Booking__c 
                WITH SECURITY_ENFORCED
                ORDER BY Name
                LIMIT 50000];
        
    }
    
    @AuraEnabled
    public static Boolean isValidBooking(Id vehicleId, Datetime startDatetime, Datetime endDatetime){
        List<Booking__c> bookings = [SELECT Id, Name, Vehicle__c, Start_Datetime__c, End_Datetime__c
                                     FROM Booking__c 
                                     WHERE Vehicle__c =: vehicleId
                                     AND (
                                         Start_DateTime__c <= :endDatetime AND End_DateTime__c >= :startDatetime
                                     )
                                     WITH SECURITY_ENFORCED];
        
        return bookings.isEmpty();
    }

    @AuraEnabled(cacheable=true)
    public static List<Booking__c> getLocationById(Id recordId){
        return [SELECT Id, 
                Name, 
                Vehicle__r.Name,
                Vehicle__r.Rent__c, 
                Customer__r.Name, 
                Start_Datetime__c, 
                End_Datetime__c,
                End_Location__r.Name,
                Start_Location__r.Name,
                End_Location__r.Geolocation__Latitude__s,
                Start_Location__r.Geolocation__Latitude__s,
                End_Location__r.Geolocation__Longitude__s,
                Start_Location__r.Geolocation__Longitude__s
                FROM  Booking__c 
                WHERE Id =: recordId
                WITH SECURITY_ENFORCED
                ORDER BY Name
                LIMIT 50000];
        
    }
}