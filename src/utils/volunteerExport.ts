import { jsPDF } from 'jspdf'

export function downloadTextFile(filename: string, contents: string, mimeType: string): void {
  const blob = new Blob([contents], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function csvEscape(value: string): string {
  if (value.includes('"') || value.includes(',') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replaceAll('"', '""')}"`
  }
  return value
}

function rowsToCsv(header: readonly string[], rows: readonly (readonly string[])[]): string {
  const lines = [header.join(','), ...rows.map((row) => row.map(csvEscape).join(','))]
  return `${lines.join('\n')}\n`
}

interface PdfColumn {
  readonly heading: string
  readonly x: number
  readonly width: number
}

function downloadPdfTable(
  filename: string,
  title: string,
  columns: readonly PdfColumn[],
  rows: readonly (readonly string[])[],
): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  doc.setFontSize(14)
  doc.text(title, 14, 16)
  doc.setFontSize(10)
  let y = 28
  for (const column of columns) {
    doc.text(column.heading, column.x, y)
  }
  y += 8
  for (const row of rows) {
    let rowHeight = 6
    const wrapped: string[][] = []
    for (let index = 0; index < columns.length; index += 1) {
      const cell = row[index] ?? ''
      const column = columns[index]
      const width = column === undefined ? 40 : column.width
      const lines = doc.splitTextToSize(cell, width)
      const cellLines = Array.isArray(lines) ? lines : [lines]
      wrapped.push(cellLines)
      if (cellLines.length * 5 > rowHeight) {
        rowHeight = cellLines.length * 5
      }
    }
    if (y + rowHeight > 190) {
      doc.addPage()
      y = 16
    }
    for (let index = 0; index < wrapped.length; index += 1) {
      const lines = wrapped[index]
      const column = columns[index]
      if (lines === undefined || column === undefined) {
        continue
      }
      doc.text(lines, column.x, y)
    }
    y += rowHeight + 2
  }
  doc.save(filename)
}

export interface VolunteerExportRow {
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly address: string
}

export function volunteerRowsToCsv(rows: readonly VolunteerExportRow[]): string {
  return rowsToCsv(
    ['Name', 'Email', 'Phone', 'Address'],
    rows.map((row) => [row.name, row.email, row.phone, row.address]),
  )
}

export function downloadVolunteerCsv(rows: readonly VolunteerExportRow[]): void {
  downloadTextFile('volunteers.csv', volunteerRowsToCsv(rows), 'text/csv;charset=utf-8')
}

export function downloadVolunteerPdf(rows: readonly VolunteerExportRow[]): void {
  downloadPdfTable(
    'volunteers.pdf',
    'Volunteer contact list',
    [
      { heading: 'Name', x: 14, width: 48 },
      { heading: 'Email', x: 64, width: 58 },
      { heading: 'Phone', x: 124, width: 48 },
      { heading: 'Address', x: 174, width: 100 },
    ],
    rows.map((row) => [row.name, row.email, row.phone, row.address]),
  )
}

export interface EventExportRow {
  readonly title: string
  readonly date: string
  readonly time: string
  readonly location: string
  readonly status: string
}

export function eventRowsToCsv(rows: readonly EventExportRow[]): string {
  return rowsToCsv(
    ['Title', 'Date', 'Time', 'Location', 'Status'],
    rows.map((row) => [row.title, row.date, row.time, row.location, row.status]),
  )
}

export function downloadEventCsv(rows: readonly EventExportRow[]): void {
  downloadTextFile('events.csv', eventRowsToCsv(rows), 'text/csv;charset=utf-8')
}

export function downloadEventPdf(rows: readonly EventExportRow[]): void {
  downloadPdfTable(
    'events.pdf',
    'Event list',
    [
      { heading: 'Title', x: 14, width: 70 },
      { heading: 'Date', x: 86, width: 32 },
      { heading: 'Time', x: 120, width: 36 },
      { heading: 'Location', x: 158, width: 70 },
      { heading: 'Status', x: 230, width: 28 },
    ],
    rows.map((row) => [row.title, row.date, row.time, row.location, row.status]),
  )
}

export interface OperationsReportData {
  readonly title: string
  readonly generatedOn: string
  readonly metrics: readonly { readonly value: string; readonly caption: string }[]
  readonly monthHours: readonly { readonly label: string; readonly hours: number }[]
}

export function downloadOperationsReportPdf(data: OperationsReportData): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  doc.setFontSize(16)
  doc.text(data.title, 14, 18)
  doc.setFontSize(10)
  doc.text(`Generated ${data.generatedOn}`, 14, 26)
  let y = 38
  doc.setFontSize(12)
  doc.text('Key metrics', 14, y)
  y += 8
  doc.setFontSize(10)
  for (const metric of data.metrics) {
    doc.text(`${metric.value} — ${metric.caption}`, 14, y)
    y += 7
  }
  y += 6
  doc.setFontSize(12)
  doc.text('Volunteer hours by month', 14, y)
  y += 8
  doc.setFontSize(10)
  for (const row of data.monthHours) {
    if (y > 280) {
      doc.addPage()
      y = 16
    }
    doc.text(`${row.label}: ${String(row.hours)} hours`, 14, y)
    y += 7
  }
  doc.save('operations-report.pdf')
}
