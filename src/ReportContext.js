import React, { createContext } from 'react'

const ReportContext = createContext({})

export const ReportProvider = ReportContext.Provider
export const ReportConsumer = ReportContext.Consumer
export default ReportContext