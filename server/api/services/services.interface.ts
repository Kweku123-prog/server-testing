export interface ISendSMS {
  recipientPhoneNumber: string;
  message: string;
}

export interface IDistanceAndDuration {
  distanceText: string;
  durationText: string;
  distanceValue: number;
  durationValue: number;
}

export interface ICoordinates {
  lat: number;
  lng: number;
}