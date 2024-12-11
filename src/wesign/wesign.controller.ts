import { Controller, Post, Body, Param, Query, HttpException, HttpStatus, Res } from '@nestjs/common';
import { WesignService } from './wesign.service';
import { Response } from 'express';

@Controller('api/v1/wesign')
export class WesignController {
  constructor(private readonly wesignService: WesignService) {}

  @Post('upload')
  async uploadDocument(@Body('base64') base64: string, @Res() res: Response) {
    try {
        res.status(201).send(this.wesignService.uploadDocument(base64))
    } catch (error) {
        res.status(404).send(error)
    }

  }

  @Post('create-document')
  async createDocument(
    @Body() body: {
      uploadId: string;
      participants: any[];
      file: string;
      filename: string;
    },
    @Res() res: Response
  ) {
    try {
      const { uploadId, participants, file, filename } = body;
      res.status(201).send(await this.wesignService.createDocument(uploadId, participants, file, filename))  
    } catch (error) {
      res.status(404).send(error)
    }
  }

  @Post('document-info')
  async getDocumentInfo(@Body('documentId') documentId: string, @Res() res: Response) {
    try {
        res.status(201).send(await this.wesignService.getDocumentInfo(documentId))  
    } catch (error) {
        res.status(404).send(error)
    }
    
  }

  @Post('create-signature')
  async generateSignatureLink(
    @Body('documentId') documentId: string,
    @Body('email') email: string,
    @Res() res: Response
  ) {
    try {
        res.status(201).send(await this.wesignService.generateSignatureLink(documentId, email))  
    } catch (error) {
        res.status(404).send(error)
    }
  }

  @Post(':documentId/notify-signer')
  async notifySigner(
    @Param('documentId') documentId: string,
    @Query('flowActionId') flowActionId: string,
    @Res() res: Response
  ) {
    try {
        res.status(201).send(await this.wesignService.notifySigner(documentId, flowActionId))  
    } catch (error) {
        res.status(404).send(error)
    }
  }

  @Post(':documentId/cancel')
  async cancelDocument(@Param('documentId') documentId: string, @Res() res: Response) {
    try {
        res.status(201).send(await this.wesignService.cancelDocument(documentId))  
    } catch (error) {
        res.status(404).send(error)
    }
  }

  @Post(':documentId/download-signatures')
  async downloadSignatures(
    @Param('documentId') documentId: string,
    @Query('type') type: string,
    @Res() res: Response
  ) {
    try {
        res.status(201).send(await this.wesignService.downloadSignatures(documentId, type))  
    } catch (error) {
        res.status(404).send(error)
    }
  }
}