export interface RegistryPage {
  pageNumber: number;
  title: string;
  subtitle: string;
  watermark: string;
  fieldKeys: string[];
  htmlContent: string;
}

export interface DocumentRecord {
  id: string;
  applicationId: string;
  docTypeKey: 'sale_deed' | 'ror_record' | 'id_proof' | 'mutation_record' | 'link_doc' | 'cadastral_map' | string;
  docType: string;
  displayName: string;
  fileName: string;
  sourceLabel: string;
  ocrStatus: string;
  totalPages: number;
  pages: RegistryPage[];
  available: boolean;
  required: boolean;
  confidence: string;
  missingMessage?: string;
  metadata?: Record<string, any>;
}

export const createDocumentRegistry = (appId: string = 'VRF-2026-501'): Record<string, DocumentRecord> => {
  const formattedAppId = appId || 'VRF-2026-501';

  return {
    // 1. REGISTERED SALE DEED
    'sale_deed': {
      id: `${formattedAppId}-SALE-DEED`,
      applicationId: formattedAppId,
      docTypeKey: 'sale_deed',
      docType: 'REGISTERED SALE DEED (KRAYA PATRAM)',
      displayName: 'Registered Sale Deed',
      fileName: `Registered_Sale_Deed_${formattedAppId}.pdf`,
      sourceLabel: 'Citizen Uploaded Certified Document (SRO Archives)',
      ocrStatus: 'AI / OCR Processed & Extracted (99.2% Confidence)',
      confidence: '99.2%',
      totalPages: 4,
      available: true,
      required: true,
      pages: [
        {
          pageNumber: 1,
          title: 'STAMP DUTY & EXECUTION DEED — PAGE 1',
          subtitle: 'Sub-Registrar Office, Serilingampally | Registration Book-1',
          watermark: 'CERTIFIED REGISTERED SALE DEED',
          fieldKeys: ['ownerName', 'previousOwner', 'documentNumber', 'registrationDate'],
          htmlContent: `
            <div class="border-2 border-slate-700 bg-slate-950 p-6 rounded-xl space-y-4 font-serif text-slate-200">
              <div class="text-center border-b border-slate-800 pb-3">
                <span class="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase font-bold tracking-widest block mb-1">OFFICIAL INSTRUMENT COPY</span>
                <h3 class="text-lg font-bold uppercase tracking-wide text-amber-400">Government of Telangana — Registration & Stamps Dept</h3>
                <p class="text-xs text-slate-400 font-sans mt-0.5">SRO Serilingampally (0411) • Book No. 1 • Document No: <span class="text-white font-mono font-bold">BK-1/4491/2025</span></p>
              </div>
              <div class="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs space-y-1 font-sans">
                <p><strong class="text-amber-300">Instrument Type:</strong> ABSOLUTE SALE DEED FOR AGRICULTURAL / PLOTTED LAND</p>
                <p><strong class="text-amber-300">Stamp Duty Paid:</strong> ₹ 3,45,000/- (e-Challan Txn #TS-REG-2025-994102)</p>
              </div>
              <div class="text-xs leading-relaxed space-y-3 text-slate-300 font-sans">
                <p>THIS DEED OF SALE is executed on this <strong>20th day of December, 2025</strong> by:</p>
                <div class="p-3 bg-slate-900 border border-slate-800 rounded-lg" data-field-key="previousOwner">
                  <span class="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Vendor / Executant (Previous Title Holder):</span>
                  <p class="text-sm font-bold text-slate-100">Sri Suresh V. Rao, S/o Late N. V. Rao</p>
                  <p class="text-[11px] text-slate-400">R/o H.No. 4-12/1, Kondapur Village, Serilingampally Mandal, Ranga Reddy District.</p>
                </div>
                <p class="font-bold text-amber-400">IN FAVOUR OF:</p>
                <div class="p-3 bg-slate-900 border border-slate-800 rounded-lg ring-2 ring-amber-500/40" data-field-key="ownerName">
                  <span class="text-[10px] text-amber-400 uppercase font-bold block mb-0.5">Purchaser / Claimant (Owner):</span>
                  <p class="text-sm font-bold text-white">Sri Ramesh Kumar Patel, S/o Late Shankar Patel</p>
                  <p class="text-[11px] text-slate-400">R/o Plot 402, Royal Enclave, Gachibowli, Hyderabad 500032. Aadhaar: XXXX-XXXX-8821</p>
                </div>
              </div>
            </div>
          `,
        },
        {
          pageNumber: 2,
          title: 'SCHEDULE OF PROPERTY & BOUNDARIES — PAGE 2',
          subtitle: 'Schedule A Parcel Description & Boundary Alignment',
          watermark: 'SCHEDULE OF PROPERTY',
          fieldKeys: ['area', 'boundaryNorth', 'boundarySouth', 'boundaryEast', 'boundaryWest'],
          htmlContent: `
            <div class="border-2 border-slate-700 bg-slate-950 p-6 rounded-xl space-y-4 font-sans text-slate-200">
              <div class="border-b border-slate-800 pb-2">
                <h4 class="text-sm font-bold text-amber-400 uppercase">Schedule 'A' Property Specification</h4>
                <p class="text-xs text-slate-400">Detailed land extent, survey parcel and schedule boundaries</p>
              </div>
              <div class="grid grid-cols-2 gap-3 text-xs" data-field-key="area">
                <div class="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span class="text-slate-400 block text-[10px]">TOTAL EXTENT CONVEYED</span>
                  <span class="text-base font-bold font-mono text-white">2.50 Acres (1.0117 Hectares)</span>
                </div>
                <div class="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span class="text-slate-400 block text-[10px]">LAND CLASSIFICATION</span>
                  <span class="text-sm font-bold text-slate-200">Agricultural Dry (Patta) / Commercial Plotted</span>
                </div>
              </div>
              <div class="p-3.5 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs">
                <span class="text-[10px] text-amber-400 uppercase font-bold block">CONVEYED SCHEDULE BOUNDARIES:</span>
                <div class="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div class="p-2 bg-slate-950 rounded border border-slate-800"><strong class="text-slate-400 block text-[10px]">NORTH:</strong> Survey 122 Panchayat Cart Track</div>
                  <div class="p-2 bg-slate-950 rounded border border-slate-800"><strong class="text-slate-400 block text-[10px]">SOUTH:</strong> Survey 124 Canal Reserve</div>
                  <div class="p-2 bg-slate-950 rounded border border-slate-800"><strong class="text-slate-400 block text-[10px]">EAST:</strong> Minor Irrigation Nala Buffer</div>
                  <div class="p-2 bg-slate-950 rounded border border-slate-800"><strong class="text-slate-400 block text-[10px]">WEST:</strong> Survey 121 Private Agricultural Farm</div>
                </div>
              </div>
            </div>
          `,
        },
        {
          pageNumber: 3,
          title: 'CADASTRAL LOCATION & SURVEY CLAUSES — PAGE 3',
          subtitle: 'Village Revenue Records & Land Revenue Particulars',
          watermark: 'REVENUE & SURVEY CLAUSES',
          fieldKeys: ['surveyNumber', 'ulpin', 'village'],
          htmlContent: `
            <div class="border-2 border-slate-700 bg-slate-950 p-6 rounded-xl space-y-4 font-sans text-slate-200">
              <div class="border-b border-slate-800 pb-2">
                <h4 class="text-sm font-bold text-amber-400 uppercase">Location & Revenue Jurisdiction</h4>
              </div>
              <div class="p-3.5 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs" data-field-key="surveyNumber">
                <span class="text-[10px] text-amber-400 uppercase font-bold block">Cadastral Survey & Hissa Breakdown:</span>
                <p><strong class="text-slate-300">Survey / Hissa Number:</strong> <span class="font-mono text-white font-bold text-sm bg-slate-950 px-2 py-0.5 rounded border border-slate-700">123/456</span></p>
                <p><strong class="text-slate-300">ULPIN (Bhoo-Aadhaar):</strong> <span class="font-mono text-amber-300 font-bold">ULPIN-36-RR-SER-123-01</span></p>
                <p><strong class="text-slate-300">Revenue Village:</strong> Gachibowli | <strong class="text-slate-300">Mandal:</strong> Serilingampally | <strong class="text-slate-300">District:</strong> Ranga Reddy</p>
              </div>
            </div>
          `,
        },
        {
          pageNumber: 4,
          title: 'SUB-REGISTRAR ENDORSEMENT & REGISTRATION SEAL — PAGE 4',
          subtitle: 'Official Registration Endorsement & Thumb Impression Record',
          watermark: 'SRO ENDORSEMENT',
          fieldKeys: ['registrationNumber', 'issuingAuthority'],
          htmlContent: `
            <div class="border-2 border-slate-700 bg-slate-950 p-6 rounded-xl space-y-4 font-sans text-slate-200">
              <div class="border-b border-slate-800 pb-2 text-center">
                <h4 class="text-sm font-bold text-emerald-400 uppercase">Sub-Registrar Endorsement Stamp</h4>
                <p class="text-xs text-slate-400">Registered as Document No. BK-1/4491/2025 at SRO Serilingampally</p>
              </div>
              <div class="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs space-y-1.5">
                <p><strong class="text-emerald-300">Sub-Registrar:</strong> K. V. Satyanarayana, SRO Serilingampally</p>
                <p><strong class="text-emerald-300">Date of Registration:</strong> 20-12-2025</p>
                <p><strong class="text-emerald-300">Biometric Verification:</strong> Vendor & Purchaser Fingerprint Captured (e-KYC Passed)</p>
              </div>
            </div>
          `,
        },
      ],
    },

    // 2. ROR / PATTADAR RECORD (FORM 1-B)
    'ror_record': {
      id: `${formattedAppId}-ROR`,
      applicationId: formattedAppId,
      docTypeKey: 'ror_record',
      docType: 'RIGHT OF RECORD (FORM 1-B / PATTADAR PASSBOOK)',
      displayName: 'RoR / Pattadar Record',
      fileName: `Pattadar_Passbook_Form1B_${formattedAppId}.pdf`,
      sourceLabel: 'State Land Registry / Revenue Department Master (Form 1-B)',
      ocrStatus: 'Revenue Record Cross-Checked (96.8% Confidence)',
      confidence: '96.8%',
      totalPages: 2,
      available: true,
      required: true,
      pages: [
        {
          pageNumber: 1,
          title: 'RECORD OF RIGHTS — FORM 1-B PATTADAR TITLE KHATA — PAGE 1',
          subtitle: 'Telangana State Land Records Department | Khata No. 1042',
          watermark: 'FORM 1-B ROR RECORD',
          fieldKeys: ['ownerName', 'fatherName', 'share', 'khataNumber'],
          htmlContent: `
            <div class="border-2 border-emerald-800/60 bg-slate-950 p-6 rounded-xl space-y-4 font-sans text-slate-200">
              <div class="text-center border-b border-slate-800 pb-3">
                <span class="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase font-bold tracking-widest block mb-1">REVENUE DEPARTMENT MASTER RECORD</span>
                <h3 class="text-lg font-bold uppercase text-emerald-400 tracking-wide">Form 1-B Record of Rights (Pattadar Khata Ledger)</h3>
                <p class="text-xs text-slate-400 mt-0.5">Mandal Revenue Office, Serilingampally • Khata Number: <span class="font-mono text-white font-bold text-sm bg-slate-900 px-2 py-0.5 rounded border border-slate-700">1042</span></p>
              </div>
              <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 text-xs" data-field-key="ownerName">
                <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span class="text-[10px] text-emerald-400 uppercase font-bold">RECORDED PATTADAR (OWNER):</span>
                  <span class="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">SOLE PATTADAR 100%</span>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <span class="text-[10px] text-slate-400 block">PATTADAR NAME:</span>
                    <p class="text-base font-bold text-white">Ramesh Kumar Patel</p>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 block">FATHER / SPOUSE NAME:</span>
                    <p class="text-sm font-semibold text-slate-200">Late Shankar Patel</p>
                  </div>
                </div>
                <div class="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[11px] font-mono">
                  <div><span class="text-slate-400 block text-[10px]">VILLAGE:</span> Gachibowli</div>
                  <div><span class="text-slate-400 block text-[10px]">MANDAL:</span> Serilingampally</div>
                  <div><span class="text-slate-400 block text-[10px]">DISTRICT:</span> Ranga Reddy</div>
                </div>
              </div>
            </div>
          `,
        },
        {
          pageNumber: 2,
          title: 'PARCEL EXTENT BREAKDOWN & TAX SETTLEMENT — PAGE 2',
          subtitle: 'Khata Land Survey Parcels & Annual Land Assessment',
          watermark: 'PARCEL EXTENT LEDGER',
          fieldKeys: ['surveyNumber', 'area', 'landType'],
          htmlContent: `
            <div class="border-2 border-emerald-800/60 bg-slate-950 p-6 rounded-xl space-y-4 font-sans text-slate-200">
              <div class="border-b border-slate-800 pb-2 flex items-center justify-between">
                <h4 class="text-sm font-bold text-emerald-400 uppercase">Khata Parcel Particulars & Assessment</h4>
                <span class="text-[10px] font-mono text-slate-400">Dharani Live Sync Record</span>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
                  <thead class="bg-slate-900 text-slate-300 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th class="p-2.5">Survey / Hissa</th>
                      <th class="p-2.5">Classification</th>
                      <th class="p-2.5">Extent (Acres)</th>
                      <th class="p-2.5">Annual Land Tax</th>
                      <th class="p-2.5">Mutation Ref</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800 text-slate-200 font-mono">
                    <tr class="bg-slate-900/40">
                      <td class="p-2.5 font-bold text-amber-400">123/456</td>
                      <td class="p-2.5 font-sans">Agricultural Dry (Patta)</td>
                      <td class="p-2.5 font-bold text-white">2.50 Acres</td>
                      <td class="p-2.5 text-emerald-400">₹ 45.00 / yr</td>
                      <td class="p-2.5 text-slate-400">MUT-2026-8819</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1">
                <span class="text-[10px] text-slate-400 font-bold uppercase block">REVENUE ENCUMBRANCE STATUS:</span>
                <p class="text-emerald-400 font-bold">✓ NIL ENCUMBRANCE — No Court Orders or Government Prohibition Registered on Khata #1042.</p>
              </div>
            </div>
          `,
        },
      ],
    },

    // 3. MASKED IDENTITY PROOF (AADHAAR)
    'id_proof': {
      id: `${formattedAppId}-IDENTITY`,
      applicationId: formattedAppId,
      docTypeKey: 'id_proof',
      docType: 'MASKED IDENTITY PROOF (AADHAAR / E-KYC)',
      displayName: 'Identity Proof (Masked)',
      fileName: `IdentityProof_Masked_Aadhaar_${formattedAppId}.pdf`,
      sourceLabel: 'UIDAI E-KYC Verification Gateway (Masked Demo)',
      ocrStatus: 'UIDAI E-KYC Verified (99.8% Match)',
      confidence: '99.8%',
      totalPages: 1,
      available: true,
      required: true,
      pages: [
        {
          pageNumber: 1,
          title: 'GOVERNMENT OF INDIA — MASKED AADHAAR CARD (E-KYC)',
          subtitle: 'Unique Identification Authority of India (UIDAI)',
          watermark: 'IDENTITY PROOF VERIFIED',
          fieldKeys: ['ownerName', 'fatherName', 'aadhaarNumber'],
          htmlContent: `
            <div class="border-2 border-slate-700 bg-slate-950 p-6 rounded-xl space-y-4 font-sans text-slate-200">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center font-bold text-red-400 text-xs">GOI</div>
                  <div>
                    <h3 class="text-sm font-bold text-red-500 uppercase tracking-wide">Government of India</h3>
                    <p class="text-[10px] text-slate-400">Unique Identification Authority of India (UIDAI)</p>
                  </div>
                </div>
                <span class="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">✓ E-KYC VERIFIED</span>
              </div>
              <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 text-xs">
                <div class="flex items-start gap-4">
                  <div class="w-20 h-24 bg-slate-950 border border-slate-700 rounded-lg flex flex-col items-center justify-center text-[10px] text-slate-500 shrink-0">
                    <span class="text-2xl">👤</span>
                    <span class="font-mono mt-1 text-[9px]">PHOTO CARD</span>
                  </div>
                  <div class="space-y-1.5 min-w-0 flex-1">
                    <div>
                      <span class="text-[10px] text-slate-400 uppercase block font-semibold">FULL NAME:</span>
                      <p class="text-base font-bold text-white" data-field-key="ownerName">Ramesh Kumar Patel</p>
                    </div>
                    <div>
                      <span class="text-[10px] text-slate-400 uppercase block font-semibold">FATHER'S NAME:</span>
                      <p class="text-xs font-semibold text-slate-200">Shankar Patel</p>
                    </div>
                    <div>
                      <span class="text-[10px] text-slate-400 uppercase block font-semibold">DATE OF BIRTH / GENDER:</span>
                      <p class="text-xs text-slate-300 font-mono">14/08/1978 • MALE</p>
                    </div>
                  </div>
                </div>
                <div class="pt-3 border-t border-slate-800 space-y-2">
                  <div>
                    <span class="text-[10px] text-slate-400 uppercase block font-semibold">AADHAAR NUMBER (MASKED DEMO):</span>
                    <p class="text-base font-mono font-bold text-amber-400 bg-slate-950 px-3 py-1 rounded border border-slate-800 inline-block">XXXX - XXXX - 8821</p>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 uppercase block font-semibold">PERMANENT ADDRESS:</span>
                    <p class="text-xs text-slate-300 leading-relaxed">Plot 402, Royal Enclave, Gachibowli, Hyderabad, Serilingampally Mandal, Ranga Reddy District, Telangana - 500032</p>
                  </div>
                </div>
              </div>
              <p class="text-[10px] text-slate-500 text-center font-mono uppercase">★ Masked synthetic demo identity document generated for Bhooraksha verifier testing.</p>
            </div>
          `,
        },
      ],
    },

    // 4. MUTATION RECORD ORDER
    'mutation_record': {
      id: `${formattedAppId}-MUTATION`,
      applicationId: formattedAppId,
      docTypeKey: 'mutation_record',
      docType: 'TAHSILDAR MUTATION ORDER & PROCEEDINGS',
      displayName: 'Mutation Record Order',
      fileName: `Mutation_Order_Proceeding_${formattedAppId}.pdf`,
      sourceLabel: 'Mandal Revenue Office Register (Serilingampally)',
      ocrStatus: 'Revenue Proceeding Verified (94.5% Confidence)',
      confidence: '94.5%',
      totalPages: 2,
      available: false, // Default set to available or toggleable
      required: true,
      missingMessage: 'Mutation Record Order has not been uploaded for this application dossier by the DEO.',
      pages: [
        {
          pageNumber: 1,
          title: 'PROCEEDINGS OF THE TAHSILDAR & EXECUTIVE MAGISTRATE — PAGE 1',
          subtitle: 'Mandal Revenue Office, Serilingampally | Proceeding # MUT-2026-8819',
          watermark: 'MUTATION ORDER PROCEEDING',
          fieldKeys: ['mutationNumber', 'ownerName', 'previousOwner'],
          htmlContent: `
            <div class="border-2 border-slate-700 bg-slate-950 p-6 rounded-xl space-y-4 font-sans text-slate-200">
              <div class="text-center border-b border-slate-800 pb-3">
                <span class="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase font-bold tracking-widest block mb-1">REVENUE PROCEEDING ORDER</span>
                <h4 class="text-base font-bold uppercase text-amber-400">Office of the Tahsildar & Executive Magistrate</h4>
                <p class="text-xs text-slate-400">Proceeding No: <span class="font-mono text-white font-bold">MUT-2026-8819</span> • Sanction Date: <span class="font-mono text-slate-200">15-01-2026</span></p>
              </div>
              <div class="p-3.5 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-2">
                <p><strong class="text-amber-300">Subject:</strong> Land Mutation & Transfer of Title in Record of Rights (1-B) for Sy. 123/456 Extent 2.50 Acres in Gachibowli Village.</p>
                <p><strong class="text-slate-300">Order Sanctioned:</strong> Title transferred from Sri Suresh V. Rao to Sri Ramesh Kumar Patel pursuant to Registered Sale Deed BK-1/4491/2025.</p>
              </div>
            </div>
          `,
        },
        {
          pageNumber: 2,
          title: 'REVENUE OFFICIAL ENDORSEMENT & GAZETTE SEAL — PAGE 2',
          subtitle: 'Field Girdawar Inspection & Mandal Revenue Gazette Seal',
          watermark: 'OFFICIAL REVENUE SEAL',
          fieldKeys: ['issuingAuthority', 'officerRemarks'],
          htmlContent: `
            <div class="border-2 border-slate-700 bg-slate-950 p-6 rounded-xl space-y-4 font-sans text-slate-200">
              <div class="border-b border-slate-800 pb-2">
                <h4 class="text-sm font-bold text-amber-400 uppercase">Field Scrutiny & Endorsement</h4>
              </div>
              <div class="p-3.5 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-2">
                <p><strong class="text-slate-300">Inspecting Officer:</strong> K. Venkat Rao (Senior Girdawar)</p>
                <p><strong class="text-slate-300">VRO Field Verification:</strong> Verified physical possession on ground. No adverse boundary claims.</p>
                <p><strong class="text-slate-300">Sanctioning Authority:</strong> Tahsildar & Executive Magistrate, Serilingampally</p>
              </div>
            </div>
          `,
        },
      ],
    },

    // 5. PRIOR LINK DEED
    'link_doc': {
      id: `${formattedAppId}-PRIOR-TITLE`,
      applicationId: formattedAppId,
      docTypeKey: 'link_doc',
      docType: 'PRIOR LINK TITLE DEED (HISTORICAL INSTRUMENT)',
      displayName: 'Prior Link Deed',
      fileName: `Prior_Link_Deed_2019_${formattedAppId}.pdf`,
      sourceLabel: 'SRO Registration Archive (Previous Title Deed)',
      ocrStatus: 'Archival Scan OCR (97.1% Confidence)',
      confidence: '97.1%',
      totalPages: 2,
      available: true,
      required: true,
      pages: [
        {
          pageNumber: 1,
          title: 'CERTIFIED COPY OF PRIOR SALE DEED (2019) — PAGE 1',
          subtitle: 'SRO Serilingampally Archive | Document No. BK-1/2210/2019',
          watermark: 'PRIOR TITLE ARCHIVE',
          fieldKeys: ['previousOwner', 'priorDocumentNumber'],
          htmlContent: `
            <div class="border-2 border-slate-700 bg-slate-950 p-6 rounded-xl space-y-4 font-serif text-slate-200">
              <div class="text-center border-b border-slate-800 pb-3 font-sans">
                <span class="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full uppercase font-bold tracking-widest block mb-1">PREVIOUS TITLE LINK DEED (2019)</span>
                <h4 class="text-base font-bold uppercase text-cyan-400">Sub-Registrar Office Archives — Serilingampally</h4>
                <p class="text-xs text-slate-400">Prior Document No: <span class="font-mono text-white font-bold">BK-1/2210/2019</span> • Reg Date: <span class="font-mono text-slate-200">14-03-2019</span></p>
              </div>
              <div class="p-3.5 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-2 font-sans">
                <p><strong class="text-cyan-300">Transferor (Vendor in 2019):</strong> Sri K. Jagadishwar Reddy, S/o Late K. N. Reddy</p>
                <p><strong class="text-cyan-300">Transferee (Purchaser in 2019):</strong> Sri Suresh V. Rao, S/o Late N. V. Rao</p>
                <p><strong class="text-slate-300">Conveyed Land Extent:</strong> 2.50 Acres in Survey No. 123/456, Gachibowli Village.</p>
              </div>
            </div>
          `,
        },
        {
          pageNumber: 2,
          title: 'PRIOR DEED SCHEDULE & REGISTRATION INDEX — PAGE 2',
          subtitle: 'Archival SRO Index Register & Consideration Particulars',
          watermark: 'ARCHIVAL SRO INDEX',
          fieldKeys: ['priorRegistrationDate', 'consideration'],
          htmlContent: `
            <div class="border-2 border-slate-700 bg-slate-950 p-6 rounded-xl space-y-4 font-sans text-slate-200">
              <div class="border-b border-slate-800 pb-2">
                <h4 class="text-sm font-bold text-cyan-400 uppercase">2019 Transaction Stamp & Index Entry</h4>
              </div>
              <div class="p-3.5 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1">
                <p><strong class="text-slate-300">Consideration Amount:</strong> ₹ 1,85,000/- Stamp Duty Paid</p>
                <p><strong class="text-slate-300">SRO Volume / Page:</strong> Volume 412, Pages 88 to 94</p>
                <p><strong class="text-emerald-400 font-bold">✓ Title Lineage Verified:</strong> Valid link establishing ownership of Sri Suresh V. Rao prior to 2025 sale to Ramesh Kumar Patel.</p>
              </div>
            </div>
          `,
        },
      ],
    },

    // 6. CADASTRAL MAP (FMB)
    'cadastral_map': {
      id: `${formattedAppId}-CADASTRAL`,
      applicationId: formattedAppId,
      docTypeKey: 'cadastral_map',
      docType: 'CADASTRAL VILLAGE MAP / FIELD MEASUREMENT BOOK (FMB)',
      displayName: 'Cadastral Map',
      fileName: `Cadastral_FMB_Tippan_Map_${formattedAppId}.pdf`,
      sourceLabel: 'Survey & Settlement Department (FMB Tippan Vector GIS)',
      ocrStatus: 'GIS Vector Georeferenced (100% Alignment)',
      confidence: '100% Vector Match',
      totalPages: 1,
      available: true,
      required: true,
      pages: [
        {
          pageNumber: 1,
          title: 'FIELD MEASUREMENT BOOK (FMB TIPPAN) — PARCEL 123/456',
          subtitle: 'Survey & Settlement Department | Village Gachibowli',
          watermark: 'CADASTRAL FMB VECTOR MAP',
          fieldKeys: ['surveyNumber', 'area', 'boundaryNorth', 'boundarySouth', 'boundaryEast', 'boundaryWest', 'coordinates'],
          htmlContent: `
            <div class="border-2 border-cyan-800/60 bg-slate-950 p-6 rounded-xl space-y-4 font-sans text-slate-200">
              <div class="border-b border-slate-800 pb-2 flex items-center justify-between">
                <div>
                  <span class="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full uppercase font-bold tracking-widest block mb-1">STATE CADASTRAL GIS DATABASE</span>
                  <h4 class="text-sm font-bold text-cyan-400 uppercase">Field Measurement Sketch (FMB Tippan Parcel Vector)</h4>
                </div>
                <span class="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 border border-cyan-800 px-2.5 py-1 rounded-lg">Sy. 123/456</span>
              </div>
              
              {/* Interactive Vector Parcel Diagram Box */}
              <div class="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div class="relative w-full h-52 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col items-center justify-center p-4">
                  {/* Grid Lines Overlay */}
                  <div class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
                  
                  {/* Polygon SVG Sketch */}
                  <svg viewBox="0 0 300 160" class="w-full h-full max-w-sm z-10">
                    <polygon points="40,30 260,25 240,135 50,130" fill="rgba(6, 182, 212, 0.15)" stroke="#06b6d4" stroke-width="2.5" stroke-dasharray="0" />
                    <text x="150" y="20" fill="#94a3b8" font-size="9" text-anchor="middle" font-family="monospace">N: Sy 122 Cart Track (120m)</text>
                    <text x="150" y="150" fill="#94a3b8" font-size="9" text-anchor="middle" font-family="monospace">S: Sy 124 Canal Reserve (118m)</text>
                    <text x="20" y="85" fill="#94a3b8" font-size="9" text-anchor="middle" font-family="monospace" transform="rotate(-90 20 85)">W: Sy 121 (85m)</text>
                    <text x="280" y="85" fill="#94a3b8" font-size="9" text-anchor="middle" font-family="monospace" transform="rotate(90 280 85)">E: Nala (80m)</text>
                    
                    <circle cx="145" cy="80" r="4" fill="#38bdf8" />
                    <text x="145" y="98" fill="#f8fafc" font-size="10" font-weight="bold" text-anchor="middle">Sy. 123/456 (2.50 Acres)</text>
                  </svg>
                  
                  {/* Compass Arrow */}
                  <div class="absolute top-2 right-2 bg-slate-900/90 border border-slate-700 px-2 py-1 rounded text-[9px] font-mono text-cyan-300 font-bold">
                    ▲ NORTH 0°
                  </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-center">
                  <div class="p-2 bg-slate-950 rounded border border-slate-800"><span class="text-slate-500 block text-[9px]">RECORDED EXTENT</span><strong class="text-cyan-300">2.50 Acres</strong></div>
                  <div class="p-2 bg-slate-950 rounded border border-slate-800"><span class="text-slate-500 block text-[9px]">PERIMETER</span><strong class="text-slate-200">480.0 Meters</strong></div>
                  <div class="p-2 bg-slate-950 rounded border border-slate-800"><span class="text-slate-500 block text-[9px]">LATITUDE</span><strong class="text-slate-200">17.4401° N</strong></div>
                  <div class="p-2 bg-slate-950 rounded border border-slate-800"><span class="text-slate-500 block text-[9px]">LONGITUDE</span><strong class="text-slate-200">78.3489° E</strong></div>
                </div>
              </div>
            </div>
          `,
        },
      ],
    },
  };
};

