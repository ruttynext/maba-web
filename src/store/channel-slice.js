import { createSlice } from "@reduxjs/toolkit";

const channelsSlice = createSlice({
    name: "channelData",
    initialState: { channelsData: [
                                    {
                                        id: 0,
                                        hydraNumber: "21-424",
                                        channels: []
                                    },
                                    {
                                        id: 1,
                                        selected: false,
                                        hydraNumber: "21-473",
                                        channels: []
                                    }
                                   ] 
                  },
    reducers: {

        setChanneldata(state, action) {
       
            const detailsChannel = action.payload.detailsChannel;
            const channelsArray = action.payload.channelsArray;
            console.log("setChanneldata");
            channelsArray.map(channelItem => {

                const existingItem = state.channelsData.find(
                                     (hydraItem) => hydraItem.hydraNumber === detailsChannel.hydraNumber)
                                     .channels.find((channel) => channel.name === channelItem.id);
                if (existingItem) {
                  
                    existingItem.sensorValue = detailsChannel.sensorValue;
                    existingItem.measurementType = detailsChannel.measurementType;
                    existingItem.unitsNumber =  detailsChannel.unitsNumber;
                    existingItem.lowerLimit =  detailsChannel.lowerLimit;
                    existingItem.UpperLimit =  detailsChannel.UpperLimit;
                   
                } 
                else
                {
                    state.channelsData.find((hydraItem) => hydraItem.hydraNumber === detailsChannel.hydraNumber)
                     .channels.push({
                        hydraNumber: "Ff",
                                name: channelItem.id,
                                sensorValue: detailsChannel.sensorValue, 
                                measurementType: detailsChannel.measurementType,
                                unitsNumber: detailsChannel.unitsNumber,
                                lowerLimit: detailsChannel.lowerLimit,
                                UpperLimit: detailsChannel.UpperLimit,
                                reports: []});         
                }
            })
 
        },
        
        removeChannel(state, action) {
            
            const channel = action.payload.channel;
            const channelsItems = state.channelsData.find((hydraItem) => hydraItem.hydraNumber === channel.hydraNumber);

            channelsItems.channels = channelsItems.channels.filter((channelItem) => channelItem.name !== channel.id);
        },

        setChannelToReport(state, action) {
            
            const item = action.payload.item;
           
            const existingItem = (state.channelsData.find(
                    (hydraItem) => hydraItem.hydraNumber === item.hydraNumber)).channels.find((channel) => channel.name === item.id);

            if(existingItem) {
                console.log("existingItem");
                existingItem.reports.push(item.report)
            }
        },

        expandedHydra(state, action) {
         
            const detailsHydra = action.payload.detailsHydra;
            console.log(detailsHydra);
            const existingItem = state.channelsData.find(
                                 (hydraItem) => hydraItem.hydraNumber === detailsHydra.hydraNumber)
            if (existingItem) 
            {
               existingItem.expanded = detailsHydra.expanded;
            }
        },

        selectedHydra(state, action) {
           console.log("selectedHydra");
            const detailsHydra = action.payload.detailsHydra;
            console.log(detailsHydra.hydraNumber);
            state.channelsData.map(item => (
               
                {...item, 'selected' : item.hydraNumber === detailsHydra.hydraNumber ? true : false, 
                          
                } ));
                console.log(state.channelsData);                
        },
        reorderedData(state, action) {
            
            state.channelsData = action.payload.reorderedData;

        },
    },
});

export const channelsActions = channelsSlice.actions;
export default channelsSlice;
