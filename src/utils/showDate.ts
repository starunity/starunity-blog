import { format } from 'date-fns'

function showDate(date: string): string {
  return format(new Date(date), 'PP')
}

export default showDate
