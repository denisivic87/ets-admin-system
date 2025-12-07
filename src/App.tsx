import React, { useState, useEffect } from 'react';
import { Plus, Download, Trash2, AlertTriangle, Table, Hash, FileText, Upload, ShieldCheck } from 'lucide-react';
import { CreditCard as Edit } from 'lucide-react';
import { Header, Record, ValidationError } from './types/records';
import { LoginCredentials, AdminCredentials, AuthState } from './types/auth';
import { HeaderForm } from './components/HeaderForm';
import { RecordForm } from './components/RecordForm';
import { RecordsTable } from './components/RecordsTable';
import { RecordModal } from './components/RecordModal';
import { BulkEditModal, BulkEditData } from './components/BulkEditModal';
import { LoginForm } from './components/LoginForm';
import { AdminLoginForm } from './components/AdminLoginForm';
import { AdminDashboard } from './components/AdminDashboard';
import { SearchBar } from './components/SearchBar';
import { SequenceIntegrityMonitor } from './components/SequenceIntegrityMonitor';
import { generateXML, downloadXML } from './utils/xmlGenerator';
import { importXMLFile, parseXML } from './utils/xmlParser';
import { validateAll } from './utils/validation';
import {
  initializeAuth,
  authenticateAdmin,
  authenticateUser,
  getCurrentUser,
  setCurrentUser,
  logout,
  logActivity
} from './utils/auth';
import {
  saveHeader,
  loadHeader,
  saveRecords,
  loadRecords,
  loadPrefillEnabled,
  clearAllData,
} from './utils/storage';

const recordsPerPage = 20;