export const getDocumentRegistryEntry = (docIdOrType: string, appId?: string): DocumentRecord => {
  const registry = createDocumentRegistry(appId || 'VRF-2026-501');
  const query = (docIdOrType || '').toLowerCase().trim();

  // 1. Direct key match
  if (registry[query]) {
    return registry[query];
  }

  // 2. ID match
  const byId = Object.values(registry).find((doc) => doc.id.toLowerCase() === query);
  if (byId) return byId;

  // 3. Keyword matching logic
  if (query.includes('ror') || query.includes('pattadar') || query.includes('passbook') || query.includes('1b') || query.includes('1-b')) {
    return registry['ror_record'];
  }
  if (query.includes('identity') || query.includes('aadhaar') || query.includes('id_proof') || query.includes('voter') || query.includes('kyc')) {
    return registry['id_proof'];
  }
  if (query.includes('mutation') || query.includes('proceeding') || query.includes('order')) {
    return registry['mutation_record'];
  }
  if (query.includes('prior') || query.includes('link') || query.includes('title_deed') || query.includes('title')) {
    return registry['link_doc'];
  }
  if (query.includes('cadastral') || query.includes('map') || query.includes('fmb') || query.includes('tippan') || query.includes('gis')) {
    return registry['cadastral_map'];
  }
  if (query.includes('sale') || query.includes('deed') || query.includes('kraya')) {
    return registry['sale_deed'];
  }

  // 4. Substring search in displayName or docType
  const matched = Object.values(registry).find((doc) =>
    doc.displayName.toLowerCase().includes(query) ||
    doc.docType.toLowerCase().includes(query) ||
    doc.docTypeKey.toLowerCase().includes(query)
  );

  return matched || registry['sale_deed'];
};
