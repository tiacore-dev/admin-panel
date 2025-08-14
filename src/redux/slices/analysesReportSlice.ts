// redux/slices/analysesReportSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AnalysisReportsState {
  companyId: string;
  dateRange: [string, string];
}

const initialState: AnalysisReportsState = {
  companyId: "",
  dateRange: ["", ""],
};

export const analysesReportSlice = createSlice({
  name: "analysisReports",
  initialState,
  reducers: {
    setAnalysisReports: (
      state,
      action: PayloadAction<{
        companyId: string;
        dateRange: [string, string];
      }>
    ) => {
      state.companyId = action.payload.companyId;
      state.dateRange = action.payload.dateRange;
    },
    resetAnalysisReports: (state) => {
      state.companyId = initialState.companyId;
      state.dateRange = initialState.dateRange;
    },
  },
});

export const { setAnalysisReports, resetAnalysisReports } =
  analysesReportSlice.actions;

// Селекторы
export const selectCompanyId = (state: {
  analysisReports: AnalysisReportsState;
}) => state.analysisReports.companyId;
export const selectDateRange = (state: {
  analysisReports: AnalysisReportsState;
}) => state.analysisReports.dateRange;

export default analysesReportSlice.reducer;
