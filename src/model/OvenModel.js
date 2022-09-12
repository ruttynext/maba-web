export default class OvenModel {

    constructor(oven) {
         this.CalibrationLocation = oven.oven;
         this.SerialNumOfCertificate = oven.SerialNumOfCertificate;
         this.Date = oven.Date;
         this.CalibratorName = oven.CalibratorName;
         this.CalibratorSignature = oven.CalibratorSignature;
         this.CustomerName = oven.CustomerName;
         this.CustomerAddress = oven.CustomerAddress;
         this.IdentificationCalibratedItem = oven.IdentificationCalibratedItem;
         this.Manufacturer = oven.Manufacturer;
         this.model = oven.model;
         this.SerialNo = oven.SerialNo;
         this.ContrllerManufacturer = oven.ContrllerManufacturer;      
         this.ContrllerModel = oven.ContrllerModel;
         this.ContrllerType = oven.ContrllerType;
         this.MeasurementRangeMin = oven.MeasurementRangeMin;
         this.MeasurementRangeMax = oven.MeasurementRangeMax;
         this.Resolution = oven.Resolution;
         this.AccuracyLevel = oven.AccuracyLevel;
         this.VisualAndFunctionalInspection = oven.VisualAndFunctionalInspection;
         this.CalibrationDate = oven.CalibrationDate;
         this.RecommendedNextCalibration = oven.RecommendedNextCalibration;
         this.EnvironmentalConditionsTemperature = oven.EnvironmentalConditionsTemperature;
         this.ProcedureNo = oven.ProcedureNo;
         this.CalibRefDocument = oven.CalibRefDocument;
         this.CalibrationProcessDescription = oven.CalibrationProcessDescription;
      }
     }