function App() {
  // Helper function to sort records by sequence number
  const sortRecordsBySequence = (recordsList: Record[]): Record[] => {
    return [...recordsList].sort((a, b) => {
      const seqA = a.sequence_number ?? Number.MAX_SAFE_INTEGER;
      const seqB = b.sequence_number ?? Number.MAX_SAFE_INTEGER;

      if (seqA !== seqB) {
        return seqA - seqB;
      }

      const dateA = new Date(a.id).getTime();
      const dateB = new Date(b.id).getTime();
      return dateA - dateB;
    });
  };

  // Auth state
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isAdmin: false
  });
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [authError, setAuthError] = useState<string>('');

  // Existing state
  const [header, setHeader] = useState<Header>(loadHeader());
  const [records, setRecords] = useState<Record[]>(loadRecords());
  const [allRecords, setAllRecords] = useState<Record[]>(loadRecords());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [prefillEnabled] = useState<boolean>(loadPrefillEnabled());
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number>(-1);
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'forms'>('table');
  const [bulkCount, setBulkCount] = useState<string>('1');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState<boolean>(false);

  // Initialize auth on app start
  useEffect(() => {
    initializeAuth();
    const currentUser = getCurrentUser();
    if (currentUser) {
      setAuthState({
        isAuthenticated: true,
        user: currentUser,
        isAdmin: false
      });
    }
  }, []);

  useEffect(() => {
    const loadedRecords = loadRecords();
    const sortedRecords = sortRecordsBySequence(loadedRecords);
    setAllRecords(sortedRecords);
    setRecords(sortedRecords);
  }, [authState.isAuthenticated]);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      saveHeader(header);
      saveRecords(allRecords);
    }
  }, [header, allRecords, authState]);

  // Handle user login
  const handleUserLogin = (credentials: LoginCredentials) => {
    const user = authenticateUser(credentials);
    if (user) {
      setAuthState({
        isAuthenticated: true,
        user,
        isAdmin: false
      });
      setCurrentUser(user);
      setAuthError('');

      // Load user's specific data based on budget_user_id and treasury
      const userHeader = {
        ...loadHeader(),
        budget_user_id: user.budget_user_id,
        treasury: user.treasury
      };
      setHeader(userHeader);
    } else {
      setAuthError('Neispravno korisničko ime ili lozinka, ili je nalog neaktivan.');
    }
  };

  // Handle admin login
  const handleAdminLogin = (credentials: AdminCredentials) => {
    if (authenticateAdmin(credentials)) {
      setAuthState({
        isAuthenticated: true,
        user: null,
        isAdmin: true
      });
      setAuthError('');
      setShowAdminLogin(false);
    } else {
      setAuthError('Neispravni admin podaci.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setAuthState({
      isAuthenticated: false,
      user: null,
      isAdmin: false
    });
    setShowAdminLogin(false);
    setAuthError('');
  };

  const createEmptyRecord = (): Record => ({
    id: Date.now().toString(),
    reason_code: '',
    external_id: '',
    recipient: '',
    recipient_place: '',
    account_number: '',
    invoice_number: '',
    invoice_type: '',
    invoice_date: '',
    due_date: '',
    contract_number: '',
    payment_code: '',
    credit_model: '',
    credit_reference_number: '',
    payment_basis: '',
    item: {
      budget_user_id: '',
      program_code: '',
      project_code: '',
      economic_classification_code: '',
      source_of_funding_code: '',
      function_code: '',
      amount: 0,
      recording_account: '',
      expected_payment_date: '',
      urgent_payment: false,
      posting_account: ''
    }
  });

  const createPrefillRecord = (lastRecord: Record): Record => {
    const newRecord = createEmptyRecord();

    if (prefillEnabled && lastRecord) {
      // Copy all fields except external_id, recipient, account_number
      return {
        ...newRecord,
        reason_code: lastRecord.reason_code,
        // external_id: '', // Keep empty
        // recipient: '', // Keep empty
        recipient_place: lastRecord.recipient_place,
        // account_number: '', // Keep empty
        invoice_number: lastRecord.invoice_number,
        invoice_type: lastRecord.invoice_type,
        invoice_date: lastRecord.invoice_date,
        due_date: lastRecord.due_date,
        contract_number: lastRecord.contract_number,
        payment_code: lastRecord.payment_code,
        credit_model: lastRecord.credit_model,
        credit_reference_number: lastRecord.credit_reference_number,
        payment_basis: lastRecord.payment_basis,
        item: { ...lastRecord.item }
      };
    }

    return newRecord;
  };

  const addRecords = (count: number = 1) => {
    const lastRecord = allRecords[allRecords.length - 1];
    const newRecords = [];

    for (let i = 0; i < count; i++) {
      const newRecord = lastRecord ? createPrefillRecord(lastRecord) : createEmptyRecord();
      newRecords.push(newRecord);
    }

    const updatedRecords = [...allRecords, ...newRecords];
    const sortedRecords = sortRecordsBySequence(updatedRecords);

    setAllRecords(sortedRecords);
    setRecords(sortedRecords);
    setSearchQuery('');
    setErrors([]);

    if (authState.user) {
      logActivity(authState.user.id, count, 0, 0);
    }

    const totalRecords = sortedRecords.length;
    const lastPage = Math.ceil(totalRecords / recordsPerPage);
    setCurrentPage(lastPage);
  };

  const handleBulkAdd = () => {
    const count = parseInt(bulkCount) || 1;
    if (count > 0 && count <= 100) { // Limit to 100 records at once
      addRecords(count);
      setBulkCount('1'); // Reset to 1
    }
  };

  const updateRecord = (_index: number, updatedRecord: Record) => {
    const newAllRecords = [...allRecords];
    const actualIndex = allRecords.findIndex(r => r.id === updatedRecord.id);
    if (actualIndex >= 0) {
      newAllRecords[actualIndex] = updatedRecord;
      const sortedRecords = sortRecordsBySequence(newAllRecords);

      setAllRecords(sortedRecords);

      if (searchQuery) {
        const filtered = filterRecords(sortedRecords, searchQuery);
        setRecords(filtered);
      } else {
        setRecords(sortedRecords);
      }
    }
    setErrors([]);

    if (authState.user) {
      logActivity(authState.user.id, 0, 1, updatedRecord.item.amount);
    }
  };

  const handleViewRecord = (index: number) => {
    setSelectedRecordIndex(index);
    setEditingRecord(records[index]);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEditRecord = (index: number) => {
    setSelectedRecordIndex(index);
    setEditingRecord({ ...records[index] });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleSaveRecord = () => {
    if (editingRecord && selectedRecordIndex >= 0) {
      updateRecord(selectedRecordIndex, editingRecord);
      setShowModal(false);
      setEditingRecord(null);
      setSelectedRecordIndex(-1);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRecord(null);
    setSelectedRecordIndex(-1);
  };

  const removeRecord = (index: number) => {
    if (confirm('Da li ste sigurni da želite da obrišete ovaj zapis?')) {
      const recordToRemove = records[index];
      const newAllRecords = allRecords.filter(r => r.id !== recordToRemove.id);
      const sortedRecords = sortRecordsBySequence(newAllRecords);

      setAllRecords(sortedRecords);

      if (searchQuery) {
        const filtered = filterRecords(sortedRecords, searchQuery);
        setRecords(filtered);
      } else {
        setRecords(sortedRecords);
      }
      setErrors([]);
    }
  };

  const clearAll = () => {
    if (confirm('Da li ste sigurni da želite da obrišete sve podatke? Ova akcija se ne može poništiti.')) {
      setRecords([]);
      setAllRecords([]);
      setSearchQuery('');
      setHeader(loadHeader());
      setErrors([]);
      clearAllData();
    }
  };

  const handleVerifyExport = () => {
    try {
      // 1. Generate XML
      const xml = generateXML(header, records);

      // 2. Parse back
      const { header: parsedHeader, records: parsedRecords } = parseXML(xml);

      // 3. Compare Header
      const headerKeys: (keyof Header)[] = ['cumulative_reason_code', 'budget_year', 'budget_user_id', 'currency_code', 'treasury'];
      const headerErrors: string[] = [];

      headerKeys.forEach(key => {
        if (header[key].trim() !== parsedHeader[key].trim()) {
          headerErrors.push(`Header mismatch [${key}]: App='${header[key]}' vs XML='${parsedHeader[key]}'`);
        }
      });

      // 4. Compare Records
      const recordErrors: string[] = [];
      if (records.length !== parsedRecords.length) {
        recordErrors.push(`Count mismatch: App has ${records.length}, XML has ${parsedRecords.length}`);
      } else {
        records.forEach((rec, idx) => {
          const parsedRec = parsedRecords[idx];
          // Compare critical fields
          if (rec.reason_code !== parsedRec.reason_code) recordErrors.push(`Row ${idx + 1} reason_code mismatch`);
          if (rec.item.amount !== parsedRec.item.amount) recordErrors.push(`Row ${idx + 1} amount mismatch`);
          // Add more fields if necessary or deep check
        });
      }

      if (headerErrors.length === 0 && recordErrors.length === 0) {
        alert('Verifikacija uspešna! Podaci u XML-u su identični podacima u aplikaciji.');
      } else {
        alert('Verifikacija NIJE uspela:\n' + [...headerErrors, ...recordErrors].slice(0, 10).join('\n') + (headerErrors.length + recordErrors.length > 10 ? '\n...' : ''));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nepoznata greška';
      alert('Greška prilikom verifikacije: ' + errorMessage);
    }
  };

  const handleExport = () => {
    const validationErrors = validateAll(header, records);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    const xml = generateXML(header, records);
    const filename = `commitments_${new Date().toISOString().split('T')[0]}.xml`;
    downloadXML(xml, filename);
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Molimo dozvolite pop-up prozore za ovu stranicu.');
      return;
    }

    const escapeHtml = (text: string) => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    const getHeaderTitle = () => {
      const budgetUserId = header.budget_user_id || (authState.user?.budget_user_id) || '';

      const titleMap: { [key: string]: string } = {
        '02126': 'ETS-Pristina',
        '02127': 'ETS-Mitrovica',
        '02128': 'ETS-Pec',
        '02129': 'ETS-Prizren',
        '02130': 'ETS-Gnjilane',
        '02131': 'ETS-Kosovska Mitrovica'
      };

      return titleMap[budgetUserId] || 'ETS';
    };

    const printContent = `<!DOCTYPE html>
<html lang="sr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(getHeaderTitle())} - ${escapeHtml(new Date().toLocaleDateString('sr-RS'))}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
    .header { margin-bottom: 20px; }
    .header-info { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px; }
    .header-item { padding: 10px; background: #f9fafb; border-radius: 5px; border: 1px solid #e5e7eb; }
    .header-item label { font-weight: bold; color: #374151; display: block; margin-bottom: 5px; }
    .header-item span { color: #6b7280; display: block; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; font-size: 11px; }
    th { background-color: #f3f4f6; font-weight: bold; color: #1f2937; }
    .amount { text-align: right; font-weight: bold; font-family: 'Courier New', monospace; }
    .urgent-yes { background-color: #fef2f2; color: #dc2626; font-weight: bold; text-align: center; }
    .urgent-no { background-color: #f0fdf4; color: #16a34a; text-align: center; }
    .summary { margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 5px; border: 1px solid #e5e7eb; }
    .summary strong { color: #1f2937; }
    .no-print { margin-top: 30px; text-align: center; }
    .btn { padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: 500; margin: 0 5px; }
    .btn-primary { background: #3b82f6; color: white; }
    .btn-primary:hover { background: #2563eb; }
    .btn-secondary { background: #6b7280; color: white; }
    .btn-secondary:hover { background: #4b5563; }
    @media print {
      body { margin: 0; }
      .no-print { display: none; }
      table { page-break-inside: auto; }
      tr { page-break-inside: avoid; page-break-after: auto; }
    }
  </style>
</head>
<body>
  <div class="header">
    <p style="color: #6b7280; margin-bottom: 5px;">Datum izvoza: ${escapeHtml(new Date().toLocaleDateString('sr-RS'))}</p>
    ${authState.user ? `<p style="color: #059669; font-weight: 600; margin-bottom: 20px;">Korisnik: ${escapeHtml(authState.user.pdf_display_name || authState.user.username)} | Budžet: ${escapeHtml(authState.user.budget_user_id)} | Trezor: ${escapeHtml(authState.user.treasury)}</p>` : ''}
    <div class="header-info">
      <div class="header-item">
        <label>Kumulativni kod razloga:</label>
        <span>${escapeHtml(header.cumulative_reason_code || '-')}</span>
      </div>
      <div class="header-item">
        <label>Budžetska godina:</label>
        <span>${escapeHtml(header.budget_year || '-')}</span>
      </div>
      <div class="header-item">
        <label>ID korisnika budžeta:</label>
        <span>${escapeHtml(header.budget_user_id || '-')}</span>
      </div>
      <div class="header-item">
        <label>Kod valute:</label>
        <span>${escapeHtml(header.currency_code || '-')}</span>
      </div>
      <div class="header-item">
        <label>Trezor:</label>
        <span>${escapeHtml(header.treasury || '-')}</span>
      </div>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Kod razloga</th>
        <th>Spoljašnji ID</th>
        <th>Primalac</th>
        <th>Mesto primaoca</th>
        <th>Broj računa</th>
        <th>Datum fakture</th>
        <th>Datum dospeća</th>
        <th>Iznos</th>
        <th>Program</th>
        <th>Ekon. klas.</th>
        <th>Hitno</th>
      </tr>
    </thead>
    <tbody>
      ${records.map((record, index) => {
      const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        try {
          return new Date(dateStr).toLocaleDateString('sr-RS');
        } catch {
          return dateStr;
        }
      };
      return `<tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(record.reason_code || '-')}</td>
          <td>${escapeHtml(record.external_id || 'auto')}</td>
          <td>${escapeHtml(record.recipient || '-')}</td>
          <td>${escapeHtml(record.recipient_place || '-')}</td>
          <td>${escapeHtml(record.account_number || '-')}</td>
          <td>${formatDate(record.invoice_date)}</td>
          <td>${formatDate(record.due_date)}</td>
          <td class="amount">${record.item.amount.toLocaleString('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td>${escapeHtml(record.item.program_code || '-')}</td>
          <td>${escapeHtml(record.item.economic_classification_code || '-')}</td>
          <td class="${record.item.urgent_payment ? 'urgent-yes' : 'urgent-no'}">${record.item.urgent_payment ? 'Da' : 'Ne'}</td>
        </tr>`;
    }).join('')}
    </tbody>
  </table>
  <div class="summary">
    <strong>Ukupno zapisa: ${records.length}</strong><br>
    <strong>Ukupan iznos: ${getTotalAmount().toLocaleString('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${escapeHtml(header.currency_code)}</strong>
    ${authState.user ? `<br><br><span style="color: #6b7280; font-size: 12px;">Generisao: ${escapeHtml(authState.user.username)}</span>` : ''}
  </div>
  <div class="no-print">
    <button onclick="window.print()" class="btn btn-primary">Štampaj</button>
    <button onclick="window.close()" class="btn btn-secondary">Zatvori</button>
  </div>
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleImportXML = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.xml')) {
      alert('Molimo odaberite XML fajl');
      return;
    }

    setIsImporting(true);
    setErrors([]);

    try {
      const parsedData = await importXMLFile(file);

      const shouldReplace = allRecords.length === 0 ||
        confirm(`Trenutno imate ${allRecords.length} zapisa. Da li želite da:\n\n` +
          `• Kliknite "OK" da zamenite postojeće podatke\n` +
          `• Kliknite "Cancel" da dodate nove zapise uz postojeće`);

      if (shouldReplace) {
        setHeader(parsedData.header);

        const recordsWithSequence = parsedData.records.map((record, index) => ({
          ...record,
          sequence_number: index + 1
        }));

        const sortedRecords = sortRecordsBySequence(recordsWithSequence);

        setAllRecords(sortedRecords);
        setRecords(sortedRecords);
        setSearchQuery('');
        setCurrentPage(1);
      } else {
        const maxSequenceNumber = Math.max(
          ...allRecords.map(r => r.sequence_number || 0),
          0
        );

        const newRecords = parsedData.records.map((record, index) => ({
          ...record,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          sequence_number: maxSequenceNumber + index + 1
        }));

        const combined = [...allRecords, ...newRecords];
        const sortedRecords = sortRecordsBySequence(combined);

        setAllRecords(sortedRecords);
        setRecords(sortedRecords);
        setSearchQuery('');

        const totalRecords = sortedRecords.length;
        const lastPage = Math.ceil(totalRecords / recordsPerPage);
        setCurrentPage(lastPage);
      }

      alert(`Uspešno učitano ${parsedData.records.length} zapisa iz XML fajla!`);
    } catch (error) {
      console.error('Import error:', error);
      alert(`Greška pri učitavanju XML fajla: ${error instanceof Error ? error.message : 'Nepoznata greška'}`);
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  const handleBulkEdit = (updates: BulkEditData) => {
    const updatedRecords = allRecords.map(record => {
      const updatedRecord = { ...record };

      // Ako se mijenja broj fakture, generiši novi external_id
      if (updates.invoice_number !== undefined) {
        updatedRecord.invoice_number = updates.invoice_number;
        // Generiši external_id kao # - Broj fakture
        const sequenceNum = updatedRecord.sequence_number || 0;
        updatedRecord.external_id = `${sequenceNum}-${updates.invoice_number}`;
      }

      if (updates.invoice_type !== undefined) updatedRecord.invoice_type = updates.invoice_type;
      if (updates.invoice_date !== undefined) updatedRecord.invoice_date = updates.invoice_date;
      if (updates.due_date !== undefined) updatedRecord.due_date = updates.due_date;
      if (updates.contract_number !== undefined) updatedRecord.contract_number = updates.contract_number;
      if (updates.payment_basis !== undefined) updatedRecord.payment_basis = updates.payment_basis;

      if (updates.expected_payment_date !== undefined) {
        updatedRecord.item = {
          ...updatedRecord.item,
          expected_payment_date: updates.expected_payment_date
        };
      }

      // Ako se postavlja urgent_payment flag
      if (updates.urgent_payment !== undefined) {
        updatedRecord.item = {
          ...updatedRecord.item,
          urgent_payment: updates.urgent_payment
        };
      }

      // Ako se resetuje urgent_payment flag
      if (updates.reset_urgent_payment === true) {
        updatedRecord.item = {
          ...updatedRecord.item,
          urgent_payment: false
        };
      }

      return updatedRecord;
    });

    const sortedRecords = sortRecordsBySequence(updatedRecords);

    setAllRecords(sortedRecords);

    if (searchQuery) {
      const filtered = filterRecords(sortedRecords, searchQuery);
      setRecords(filtered);
    } else {
      setRecords(sortedRecords);
    }
    setErrors([]);

    if (authState.user) {
      const totalAmount = sortedRecords.reduce((sum, r) => sum + r.item.amount, 0);
      logActivity(authState.user.id, 0, allRecords.length, totalAmount);
    }

    const changedFields = Object.keys(updates).length;
    alert(`Uspešno ažurirano ${changedFields} polja za ${allRecords.length} zapisa!`);
  };

  const filterRecords = (recordsList: Record[], query: string) => {
    if (!query.trim()) return recordsList;

    const lowerQuery = query.toLowerCase().trim();
    return recordsList.filter(record => {
      const searchableFields = [
        record.recipient || '',
        record.invoice_number || '',
        record.account_number || '',
        record.external_id || '',
        record.recipient_place || '',
        record.reason_code || '',
        record.contract_number || '',
        record.payment_basis || '',
        record.item?.program_code || '',
        record.item?.economic_classification_code || '',
        String(record.item?.amount || '')
      ];

      return searchableFields.some(field =>
        String(field).toLowerCase().includes(lowerQuery)
      );
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);

    if (!query.trim()) {
      setRecords(allRecords);
    } else {
      const filtered = filterRecords(allRecords, query);
      setRecords(filtered);
    }
  };

  const getTotalAmount = () => {
    return records.reduce((total, record) => total + record.item.amount, 0);
  };

  // Pagination logic
  const totalPages = Math.ceil(records.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = records.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset to first page when switching view modes
  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  // Show login forms if not authenticated
  if (!authState.isAuthenticated) {
    if (showAdminLogin) {
      return (
        <AdminLoginForm
          onLogin={handleAdminLogin}
          onBack={() => setShowAdminLogin(false)}
          error={authError}
        />
      );
    }

    return (
      <LoginForm
        onLogin={handleUserLogin}
        onAdminLogin={() => setShowAdminLogin(true)}
        error={authError}
      />
    );
  }

  // Show admin dashboard if admin is logged in
  if (authState.isAdmin) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // Regular user interface
  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple mb-2 drop-shadow-lg">
                Izvoz XML zapisa
              </h1>
              <p className="text-gray-300 text-lg">
                Kreiranje i upravljanje zapisima obaveza za XML izvoz
              </p>
              {authState.user && (
                <div className="mt-3 flex items-center space-x-3 text-sm font-medium">
                  <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10 text-neon-blue">
                    {authState.user.username}
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-300">Budžet: {authState.user.budget_user_id}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-300">Trezor: {authState.user.treasury}</span>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="glass-button px-5 py-2.5 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 transition-all font-medium"
            >
              Odjavi se
            </button>
          </div>
        </div>

        {/* Error Display */}
        {errors.length > 0 && (
          <div className="bg-red-900/40 backdrop-blur-md border border-red-500/30 rounded-xl p-4 mb-6 shadow-lg shadow-red-900/20">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-bold text-red-200 mb-2">
                  Molimo ispravite sledeće greške pre izvoza:
                </h3>
                <ul className="text-sm text-red-300 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>
                      <span className="font-semibold">Red {error.recordId ? '?' : '?'}:</span> {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Import / Export Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Header Form */}
          <div className="lg:col-span-2">
            <HeaderForm
              header={header}
              onChange={setHeader}
              disabled={!authState.user}
              errors={errors}
            />
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="glass-panel rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                <Upload className="h-5 w-5 mr-2 text-neon-purple" />
                Uvoz podataka
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Učitajte postojeći XML fajl da biste nastavili sa radom.
              </p>
              <label className="flex items-center justify-center w-full glass-button p-4 rounded-xl cursor-pointer hover:border-neon-purple transition-all group">
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 group-hover:text-neon-purple mb-2 transition-colors" />
                  <span className="text-sm text-gray-300 group-hover:text-white">Kliknite za odabir XML fajla</span>
                </div>
                <input
                  type="file"
                  accept=".xml"
                  onChange={handleImportXML}
                  className="hidden"
                  disabled={isImporting}
                />
              </label>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-neon-blue" />
                Sistem
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={clearAll}
                  className="glass-button p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 flex flex-col items-center justify-center gap-2 border-red-500/20"
                  title="Obriši sve podatke"
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="text-xs font-medium">Reset</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="glass-button p-3 rounded-xl text-gray-300 hover:text-white flex flex-col items-center justify-center gap-2"
                  title="Štampaj / PDF"
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs font-medium">PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 glass-panel p-4 rounded-2xl">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'table'
                ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              title="Tabelarni prikaz"
            >
              <Table className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('forms')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'forms'
                ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              title="Pojedinačni unos"
            >
              <Edit className="h-5 w-5" />
            </button>
            <div className="h-6 w-px bg-white/10 mx-2"></div>
            <SearchBar onSearch={handleSearch} placeholder="Pretraži..." />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowBulkEditModal(true)}
              className="glass-button px-4 py-2.5 rounded-xl text-gray-200 flex items-center gap-2 hover:border-neon-pink/50 hover:text-neon-pink transition-all"
            >
              <Hash className="h-4 w-4" />
              <span className="hidden sm:inline">Masovna izmena</span>
            </button>

            <div className="flex items-center bg-black/20 rounded-xl p-1 border border-white/10">
              <input
                type="number"
                min="1"
                max="100"
                value={bulkCount}
                onChange={(e) => setBulkCount(e.target.value)}
                className="w-12 bg-transparent border-none text-center text-white text-sm focus:ring-0 p-1"
              />
              <button
                onClick={handleBulkAdd}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                title="Dodaj prazne redove"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'table' ? (
          <RecordsTable
            records={currentRecords}
            onEdit={handleEditRecord}
            onRemove={removeRecord}
            onView={handleViewRecord}
            errors={errors}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isSearching={!!searchQuery}
            searchQuery={searchQuery}
          />
        ) : (
          <div className="space-y-4">
            {currentRecords.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-sm p-12 rounded-2xl border border-white/10 text-center">
                {searchQuery.trim() !== '' ? (
                  <>
                    <p className="text-gray-400 mb-2">Nema rezultata za pretragu: <strong className="text-white">"{searchQuery}"</strong></p>
                    <p className="text-sm text-gray-500">Pokušajte sa drugim pojmom pretrage</p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-400 mb-4">Još nema zapisa. Dodajte prvi zapis da počnete.</p>
                    <button
                      onClick={() => addRecords(1)}
                      className="neon-button px-6 py-2 rounded-xl flex items-center justify-center gap-2 mx-auto"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Dodaj prvi zapis</span>
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                {currentRecords.map((record, localIndex) => {
                  const globalIndex = (currentPage - 1) * recordsPerPage + localIndex;
                  return (
                    <RecordForm
                      key={record.id}
                      record={record}
                      index={globalIndex}
                      onChange={(updatedRecord) => updateRecord(globalIndex, updatedRecord)}
                      onRemove={() => removeRecord(globalIndex)}
                      errors={errors}
                    />
                  );
                })}

                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4 py-6">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      Prethodna
                    </button>

                    <span className="text-gray-400">
                      Stranica {currentPage} od {totalPages}
                    </span>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      Sledeća
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="mt-8">
          <SequenceIntegrityMonitor userId={authState.user?.id || ''} />
        </div>

        {/* Modal */}
        {showModal && editingRecord && (
          <RecordModal
            record={editingRecord}
            index={selectedRecordIndex}
            isOpen={showModal}
            mode={modalMode}
            onClose={handleCloseModal}
            onChange={setEditingRecord}
            onSave={handleSaveRecord}
            errors={errors}
          />
        )}

        {/* Bulk Edit Modal */}
        <BulkEditModal
          isOpen={showBulkEditModal}
          onClose={() => setShowBulkEditModal(false)}
          onApply={handleBulkEdit}
          recordCount={records.length}
        />

        {/* Status Bar and Export */}
        {records.length > 0 && (
          <div className="glass-panel p-6 rounded-2xl mt-8 sticky bottom-6 z-10 backdrop-blur-xl bg-black/40 border-t border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-6">
                <div>
                  <span className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Ukupno zapisa</span>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-white">{records.length}</span>
                    {searchQuery && (
                      <span className="ml-2 text-xs text-neon-blue">
                        (od {allRecords.length})
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                <div>
                  <span className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Ukupan iznos</span>
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                    {getTotalAmount().toLocaleString()} <span className="text-sm text-gray-400">{header.currency_code}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto">
                <button
                  onClick={handleVerifyExport}
                  className="flex-1 md:flex-none glass-button px-6 py-3 rounded-xl text-blue-300 hover:text-white flex items-center justify-center gap-2 font-medium group"
                  title="Verifikacija"
                >
                  <ShieldCheck className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <span>Verifikuj</span>
                </button>

                <button
                  onClick={handleExport}
                  className="flex-1 md:flex-none neon-button px-8 py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Izvezi XML</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {authState.user && (
          <div className="mt-12 text-center text-xs text-gray-500 pb-4">
            <p>Podaci se automatski čuvaju za vaš nalog.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
