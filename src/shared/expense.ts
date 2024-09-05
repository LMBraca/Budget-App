import { Entity, Fields } from "remult";

@Entity("expense", {
    allowApiCrud: true,
})
export class Expense {
    @Fields.autoIncrement()
    id = 0; // This corresponds to the "IdExpense" column in the database

    @Fields.number()
    expense = 0; // This corresponds to the "Expense" column in the database

    @Fields.string()
    description = ""; // This corresponds to the "Description" column in the database

    @Fields.string()
    location = ""; // This corresponds to the "Location" column in the database

    @Fields.date()
    date = new Date(); // This corresponds to the "Date" column in the database (timestamp)

    // The "time" field is not present in your database, so it should be removed from the model
    // @Fields.string()
    // time = ""; // Remove this line

    @Fields.number()
    idUser = 0; // This corresponds to the "IdUser" column in the database
}
