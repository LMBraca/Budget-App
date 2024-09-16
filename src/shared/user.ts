import { Entity, Fields } from "remult";

@Entity("user", {
    allowApiCrud: true,
})
export class User {
    @Fields.autoIncrement()
    idUser = 0; // This corresponds to the "IdExpense" column in the database

    @Fields.string()
    username = ""; // This corresponds to the "Expense" column in the database

    @Fields.string()
    password = ""; // This corresponds to the "Description" column in the database

    @Fields.number()
    weeklyIncome = "";
    
}
