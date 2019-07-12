export function getFormattedTime(fourDigitTime) {
  const hours24 = parseInt(fourDigitTime.substring(0, 2))
  const hours = ((hours24 + 11) % 12) + 1
  const suffix = hours24 >= 12 ? 'pm' : 'am'
  const minutes = fourDigitTime.substring(2)
  return hours + ':' + minutes + suffix
}

export function getDayOfWeek(n, isAbbrev = true) {
  const weekdays = [
    ['Sun', 'Sunday'],
    ['Mon', 'Monday'],
    ['Tue', 'Tuesday'],
    ['Wed', 'Wednesday'],
    ['Thur', 'Thursday'],
    ['Fri', 'Friday'],
    ['Sat', 'Saturday']
  ]

  return isAbbrev ? weekdays[n][0] : weekdays[n][1]
}
