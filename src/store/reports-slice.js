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
                        color: item.color,
                        channels :[]});                        
        },
        
        removeReports(state, action) {
       
            const formName = action.payload.formName;
           
            state.reportsDataList =  state.reportsDataList.filter((item) => item.formName !== formName);                      
        },

        addChannelsToReport(state, action) {

            const detailsItem = action.payload.details;
            const channelsArray = action.payload.channelsArray;
  
            var channels = state.reportsDataList.find((reportItem) => reportItem.id === detailsItem.reportId).channels;
         
            channelsArray.map(channelItem => {
                channels.push({hydraId: detailsItem.hydraNumber, name: channelItem.id, serialNumber: channels.length + 1});
            });
                     
        }, 

        setChannelSerialNumber(state, action) {
 console.log("setChannelSerialNumber");

            const detailsItem = action.payload.detailItem;
             console.log(detailsItem);
           // console.log(detailsItem);
           // var channels = state.reportsDataList.find((reportItem) => reportItem.id === detailsItem.reportId).channels;
            
            // channels.map(item => {
            //     if (item.serialNumber === detailsItem.serialNumber) {
            //         return {...item, serialNumber: detailsItem.newSerialNumber};
            //     }
            //     if (item.serialNumber === detailsItem.newSerialNumber) {
            //         return {...item, serialNumber: detailsItem.serialNumber};
            //     }
            // });

            const channels = state.reportsDataList.find((reportItem) =>  reportItem.id === detailsItem.reportId).channels;

            
           // console.log("existingItem");
           // console.log(channels);
            if (channels) 
            {
                const itemSelected = channels.find((item) =>  item.serialNumber === detailsItem.serialNumber);
                
                const ItemReplace = channels.find((item) =>  item.serialNumber === detailsItem.newSerialNumber);
                itemSelected.serialNumber = detailsItem.newSerialNumber;
                ItemReplace.serialNumber = detailsItem.serialNumber;
               // channels[0].serialNumber = 6;
                //  channels.map(item => (item.serialNumber === detailsItem.serialNumber ?
                //  {
                //    ...item, 
                //   'serialNumber' : 6,     
                //  } : item))
            }
           // console.log(channels);

            // channels.map(item => (item.serialNumber === detailsItem.serialNumber ?
            //     {
            //       ...item, 
            //      'serialNumber' : 6,     
            //     } : item))
        },
    },
});

export const reportsActions = reportsSlice.actions;
export default reportsSlice;
