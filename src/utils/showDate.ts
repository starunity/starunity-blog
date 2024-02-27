import { format } from 'date-fns'

function showDate(date: Date): string {
  return format(new Date(date), 'PP')
}

export default showDate
