export function downloadCSVFile(csv_data: string, tab: string) {
  const CSVFile = new Blob([csv_data], { type: 'text/csv' })

  const temp_link = document.createElement('a')

  temp_link.download = `${tab}.csv`
  const url = window.URL.createObjectURL(CSVFile)
  temp_link.href = url

  temp_link.style.display = 'none'
  document.body.appendChild(temp_link)

  temp_link.click()
  document.body.removeChild(temp_link)
}
