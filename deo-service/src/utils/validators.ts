import { z } from 'zod';

export const manualEntrySchema = z.object({
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  taluk: z.string().min(1, 'Taluk/Mandal is required'),
  village: z.string().min(1, 'Village is required'),
  surveyNumber: z.string().min(1, 'Survey Number is required'),
  ulpin: z.string().optional(),
  ownerName: z.string().min(1, 'Owner Name is required'),
  fatherName: z.string().optional(),
  share: z.string().optional(),
  previousOwner: z.string().optional(),
  area: z.number({ invalid_type_error: 'Area must be a number' }).min(0.01, 'Area must be greater than 0'),
  areaUnit: z.string().min(1, 'Area Unit is required'),
  landType: z.string().min(1, 'Land Type is required'),
  currentUsage: z.string().optional(),
  boundaryNorth: z.string().optional(),
  boundarySouth: z.string().optional(),
  boundaryEast: z.string().optional(),
  boundaryWest: z.string().optional(),
  documentType: z.string().min(1, 'Document Type is required'),
  documentNumber: z.string().min(1, 'Document Number is required'),
  registrationNumber: z.string().optional(),
  registrationDate: z.string().optional(),
  issuingAuthority: z.string().optional(),
  mutationNumber: z.string().optional(),
});

export type ManualEntryFormData = z.infer<typeof manualEntrySchema>;
