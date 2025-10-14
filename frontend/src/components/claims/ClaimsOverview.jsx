import { FileText, Calendar, Eye, Edit } from "lucide-react"
import { useState } from 'react';

const ClaimsOverview = ({
  isDark, 
  role, 
  claims, 
  getStatusColorr, 
  getPolicyTypeColorr, 
  getClaimTypeColorr, 
  getStatusDarkColorr, 
  openEditModalOpenClaim
}) => {
  const [documentUrl, setDocumentUrl] = useState(null);

  const handleViewDocument = async (documentName) => {
    if (!documentName) {
      alert('No document available for this claim');
      return;
    }
    
    try {
      const documentUrl = `/api/claims/documents/${encodeURIComponent(documentName)}?preview=true`;
      const response = await fetch(documentUrl);
      if (!response.ok) throw new Error('Failed to fetch document');
      
      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
      
      // Clean up the object URL after the window opens
      setTimeout(() => URL.revokeObjectURL(fileURL), 100);
    } catch (error) {
      console.error('Error opening document:', error);
      alert('Failed to open document. Please try again.');
    }
  };
  // Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === '' || amount === '-') return '-';
    const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : Number(amount);
    if (!isFinite(num)) return '-';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  return (
    <>
        <div className={`rounded-xl border transition-colors mb-8 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {/* Section Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-blue-900' : 'bg-blue-100'
              }`}>
                <FileText className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Claims Overview
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Comprehensive claims management with policy integration
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Claim ID</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Company</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Policy Type</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Type</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Claim Amount</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Date</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.claimId} className={`border-b hover:bg-opacity-50 transition-colors ${
                    isDark 
                      ? 'border-gray-700 hover:bg-gray-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <td className="px-6 py-4">
                      <span className={`font-medium text-blue-600 ${isDark ? 'text-blue-400' : ''}`}>
                        {claim.claimId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building2 h-4 w-4 text-gray-500"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {claim.companyName || '-'}
                      </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        getPolicyTypeColorr(claim.policyType || 'Property')
                      }`}>
                        {claim.policyName || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        getClaimTypeColorr(claim.claimType || 'Property Damage')
                      }`}>
                        {claim.claimType || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        isDark ? getStatusDarkColorr(claim.status) : getStatusColorr(claim.status)
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {formatCurrency(claim.claimAmount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {claim.incidentDate ? new Date(claim.incidentDate).toLocaleDateString('en-GB') : '-'}

                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDocument(claim.supportingDocuments)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark
                              ? 'text-green-400 hover:bg-gray-700'
                              : 'text-green-600 hover:bg-gray-100'
                          }`}
                          title="View Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {role !== "Client" && (
                        <button
                          onClick={() => openEditModalOpenClaim(claim)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark
                              ? 'text-blue-400 hover:bg-gray-700 hover:text-white'
                              : 'text-blue-600 hover:bg-gray-100 hover:text-gray-700'
                          }`}
                          title="Edit Claim"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    </div>
    </>
  )
}

export default ClaimsOverview