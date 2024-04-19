import DueDate from '../models/due-date'

export function setDueDate(dueDate: string) {
    DueDate.set(dueDate)
}
