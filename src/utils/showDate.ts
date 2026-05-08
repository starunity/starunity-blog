const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
})

function showDate(date: Date): string {
  return dateFormatter.format(new Date(date))
}

export default showDate
