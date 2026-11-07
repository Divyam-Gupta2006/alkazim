export interface Persona {
  name: string;
  short: string;
  line: string;
  pain: string;
  quote: string;
  captionBefore?: string;
  captionAfter?: string;
}

export const personas: Persona[] = [
  {
    name: "Accountants",
    short: "ACCOUNTING",
    line: "We automate ledger reconciliations, expense workings, and draft schedules—so you spend less time on data entry and more time advising clients.",
    pain: "Hours of skilled capacity disappear into keying invoice figures, chasing missing receipts, and fixing spreadsheet errors under tight close deadlines.",
    quote: "Endloops prepares the repetitive work in minutes. Our team can focus on the exceptions, the context, and the decisions that matter.",
    captionBefore: "Manual ledger reconciliations & invoice entry",
    captionAfter: "Automated work papers ready for client advisory",
  },
  {
    name: "Auditors",
    short: "ASSURANCE",
    line: "We extract figures, vouch sample transactions, and flag rule exceptions across hundreds of files—preparing working papers for your final sign-off.",
    pain: "Vouching ledger samples against multi-page PDFs and checking statutory rules by hand is repetitive, time-consuming, and leaves room for oversight.",
    quote: "The documents are organised, the mismatches are visible, and the audit judgement stays with the professional.",
    captionBefore: "Manual vouching across multi-page PDFs",
    captionAfter: "Organised exceptions with audit-ready evidence",
  },
  {
    name: "Finance Teams",
    short: "CORPORATE FINANCE",
    line: "We verify vendor tenders, match purchase orders, and check reports against agreed limits—giving you financial clarity without the manual bottleneck.",
    pain: "Cross-checking purchase orders, comparing vendor tenders line by line, and verifying reports slows down strategic decisions.",
    quote: "Every exception is surfaced before a payment or reporting decision reaches the approval stage.",
    captionBefore: "Line-by-line vendor tender comparisons",
    captionAfter: "Exceptions flagged prior to payment approvals",
  },
  {
    name: "Property Managers",
    short: "PROPERTY FINANCE",
    line: "We prepare service-charge budgets, verify contractor quotes, and support escrow audits across your property portfolio.",
    pain: "Annual service-charge budgets, maintenance tenders, and escrow reconciliations across multiple buildings demand constant manual coordination.",
    quote: "Our property financial workflows become structured and reviewable, leaving managers more time for residents and clients.",
    captionBefore: "Manual budget preparation and escrow checking",
    captionAfter: "Structured workflows and reviewable building portfolios",
  }
];

export const solutions = [
  { n: "01", title: "Budget Review", tag: "PROPERTY FINANCE", description: "Review annual General and Sinking Fund budgets with historical expenditure, contract terms, variance checks, and draft review working papers.", details: ["Compare proposed budgets with prior-year actuals", "Flag unusual year-over-year movements", "Check cost allocations and budget limits", "Prepare review-ready working papers"] },
  { n: "02", title: "Escrow Audit", tag: "REAL ESTATE", description: "Reconcile buyer deposits and contractor payout requests with supporting agreements, progress certificates, and statutory escrow requirements.", details: ["Match unit-buyer deposits to SPAs", "Verify contractor claims against progress certificates", "Check retention and release conditions", "Prepare draft escrow compliance reports"] },
  { n: "03", title: "Financial Audit", tag: "ASSURANCE", description: "Bring statutory audit preparation together—from trial balance mapping and sample testing to organised working papers.", details: ["Map trial balances to lead schedules", "Automate sample selection and vouching", "Flag ledger and source-document discrepancies", "Assemble working papers for partner sign-off"] },
  { n: "04", title: "Interim Audit", tag: "PERIODIC REVIEW", description: "Run mid-year or quarterly checks to identify accounting errors, revenue leakage, and control gaps before year-end.", details: ["Compare quarterly ledger movements", "Identify possible cutoff errors and liabilities", "Surface control exceptions", "Create an executive interim review pack"] },
  { n: "05", title: "Property Budget Preparation", tag: "PROPERTY MANAGEMENT", description: "Build operating budgets across utilities, security, MEP maintenance, and reserve funds using contracts and historical actuals.", details: ["Pull prior-year actuals into a draft", "Extract renewal rates from vendor contracts", "Calculate unit-wise service-charge apportionments", "Prepare a budget for management approval"] }
];

export const tools = [
  { n: "01", title: "Purchase-Order Extraction", description: "Extract PO numbers, vendor details, quantities, unit prices, and delivery terms from bulk PDFs and scanned purchase orders.", output: "Structured tables / ERP-ready spreadsheets", color: "teal" },
  { n: "02", title: "Vouching Automation", description: "Pair ledger rows with supporting invoices, receipts, and delivery notes; highlight missing evidence and mismatched fields.", output: "Matched ledger items with exceptions", color: "blue" },
  { n: "03", title: "Expense Working Automation", description: "Categorise bulk expense claims and receipts, verify VAT arithmetic, detect duplicates, and prepare expense schedules.", output: "Clean expense schedule for review", color: "lilac" },
  { n: "04", title: "Financial Report Review", description: "Check financial statements and board reports for casting errors and inconsistencies between notes and primary statements.", output: "Flagged report review checklist", color: "blue" },
  { n: "05", title: "Tender Verification", description: "Extract pricing and scope terms from competing contractor bids and compare them side by side against budgets.", output: "Comparable tender evaluation table", color: "teal" },
  { n: "06", title: "Reconciliation", description: "Match thousands of rows between bank statements, ledgers, vendor statements, or accounts payable data.", output: "Matched transactions and unmatched exceptions", color: "lilac" }
];

export interface Capability {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

export const capabilities: Capability[] = [
  { id: "read-documents", badge: "OCR & PARSE", title: "Read documents", subtitle: "Intelligent OCR & parsing", description: "Extract line items, dates, tax registration numbers, and totals from PDFs, scans, invoices, contracts, and statements.", icon: "scan" },
  { id: "compare-match", badge: "VERIFICATION", title: "Compare & match", subtitle: "Cross-document verification", description: "Cross-reference extracted data against ledgers, sub-ledgers, bank statements, or competing vendor quotes.", icon: "git-compare" },
  { id: "check-rules", badge: "COMPLIANCE", title: "Check against rules", subtitle: "Compliance & anomaly engine", description: "Flag missing signatures, mismatched totals, duplicate invoices, VAT errors, and spending outside agreed limits.", icon: "shield-check" },
  { id: "prepare-drafts", badge: "WORKING PAPERS", title: "Prepare drafts", subtitle: "Automated working papers", description: "Generate audit schedules, working papers, variance tables, and draft compliance reports for senior review.", icon: "file-check" },
  { id: "handle-bulk", badge: "BATCH PIPELINE", title: "Handle bulk work", subtitle: "High-volume batch processing", description: "Ingest and process hundreds or thousands of multi-page financial documents in one batch.", icon: "layers" }
];
