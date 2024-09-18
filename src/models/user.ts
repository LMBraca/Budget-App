import { Entity, Fields } from "remult";

@Entity("user", {
    allowApiCrud: true,
})
export class User {
    @Fields.autoIncrement()
    idUser = 0; // This corresponds to the "IdUser" column in the database

    @Fields.string()
    username = ""; // This corresponds to the "Username" column in the database

    @Fields.string()
    password = ""; // This corresponds to the "Password" column in the database

    @Fields.number()
    weeklyIncome = 0; // This corresponds to the "WeeklyIncome" column in the database

    @Fields.number()
    payday = 0; // This corresponds to the "Payday" column in the database

    @Fields.date()
    startDate = new Date(); // This corresponds to the "StartDate" column in the database
}
