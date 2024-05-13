import axios from "axios";
import { ICoordinates, IDistanceAndDuration } from "./services.interface";
import { GOOGLE_API_KEY } from "../config";
import { HandleException } from "../utils";
import { STATUS_CODES } from "../constants";

class GoogleMapService {
  private apiKey: string;
  constructor() {
    this.apiKey = `${GOOGLE_API_KEY}`;
  }

  public async getDistanceAndDuration(
    origin: ICoordinates,
    destination: ICoordinates,
    mode: string = "riding"
  ): Promise<IDistanceAndDuration> {
    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=
        ${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}
        &mode=${mode}&key=${this.apiKey}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.data.status === "OK") {
        const distanceText = response.data.rows[0].elements[0].distance.text;
        const durationText = response.data.rows[0].elements[0].duration.text;

        const distanceValue = response.data.rows[0].elements[0].distance.value;
        const durationValue = response.data.rows[0].elements[0].duration.value;

        return {
          distanceText,
          durationText,
          distanceValue,
          durationValue,
        };
      } else {
        throw new HandleException(STATUS_CODES.BAD_REQUEST, `Google Maps API Error: ${response.data.status}`);
      }
    } catch (error: any) {
        throw new HandleException(error.status, error.message);
    }
  }
}

export const googleMapService = new GoogleMapService();
