'use client'
import { useState, useEffect, useMemo, Fragment } from 'react'
import Image from 'next/image'
import styles from './timeline.module.css'
import { data } from './timelineData'

// The axis spans whole years around the data, from January of the earliest
// start to the January after the latest end, labelled every five years.
// (UTC because '2015-01-01' parses as UTC midnight, which is still 2014
// in US time zones.)
const firstYear = Math.min(...data.lines.map((l) => l.startDate.getUTCFullYear()))
const lastYear = Math.max(...data.lines.map((l) => l.endDate.getUTCFullYear())) + 1
const timelineStart = new Date(`${firstYear}-01-01`)
const timelineEnd = new Date(`${lastYear}-01-01`)
const legendYears = Array.from(
  { length: Math.floor((lastYear - firstYear) / 5) + 1 },
  (_, i) => firstYear + i * 5
)

interface TimelineStop {
  date: Date
  name: string
  description: string
  iconPath?: string
  emoji?: string
}

interface TimelineLine {
  name: string
  startDate: Date
  endDate: Date
  stops: TimelineStop[]
  color: string
  description: string
  logoPath: string
  location: string
}

interface TimelineData {
  lines: TimelineLine[]
}

interface RowAssignment {
  line: TimelineLine
  row: number
}

const Timeline = () => {
  const [selectedStop, setSelectedStop] = useState<TimelineStop | null>(null)
  const [selectedLine, setSelectedLine] = useState<TimelineLine | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  const timelineData: TimelineData = { ...data }

  // Helper function to organize lines into optimal rows
  const organizeIntoRows = (lines: TimelineLine[]): TimelineLine[][] => {
    // Sort lines by start date to help with optimal placement
    const sortedLines = [...lines].sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime()
    )

    const rows: TimelineLine[][] = []

    // Try to place each line in the first available row where it fits
    sortedLines.forEach((line) => {
      // Check each existing row to see if this line can fit
      let placed = false
      for (const row of rows) {
        // Check if line can fit in this row (no overlaps with any existing line)
        const canFit = row.every((existingLine) => {
          const buffer = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
          return !(
            line.startDate.getTime() - buffer <=
              existingLine.endDate.getTime() &&
            line.endDate.getTime() + buffer >= existingLine.startDate.getTime()
          )
        })

        if (canFit) {
          row.push(line)
          placed = true
          break
        }
      }

      // If we couldn't fit in any existing row, create a new one
      if (!placed) {
        rows.push([line])
      }
    })
    return rows
  }

  const rowAssignments = useMemo(() => {
    const rows = organizeIntoRows(timelineData.lines)
    const assignments: RowAssignment[] = []

    // Create assignments with row numbers based on the organized rows
    rows.forEach((row, rowIndex) => {
      row.forEach((line) => {
        assignments.push({ line, row: rowIndex })
      })
    })

    return assignments
  }, [timelineData])

  useEffect(() => {
    const updateWidth = () => {
      const container = document.getElementById('timeline-container')
      if (container) {
        setContainerWidth(container.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const dateToPosition = (date: Date): number => {
    const totalDays =
      (timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24)
    const daysSinceStart =
      (date.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24)

    // Adjust containerWidth to account for padding
    const usableWidth = containerWidth - 96 // 4rem (2rem on each side) in pixels
    return (daysSinceStart / totalDays) * usableWidth + 32 // Add left padding back
  }

  const formatDateRange = (start: Date, end: Date): string => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    // UTC: dates like '2024-01-01' parse as UTC midnight, which is still
    // the previous day in US time zones
    const startMonth = months[start.getUTCMonth()]
    const endMonth = months[end.getUTCMonth()]
    const startYear = start.getUTCFullYear()
    const endYear = end.getUTCFullYear()

    if (startYear === endYear) {
      return `${startMonth} - ${endMonth} ${startYear}`
    }
    return `${startMonth} ${startYear} - ${endMonth} ${endYear}`
  }

  const handleStopClick = (line: TimelineLine, stop: TimelineStop) => {
    setSelectedStop((prev) => (prev?.name === stop.name ? null : stop))
    setSelectedLine(line)
  }

  const handleLineClick = (line: TimelineLine) => {
    setSelectedLine((prev) => (prev?.name === line.name ? null : line))
    setSelectedStop(null)
  }

  const rowsToRender = useMemo(() => {
    const rows: {
      rowIndex: number
      lines: { line: TimelineLine; startX: number; endX: number }[]
    }[] = []

    rowAssignments.forEach(({ line, row }) => {
      const startX = dateToPosition(line.startDate)
      const endX = dateToPosition(line.endDate)

      if (!rows[row]) {
        rows[row] = { rowIndex: row, lines: [] }
      }
      rows[row].lines.push({ line, startX, endX })
    })

    return rows
  }, [rowAssignments, dateToPosition])

  return (
    <div className={styles.timelineContainer}>
      <div
        id="timeline-container"
        className={`${styles.timeline} ${
          selectedLine ? styles.hasSelectedLine : ''
        }`}
      >
        {/* Timeline legend */}
        {/* Year marks use the same scale as the lines; the legend already
            sits inside the 2rem (32px) padding that dateToPosition adds */}
        <div className={styles.legend}>
          {legendYears.map((year) => (
            <span
              key={year}
              className={styles.yearMark}
              style={{ left: dateToPosition(new Date(`${year}-01-01`)) - 32 }}
            >
              {year}
            </span>
          ))}
        </div>

        {/* Timeline base */}
        <div className={styles.timelineBase} />

        {/* Lines and stops */}
        {rowsToRender.map((row) => (
          <div
            key={row.rowIndex}
            className={styles.rowContainer}
            style={{
              top: row.rowIndex * 60 + 60, // Spacing between rows
            }}
          >
            {row.lines.map(({ line, startX, endX }) => {
              const isSelected = selectedLine?.name === line.name
              const lineWidth = endX - startX
              const extensionWidth = 54
              const adjustedStartX = isSelected
                ? startX - extensionWidth
                : startX
              const adjustedWidth = isSelected
                ? lineWidth + extensionWidth
                : lineWidth

              return (
                <div key={line.name} className={styles.lineContent}>
                  {/* Logo Circle - Updated positioning */}
                  {isSelected && (
                    <div
                      className={styles.logoCircle}
                      style={{
                        borderColor: line.color,
                        '--line-color': line.color,
                        left: startX - extensionWidth,
                      } as React.CSSProperties}
                    >
                      <Image
                        src={line.logoPath}
                        alt={`${line.name} logo`}
                        width={24}
                        height={24}
                      />
                    </div>
                  )}

                  {/* Line */}
                  <div
                    onClick={() => handleLineClick(line)}
                    className={`${styles.line} ${
                      isSelected ? styles.activeLine : ''
                    }`}
                    style={{
                      backgroundColor: line.color,
                      left: adjustedStartX,
                      width: adjustedWidth,
                    }}
                  />

                  {/* Stops */}
                  {line.stops.map((stop) => {
                    const stopX = dateToPosition(stop.date)
                    return (
                      <Fragment key={stop.name}>
                        <button
                          onClick={() => handleStopClick(line, stop)}
                          className={`${styles.stop} ${
                            selectedStop?.name === stop.name
                              ? styles.activeStop
                              : ''
                          }`}
                          style={{
                            left: stopX,
                            borderColor: line.color,
                          }}
                        />
                        <span
                          className={styles.stopLabel}
                          style={{
                            left: stopX,
                          }}
                        >
                          {stop.name}
                        </span>
                      </Fragment>
                    )
                  })}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {selectedLine && (
        <div className={styles.detailsPanel}>
          <div className={styles.mainInfo}>
            <div className={styles.detailsHeader}>
              <h3>{selectedLine.name}</h3>
              <span className={styles.date}>
                {formatDateRange(selectedLine.startDate, selectedLine.endDate)}
              </span>
            </div>
            <p className={styles.location}>{selectedLine.location}</p>
            <p>{selectedLine.description}</p>
          </div>

          <div
            className={styles.infoCard}
            style={
              { '--line-color': selectedLine.color } as React.CSSProperties
            }
          >
            {/* Card content 1 */}
          </div>

          <div
            className={styles.infoCard}
            style={
              { '--line-color': selectedLine.color } as React.CSSProperties
            }
          >
            {/* Card content 2 */}
          </div>

          <div
            className={styles.infoCard}
            style={
              { '--line-color': selectedLine.color } as React.CSSProperties
            }
          >
            {/* Card content 3 */}
          </div>
        </div>
      )}
    </div>
  )
}

export default Timeline
