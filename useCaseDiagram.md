```mermaid
usecaseDiagram
    actor Patient
    actor Doctor
    actor Admin

    package "CAN-CURE System" {
        usecase "Register/Login" as UC1
        usecase "Search Doctors" as UC2
        usecase "Book Appointment" as UC3
        usecase "Upload Medical Reports" as UC4
        usecase "View Prescriptions" as UC5
        usecase "Manage Time Slots" as UC6
        usecase "Prescribe Medicine" as UC7
        usecase "View Processed Reports (OCR)" as UC8
        usecase "Manage Users" as UC9
    }

    Patient --> UC1
    Patient --> UC2
    Patient --> UC3
    Patient --> UC4
    Patient --> UC5

    Doctor --> UC1
    Doctor --> UC6
    Doctor --> UC7
    Doctor --> UC8
    Doctor --> UC3

    Admin --> UC1
    Admin --> UC9
```
