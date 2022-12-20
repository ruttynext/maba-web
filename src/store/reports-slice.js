import { createSlice } from "@reduxjs/toolkit";

const reportsSlice = createSlice({

    name: "reportsData",
    initialState: { reportsDataList: [
                                    //  { 
                                    //   id: 0,
                                    //   formName: 'דוח 1',
                                    //   color: "18a39c"
                                    //   }
                                    ]},

    reducers: {
        addNewReport(state, action) {
       
            const item = action.payload.item;
           
            state.reportsDataList.push({
                        id: item.id,
                        formName: item.formName,
                        color: item.color});                        
        },
        removeReports(state, action) {
       
            const formName = action.payload.formName;
           
            state.reportsDataList =  state.reportsDataList.filter((item) => item.formName !== formName);                      
        },
    },
});

export const reportsActions = reportsSlice.actions;
export default reportsSlice;
