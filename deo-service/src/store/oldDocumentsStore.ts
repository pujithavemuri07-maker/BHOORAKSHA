import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OldDocumentPage {
  pageNumber: number;
  imageUrl: string;
  detectedScript: string;
  htrConfidence: number;
}

export interface OldDocumentExtractedField {
  key: string;
  label: string;
  value: string;
  confidence: number;
  needsReview: boolean;
  script?: string;
}

export interface OldDocumentIssue {
  id: string;
  type: 'ownership_mismatch' | 'survey_number_change' | 'area_variation' | 'date_anomaly';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  oldValue: string;
  modernValue: string;
  description: string;
  recommendation: string;
  resolved?: boolean;
}

export interface OldDocumentItem {
  id: string;
  documentType: string;
  state: string;
  district: string;
  taluk: string;
  village: string;
  yearFrom: number;
  yearTo: number;
  totalPages: number;
  status: 'UPLOADED' | 'PROCESSING' | 'AWAITING_VERIFICATION' | 'VERIFIED' | 'ROUTED' | 'COMPLETED';
  overallConfidence: number;
  riskScore: number;
  riskCategory: 'HIGH' | 'MEDIUM' | 'LOW';
  linkedUlpin?: string;
  notifiedOwner: boolean;
  notifiedOwnerAt?: string;
  routedTo?: 'verifier' | 'legal' | 'gis' | 'revenue' | null;
  routedAt?: string;
  createdAt: string;
  pages: OldDocumentPage[];
  extractedFields: Record<string, string>;
  fieldConfidences: Record<string, number>;
  issues: OldDocumentIssue[];
  deoNotes?: string;
}

interface OldDocumentsState {
  documents: OldDocumentItem[];
  searchQuery: string;
  selectedFilter: string;
  stats: {
    pendingScans: number;
    processing: number;
    awaitingVerification: number;
    digitizedToday: number;
  };

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedFilter: (filter: string) => void;
  addDocument: (doc: Partial<OldDocumentItem>) => string;
  updateField: (id: string, fieldKey: string, newValue: string) => void;
  verifyDocument: (id: string, notes?: string) => void;
  notifyOwner: (id: string, channels: string[]) => void;
  routeToOfficer: (id: string, officerRole: 'verifier' | 'legal' | 'gis' | 'revenue', notes?: string) => void;
  linkUlpin: (id: string, ulpin: string) => void;
  getDocument: (id: string) => OldDocumentItem | undefined;
}

