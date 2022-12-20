import { configureStore } from "@reduxjs/toolkit";
import channelsSlice from "./channel-slice";
import reportsSlice from "./reports-slice";


const store = configureStore({
    reducer: { channelData: channelsSlice.reducer, reportsData: reportsSlice.reducer },
});
export default store;
