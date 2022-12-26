import { createSlice } from "@reduxjs/toolkit";

const channelsSlice = createSlice({
    name: "channelData",
    initialState: { channelsData: [
                                    {
                                        id: 0,
                                        hydraNumber: "21-424",
                                        channelsAmount: 60,
                                        channels: []
                                    },
                                    {
                                        id: 1,
                                        selected: false,
                                        hydraNumber: "21-473",
                                        channelsAmount: 40,
                                        channels: []
                                    }
                                   ] 
                  },
    reducers: {

        setChanneldata(state, action) {
       
            const detailsChannel = action.payload.detailsChannel;
            const channelsArray = action.payload.channelsArray;
            var channels = state.channelsData.find((hydraItem) => hydraItem.hydraNumber === detailsChannel.hydraNumber).channels;
            channelsArray.map(channelItem => {

                const existingItem = channels.find((channel) => channel.name === channelItem.id);

                if (existingItem) {
                  
                    existingItem.sensorValue = detailsChannel.sensorValue;
                    existingItem.measurementType = detailsChannel.measurementType;
                    existingItem.unitsNumber =  detailsChannel.unitsNumber;
                    existingItem.lowerLimit =  detailsChannel.lowerLimit;
                    existingItem.UpperLimit =  detailsChannel.UpperLimit;
                   
                } 
                else
                {
                    channels.push({
                                name: channelItem.id,
                                sensorValue: detailsChannel.sensorValue, 
                                measurementType: detailsChannel.measurementType,
                                unitsNumber: detailsChannel.unitsNumber,
                                lowerLimit: detailsChannel.lowerLimit,
                                UpperLimit: detailsChannel.UpperLimit});         
                }
            })
 
        },
        
        // removeChannel(state, action) {
            
        //     const channel = action.payload.channel;
        //     const channelsItems = state.channelsData.find((hydraItem) => hydraItem.hydraNumber === channel.hydraNumber);

        //     channelsItems.channels = channelsItems.channels.filter((channelItem) => channelItem.name !== channel.id);
        // },

        // setChannelToReport(state, action) {
            
        //     const item = action.payload.item;
           
        //     const existingItem = (state.channelsData.find(
        //             (hydraItem) => hydraItem.hydraNumber === item.hydraNumber)).channels.find((channel) => channel.name === item.id);

        //     if(existingItem) {
                
        //         existingItem.reports.push(item.report)
        //     }
        // },

        expandedHydra(state, action) {
         
            const detailsHydra = action.payload.detailsHydra;
          
            const existingItem = state.channelsData.find((hydraItem) => hydraItem.hydraNumber === detailsHydra.hydraNumber)
            if (existingItem) 
            {
               existingItem.expanded = detailsHydra.expanded;
            }
        },

        selectedHydra(state, action) {
         
            const detailsHydra = action.payload.detailsHydra;
           
            state.channelsData.map(item => (
               
                {...item, 'selected' : item.hydraNumber === detailsHydra.hydraNumber ? true : false, 
                          
                } ));
                               
        },

        // changeChannelOrder(state, action) {
            
        //     var detailItem = action.payload.detailItem;
        //     var channels = state.channelsData.find((hydraItem) => hydraItem.hydraNumber === detailItem.hydraNumber).channels;
        //     const existingItem = state.channelsData.find(
        //         (hydraItem) => hydraItem.hydraNumber === detailItem.hydraNumber)
        //     if (existingItem) 
        //     {
        //     existingItem.expanded = detailsHydra.expanded;
        //     }

        // },
    },
});

export const channelsActions = channelsSlice.actions;
export default channelsSlice;