const INITIAL_DOCUMENTS: OldDocumentItem[] = [
  {
    id: 'OLD-000123',
    documentType: 'Register',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    taluk: 'Bengaluru North',
    village: 'Yelahanka',
    yearFrom: 1970,
    yearTo: 1975,
    totalPages: 4,
    status: 'COMPLETED',
    overallConfidence: 72,
    riskScore: 68,
    riskCategory: 'MEDIUM',
    linkedUlpin: 'KA-1234-5678-9012',
    notifiedOwner: true,
    notifiedOwnerAt: '2026-09-20T11:45:00Z',
    routedTo: 'verifier',
    routedAt: '2026-09-20T12:00:00Z',
    createdAt: '2026-09-20T10:15:00Z',
    pages: [
      {
        pageNumber: 1,
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80',
        detectedScript: 'Kannada (Old Halegannada Cursive)',
        htrConfidence: 72,
      },
    ],
    extractedFields: {
      surveyNumber: '123/456',
      ownerName: 'Shankar (S/o Ramu)',
      extentArea: '2.50 Acres',
      registrationDate: '1975-01-15',
      village: 'Yelahanka',
      landType: 'Dry Agricultural (Khushki)',
    },
    fieldConfidences: {
      surveyNumber: 88,
      ownerName: 72,
      extentArea: 94,
      registrationDate: 85,
      village: 96,
      landType: 91,
    },
    issues: [
      {
        id: 'ISSUE-01',
        type: 'ownership_mismatch',
        severity: 'HIGH',
        oldValue: 'Shankar (S/o Ramu)',
        modernValue: 'Suresh Reddy',
        description: 'Old record shows "Shankar (S/o Ramu)", whereas modern ULPIN record shows "Suresh Reddy". Indicates possible unregistered historical transfer between 1975-1990.',
        recommendation: 'Notify current owner + request clarification',
        resolved: false,
      },
      {
        id: 'ISSUE-02',
        type: 'survey_number_change',
        severity: 'MEDIUM',
        oldValue: 'Sy. No. 123/2',
        modernValue: '123/456',
        description: 'Old survey notation "Sy. No. 123/2" transformed to "123/456" during 1982 village re-survey.',
        recommendation: 'Link with archival note, verify with GIS boundary mapping.',
        resolved: false,
      },
      {
        id: 'ISSUE-03',
        type: 'area_variation',
        severity: 'LOW',
        oldValue: '2.50 acres',
        modernValue: '2.48 acres',
        description: 'Area variation of 0.8% is within normal statutory survey tolerances.',
        recommendation: 'No action required. Eligible for automated mutation validation.',
        resolved: true,
      },
    ],
    deoNotes: 'Archival register inspected from Taluk Record Room 3. Ink faded on owner name, confirmed with patwari.',
  },
  {
    id: 'OLD-000122',
    documentType: 'Old Sale Deed',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    taluk: 'Bengaluru South',
    village: 'Begur',
    yearFrom: 1968,
    yearTo: 1968,
    totalPages: 3,
    status: 'PROCESSING',
    overallConfidence: 65,
    riskScore: 45,
    riskCategory: 'MEDIUM',
    linkedUlpin: 'KA-5566-7788-9900',
    notifiedOwner: false,
    routedTo: null,
    createdAt: '2026-09-21T06:30:00Z',
    pages: [
      {
        pageNumber: 1,
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
        detectedScript: 'Devanagari / Modi',
        htrConfidence: 65,
      },
    ],
    extractedFields: {
      surveyNumber: '42/A',
      ownerName: 'N. Sitaram Rao',
      extentArea: '1.25 Acres',
      registrationDate: '1968-11-04',
      village: 'Begur',
      landType: 'Wet Land (Tari)',
    },
    fieldConfidences: {
      surveyNumber: 74,
      ownerName: 65,
      extentArea: 89,
      registrationDate: 78,
      village: 92,
      landType: 86,
    },
    issues: [
      {
        id: 'ISSUE-04',
        type: 'survey_number_change',
        severity: 'MEDIUM',
        oldValue: 'Sy. 42',
        modernValue: 'Sy. 42/A',
        description: 'Historical sub-division bifurcation pending verification.',
        recommendation: 'Verify with GIS spatial layer.',
        resolved: false,
      },
    ],
  },
  {
    id: 'OLD-000121',
    documentType: 'Pattadar Book',
    state: 'Karnataka',
    district: 'Mysuru',
    taluk: 'Mysuru South',
    village: 'Chamundi Foothills',
    yearFrom: 1980,
    yearTo: 1985,
    totalPages: 6,
    status: 'AWAITING_VERIFICATION',
    overallConfidence: 88,
    riskScore: 25,
    riskCategory: 'LOW',
    linkedUlpin: 'KA-9988-7766-5544',
    notifiedOwner: false,
    routedTo: null,
    createdAt: '2026-09-21T07:10:00Z',
    pages: [
      {
        pageNumber: 1,
        imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80',
        detectedScript: 'Kannada Modern Hand',
        htrConfidence: 88,
      },
    ],
    extractedFields: {
      surveyNumber: '88/3',
      ownerName: 'Basavaraju M.',
      extentArea: '3.10 Acres',
      registrationDate: '1982-03-21',
      village: 'Chamundi Foothills',
      landType: 'Garden / Bagayat',
    },
    fieldConfidences: {
      surveyNumber: 94,
      ownerName: 88,
      extentArea: 95,
      registrationDate: 90,
      village: 98,
      landType: 92,
    },
    issues: [],
  },
];

