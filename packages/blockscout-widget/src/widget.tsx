import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface BlockscoutSecurityWidgetProps {
  contractAddress: string;
  network?: string;
  apiEndpoint?: string;
  apiKey?: string;
}

export const BlockscoutSecurityWidget: React.FC<BlockscoutSecurityWidgetProps> = ({
  contractAddress,
  network = 'ethereum',
  apiEndpoint = 'http://localhost:3000/api',
  apiKey,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [securityReport, setSecurityReport] = useState<any>(null);
  const [contractInfo, setContractInfo] = useState<any>(null);

  useEffect(() => {
    const analyzeContract = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call N3 security API integrated with Blockscout
        const headers = apiKey ? { 'X-API-Key': apiKey } : undefined;
        
        const [contractResponse, analysisResponse] = await Promise.all([
          axios.get(`${apiEndpoint}/contract`, { 
            params: { address: contractAddress, network }, 
            headers 
          }),
          axios.get(`${apiEndpoint}/analyze`, { 
            params: { address: contractAddress, network }, 
            headers 
          })
        ]);

        setContractInfo(contractResponse.data);
        setSecurityReport(analysisResponse.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to analyze contract');
        setLoading(false);
      }
    };

    analyzeContract();
  }, [contractAddress, network, apiEndpoint, apiKey]);

  if (loading) {
    return <div className="n3-widget-loading">Analyzing contract security...</div>;
  }

  if (error) {
    return <div className="n3-widget-error">Error: {error}</div>;
  }

  if (!securityReport) {
    return <div className="n3-widget-empty">No security report available</div>;
  }

  // Determine risk level class
  const riskLevel = securityReport.riskScore >= 75 ? 'critical' :
                   securityReport.riskScore >= 50 ? 'high' :
                   securityReport.riskScore >= 25 ? 'medium' : 'low';

  return (
    <div className="n3-security-widget">
      <div className="n3-widget-header">
        <h2 className="n3-widget-title">N3 Security Analysis</h2>
        <div className={`n3-widget-risk-badge n3-risk-${riskLevel}`}>
          {riskLevel.toUpperCase()}
        </div>
      </div>
      
      <div className="n3-widget-content">
        <div className="n3-widget-contract-info">
          <h3>{contractInfo?.name || 'Unknown Contract'}</h3>
          <div className="n3-widget-contract-meta">
            <span className="n3-widget-address">{contractAddress}</span>
            <span className="n3-widget-network">{network}</span>
          </div>
        </div>
        
        <div className="n3-widget-score">
          <div className="n3-widget-score-label">Risk Score:</div>
          <div className={`n3-widget-score-value n3-risk-${riskLevel}`}>
            {securityReport.riskScore.toFixed(2)}/100
          </div>
        </div>
        
        <div className="n3-widget-issues">
          <h3 className="n3-widget-section-title">Security Issues</h3>
          {securityReport.vulnerabilities?.length > 0 ? (
            <ul className="n3-widget-issue-list">
              {securityReport.vulnerabilities.map((vuln: any, index: number) => (
                <li key={index} className={`n3-widget-issue n3-issue-${vuln.severity}`}>
                  <span className="n3-widget-issue-name">{vuln.name}</span>
                  <span className="n3-widget-issue-severity">{vuln.severity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="n3-widget-no-issues">No vulnerabilities detected</p>
          )}
        </div>
        
        {securityReport.recommendations?.length > 0 && (
          <div className="n3-widget-recommendations">
            <h3 className="n3-widget-section-title">Recommendations</h3>
            <ul className="n3-widget-recommendation-list">
              {securityReport.recommendations.map((rec: string, index: number) => (
                <li key={index} className="n3-widget-recommendation">{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="n3-widget-footer">
        <a 
          href={`https://n3scan.io/address/${contractAddress}?network=${network}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="n3-widget-detail-link"
        >
          View Full Report
        </a>
        <div className="n3-widget-powered-by">
          Powered by <span className="n3-widget-logo">N3</span> & <span className="blockscout-logo">Blockscout</span>
        </div>
      </div>
    </div>
  );
};