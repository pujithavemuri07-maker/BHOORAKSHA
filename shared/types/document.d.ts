export type DocumentType =
  | 'sale_deed'
  | 'patta'
  | 'encumbrance_certificate'
  | 'aadhaar'
  | 'pan'
  | 'tax_receipt'
  | 'boundary_map';

export type QualityStatus = 'PASSED' | 'FAILED' | 'WARNING' | 'PENDING';

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  documentType: DocumentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
  extractedText?: string;
  confidenceScore: number;
  qualityStatus: QualityStatus;
  entities?: {
    ownerNames?: string[];
    surveyNumber?: string;
    extent?: string;
    boundaries?: {
      north?: string;
      south?: string;
      east?: string;
      west?: string;
    };
    deedDate?: string;
    registrationNumber?: string;
  };
  createdAt: string;
}