export const useOldDocumentsStore = create<OldDocumentsState>()(
  persist(
    (set, get) => ({
      documents: INITIAL_DOCUMENTS,
      searchQuery: '',
      selectedFilter: 'all',
      stats: {
        pendingScans: 5,
        processing: 3,
        awaitingVerification: 12,
        digitizedToday: 8,
      },

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedFilter: (selectedFilter) => set({ selectedFilter }),

      addDocument: (docData) => {
        const newId = `OLD-000${124 + get().documents.length}`;
        const newDoc: OldDocumentItem = {
          id: newId,
          documentType: docData.documentType || 'Register',
          state: docData.state || 'Karnataka',
          district: docData.district || 'Bengaluru Urban',
          taluk: docData.taluk || 'Bengaluru North',
          village: docData.village || 'Yelahanka',
          yearFrom: docData.yearFrom || 1970,
          yearTo: docData.yearTo || 1975,
          totalPages: docData.totalPages || 3,
          status: 'PROCESSING',
          overallConfidence: 74,
          riskScore: 58,
          riskCategory: 'MEDIUM',
          linkedUlpin: docData.linkedUlpin,
          notifiedOwner: false,
          routedTo: null,
          createdAt: new Date().toISOString(),
          pages: [
            {
              pageNumber: 1,
              imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80',
              detectedScript: 'Devanagari / Kannada',
              htrConfidence: 74,
            },
          ],
          extractedFields: {
            surveyNumber: '123/456',
            ownerName: 'R. Kumar Patel',
            extentArea: '2.50 Acres',
            registrationDate: `${docData.yearFrom || 1970}-04-12`,
            village: docData.village || 'Yelahanka',
            landType: 'Agricultural Land',
          },
          fieldConfidences: {
            surveyNumber: 85,
            ownerName: 70,
            extentArea: 92,
            registrationDate: 84,
            village: 95,
            landType: 88,
          },
          issues: [
            {
              id: `ISSUE-${Date.now()}`,
              type: 'ownership_mismatch',
              severity: 'HIGH',
              oldValue: 'R. Kumar Patel',
              modernValue: 'Suresh Reddy',
              description: 'Historical owner name does not match current registered title holder.',
              recommendation: 'Notify current owner + request clarification',
              resolved: false,
            },
          ],
        };

        set((state) => ({
          documents: [newDoc, ...state.documents],
          stats: {
            ...state.stats,
            processing: state.stats.processing + 1,
          },
        }));

        return newId;
      },

      updateField: (id, fieldKey, newValue) => {
        set((state) => ({
          documents: state.documents.map((doc) => {
            if (doc.id !== id) return doc;
            return {
              ...doc,
              extractedFields: {
                ...doc.extractedFields,
                [fieldKey]: newValue,
              },
              fieldConfidences: {
                ...doc.fieldConfidences,
                [fieldKey]: 100, // manual DEO edit yields 100% confidence
              },
            };
          }),
        }));
      },

      verifyDocument: (id, notes) => {
        set((state) => ({
          documents: state.documents.map((doc) => {
            if (doc.id !== id) return doc;
            return {
              ...doc,
              status: 'VERIFIED',
              deoNotes: notes || doc.deoNotes,
            };
          }),
          stats: {
            ...state.stats,
            digitizedToday: state.stats.digitizedToday + 1,
            awaitingVerification: Math.max(0, state.stats.awaitingVerification - 1),
          },
        }));
      },

      notifyOwner: (id, channels) => {
        set((state) => ({
          documents: state.documents.map((doc) => {
            if (doc.id !== id) return doc;
            return {
              ...doc,
              notifiedOwner: true,
              notifiedOwnerAt: new Date().toISOString(),
            };
          }),
        }));
      },

      routeToOfficer: (id, officerRole, notes) => {
        set((state) => ({
          documents: state.documents.map((doc) => {
            if (doc.id !== id) return doc;
            return {
              ...doc,
              status: 'ROUTED',
              routedTo: officerRole,
              routedAt: new Date().toISOString(),
              deoNotes: notes ? `${doc.deoNotes ? doc.deoNotes + ' | ' : ''}Routing Note: ${notes}` : doc.deoNotes,
            };
          }),
        }));
      },

      linkUlpin: (id, ulpin) => {
        set((state) => ({
          documents: state.documents.map((doc) => {
            if (doc.id !== id) return doc;
            return {
              ...doc,
              linkedUlpin: ulpin,
            };
          }),
        }));
      },

      getDocument: (id) => {
        return get().documents.find((d) => d.id === id);
      },
    }),
    {
      name: 'bhooraksha-old-documents-store',
    }
  )
);
