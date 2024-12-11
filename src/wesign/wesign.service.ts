import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WesignService {
  private readonly api_base_url: URL;
  //private readonly baseUrl: string;
  private readonly accessToken: string;
  private readonly secretToken: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    const baseUrl = this.configService.get<string>('WESIGN_API_URL');
    this.accessToken = this.configService.get<string>('WESIGN_API_ACCESS_TOKEN');
    this.secretToken = this.configService.get<string>('WESIGN_API_SECRET_TOKEN');
    this.apiKey = this.configService.get<string>('WESIGN_API_KEY');
    this.api_base_url = new URL(baseUrl);
  }

  private getHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'X-Secret-Token': this.secretToken,
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
    };
  }

  private buildUrl(endpoint: string): string {
    return `${this.api_base_url.origin}${endpoint}`;
  }
  
  async uploadDocument(base64: string): Promise<any> {
    const url = this.buildUrl('/api/uploads/bytes');
    const payload = { bytes: base64 };
  
    
    if (!base64) {
      throw {
        status: false,
        message: 'Invalid Base64 string: Ensure the file is a valid PDF.'
      }
    }
  
    try {
      const { data } = await axios.post(url, payload, this.getHeaders());
      console.log('Upload Successful:', data);
      return data;
    } catch (error) {
        throw {
            data: error,
            status: false,
            message: 'Upload Failed'
          }
    }
  }

  async createDocument(uploadId: string, participants: any[], filename: string, file: string): Promise<AxiosResponse<any>> {
    const url = this.buildUrl('/api/documents');
    const payload = {
      files: [
        {
          displayName: filename,
          id: uploadId,
          name: file,
          contentType: 'application/pdf',
        },
      ],
      flowActions: participants,
    };
    console.log(payload);
    
    try {
      const {data} = await axios.post(url, payload, this.getHeaders());
      return data
    } catch (error) {
        throw {
            data: error,
            status: false,
            message: 'Create Document Failed'
          }
    }
  }

 
  async getDocumentInfo(documentId: string): Promise<AxiosResponse<any>> {
    const url = this.buildUrl(`/api/documents/${documentId}`);
    try {
      const response = await axios.get(url, this.getHeaders());
      return response.data
    } catch (error) {
        throw {
            data: error,
            status: false,
            message: 'Get Document Info Failed'
          }
    }
  }

  async generateSignatureLink(documentId: string, email: string): Promise<AxiosResponse<any>> {
    const url = this.buildUrl(`/api/documents/${documentId}/action-url`);
    console.log(documentId);
    console.log(url);
    
    const payload = { emailAddress: email };
    console.log(payload);
    
    try {
      const response= await axios.post(url, payload, this.getHeaders());
      console.log(response);
      
      return response.data
    } catch (error) {
        throw {
            data: error,
            status: false,
            message: 'Generate Signature Link Failed'
          }
    }
  }

  async notifySigner(documentId: string, flowActionId: string): Promise<AxiosResponse<any>> {
    const url = this.buildUrl('/api/notifications/flow-action-reminder');
    const data = { documentId, flowActionId };

    try {
      return await axios.post(url, data, this.getHeaders());
    } catch (error) {
        throw {
            data: error,
            status: false,
            message: 'Notification Failed'
          }
    }
  }

  async cancelDocument(documentId: string): Promise<AxiosResponse<any>> {
    const url = this.buildUrl(`/api/documents/${documentId}/cancellation`);

    try {
      return await axios.post(url, {}, this.getHeaders());
    } catch (error) {
        throw {
            data: error,
            status: false,
            message: 'Cancel Document Failed'
          }
    }
  }

  async downloadSignatures(documentId: string, type: string): Promise<AxiosResponse<any>> {
    const url = this.buildUrl(`/api/documents/${documentId}/content-b64?type=${type}`);

    try {
      return await axios.get(url, this.getHeaders());
    } catch (error) {
        throw {
            data: error,
            status: false,
            message: 'Download Signatures Failed'
          }
     
    }
  }
}
