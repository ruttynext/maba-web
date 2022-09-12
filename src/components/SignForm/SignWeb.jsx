import { Dialog } from '@progress/kendo-react-dialogs';
import './signature.css';
import React, { useState, useEffect, useRef } from 'react';
import * as SigWebTablet from './SigWebTablet.js';
import { Button } from "@progress/kendo-react-buttons";

function SignWeb({ signData, parentCallback, closeSignWeb }) {
    const canvasRef = useRef(null);   
    const signDataInitial = "data:image/png;base64," + signData;

     useEffect(() => {
    
         //Clear image
         const ctx = canvasRef.current.getContext("2d");
         ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

         //Load initial image
         getImageFromString(signDataInitial);
     }, []);

    /////////////////////////////////////////////////////////////////////////////////
    {/* 
        Handles the beforeunload window event.
        Use the useEffect() hook and addEventListener() to handle the 'beforeunload' (when the user is about to close the window).
        Use removeEventListener() to perform cleanup after the component is unmounted.
    */}

     const handleUnload = (e) => {
         e.preventDefault();
         closingSigWeb();
     }

     useEffect(() => {
         window.addEventListener("beforeunload", handleUnload);
         return () => window.removeEventListener("beforeunload", handleUnload);
     }, [handleUnload]);

    /////////////////////////////////////////////////////////////////////////////////





    ///////////////////////////////////////////////////////////////////////////
    let tmr;

    function getImageFromString(SigString) {

        let img = new Image();
        img.src = SigString;
        img.onload = function () {

            const ctx = canvasRef.current.getContext("2d");

            //  Center image
            var wrh = img.width / img.height;
            var newWidth = ctx.canvas.width;
            var newHeight = newWidth / wrh;
            if (newHeight > ctx.canvas.height) {
                newHeight = ctx.canvas.height;
                newWidth = newHeight * wrh;
            }
            var xOffset = newWidth < ctx.canvas.width ? ((ctx.canvas.width - newWidth) / 2) : 0;
            var yOffset = newHeight < ctx.canvas.height ? ((ctx.canvas.height - newHeight) / 2) : 0;
            ///////

            ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);
            img = null;

        }

    }


    function closingSigWeb() {
        SigWebTablet.ClearTablet();
        SigWebTablet.SetTabletState(0, tmr);
    }

    function onSign() {

        const ctx = canvasRef.current.getContext("2d");
        SigWebTablet.SetDisplayXSize(500);
        SigWebTablet.SetDisplayYSize(100);
        SigWebTablet.SetTabletState(0, tmr);
        SigWebTablet.SetJustifyMode(0);
        SigWebTablet.ClearTablet();
        if (tmr == null) {
            tmr = SigWebTablet.SetTabletState(1, ctx, 50);
        }
        else {
            SigWebTablet.SetTabletState(0, tmr);
            tmr = null;
            tmr = SigWebTablet.SetTabletState(1, ctx, 50);
        }
    }

    function onClear() {
        //SigWebTablet.ClearTablet();
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        SigImageCallback("");

        onSign();
    }

    function onDone() {
        //if (SigWebTablet.NumberOfTabletPoints() == 0) {
        const ctx = canvasRef.current.getContext("2d");
        if (isCanvasBlank(ctx.canvas)) {
            alert("Please sign before continuing");
        }
        else {
            SigWebTablet.SetTabletState(0, tmr);

            //RETURN BMP BYTE ARRAY CONVERTED TO BASE64 STRING
            SigWebTablet.SetImageXSize(500);
            SigWebTablet.SetImageYSize(100);
            SigWebTablet.SetImagePenWidth(5);
            SigWebTablet.GetSigImageB64(SigImageCallback);

        }
        closeSignWeb();
    }

    ///////////////////////////////////////////////////////////////////////////


    function isCanvasBlank(canvas) {

        const blank = document.createElement('canvas');

        blank.width = canvas.width;
        blank.height = canvas.height;

        return canvas.toDataURL() === blank.toDataURL();

    //    return !canvas.current.getContext('2d')
    //        .getImageData(0, 0, canvas.width, canvas.height).data
    //        .some(channel => channel !== 0);
    }

    function SigImageCallback(str) {
        parentCallback(str);
    }

    return (
        <div>
            <Dialog title={'טופס חתימה'} onClose={closeSignWeb}>
                <div id="signature-pad" className="m-signature-pad">
                    <div className="m-signature-pad--header">
                        <span >חתום כאן</span>
                    </div>
                    <div className="m-signature-pad--body" onClick={onSign}>
                        <canvas ref={canvasRef} id="cnv" name="cnv" height="80"></canvas>
                    </div>

                    <div className="m-signature-pad--footer">
                        {/*
                            <canvas name="SigImg" id="SigImg" width="500" height="100"></canvas>
                            <input type="hidden" name="bioSigData" />
                            <input type="hidden" name="sigImgData" />  
                        */}
                        <Button onClick={onSign} >התחל</Button>&nbsp;&nbsp;&nbsp;
                        <Button onClick={onClear}>נקה</Button>&nbsp;&nbsp;&nbsp;
                        <Button onClick={onDone} themeColor={"primary"}>חתום</Button>
                    </div>

                </div>
            </Dialog>
        </div>
    );
}

export default SignWeb;