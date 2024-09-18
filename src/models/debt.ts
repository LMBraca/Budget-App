import { Entity, Fields } from "remult";

@Entity("debt", {
    allowApiCrud: true,
})
export class Debt {
    @Fields.autoIncrement()
    idDebt = 0; // This corresponds to the "IdDebt" column in the database

    @Fields.number()
    debt = 0; // This corresponds to the "Debt" column in the database

    @Fields.string()
    description = ""; // This corresponds to the "Description" column in the database

    @Fields.string()
    name = ""; // This corresponds to the "Name" column in the database

    @Fields.date()
    date = new Date(); // This corresponds to the "Date" column in the database (timestamptz)

    @Fields.number()
    idUser = 0;

    @Fields.boolean()
    paid = false;
}
