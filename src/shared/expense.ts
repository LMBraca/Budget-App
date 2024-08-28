import { Entity, Fields } from "remult";

@Entity("expense", {
    allowApiCrud: true,
})

export class Expense {
    @Fields.autoIncrement()
    id = 0;
    @Fields.number()
    expense = 0;
    @Fields.string()
    description = "";
    @Fields.string()
    location = "";
    @Fields.date()
    date = new Date();
}