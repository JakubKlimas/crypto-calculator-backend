import { Service } from 'typedi';
import axios from 'axios';

import { GetFearAndGreed } from '@/interfaces/alternative-api.interface';

@Service()
export class AlternativeApiService {
  public async getFearAndGreed(): Promise<GetFearAndGreed> {
    try {
      const response = await axios.get('https://api.alternative.me/fng');

      return ({
        value: parseInt(response.data.data[0].value, 10),
        classification: response.data.data[0].value_classification,
      });
    } catch (error) {
      console.error('Error fetching fear and greed data:', error.message);
      throw error;
    }
  }
}
;