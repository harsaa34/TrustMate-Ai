import { Expense, ExpenseDocument } from '../../../expense/expense.schema';
import { ExpenseDomain } from '../../../expense/expense.domain';
export declare class ExpenseMapper {
    static toDomain(expense: ExpenseDocument): ExpenseDomain | null;
    static toEntity(domain: ExpenseDomain): Partial<Expense>;
}
