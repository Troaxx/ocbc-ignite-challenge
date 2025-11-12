import React, { useState, useEffect } from 'react';
import testResultsService from '../../services/testResultsService';
import Loader from '../../components/Loader/Loader';
import './CICDDashboardPage.css';

const CICDDashboardPage = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTestRun, setSelectedTestRun] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      const data = await testResultsService.getAllResults();
      setResults(data);
      setError(null);
    } catch (err) {
      setError('Failed to load test results');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (testRun) => {
    const failedTestsDetails = testRun.failedTestsDetails || (Array.isArray(testRun.failedTests) ? testRun.failedTests : []);
    const failedTestsArray = Array.isArray(failedTestsDetails) ? failedTestsDetails : [];
    const failedTestsCount = typeof testRun.failedTests === 'number' ? testRun.failedTests : failedTestsArray.length;
    if (failedTestsCount > 0 && failedTestsArray.length > 0) {
      setSelectedTestRun({ ...testRun, failedTestsDetails: failedTestsArray });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTestRun(null);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="cicd-dashboard">
        <div className="dashboard-error">
          <p>{error}</p>
          <button onClick={loadResults}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cicd-dashboard">
      <div className="dashboard-header">
        <h1>CI/CD Test Dashboard</h1>
        <button onClick={loadResults} className="refresh-btn">Refresh</button>
      </div>

      {results?.current && (
        <div className="current-run">
          <h2>Most Recent Test Run</h2>
          <TestRunCard 
            testRun={results.current} 
            isCurrent={true}
            onClick={() => handleCardClick(results.current)}
          />
        </div>
      )}

      {results?.history && results.history.length > 0 && (
        <div className="history-section">
          <h2>Past Test Runs (Last {results.history.length})</h2>
          <div className="history-grid">
            {results.history.map((testRun, index) => {
              const runNumber = index + 1;
              return (
                <TestRunCard 
                  key={testRun.id} 
                  testRun={testRun} 
                  isCurrent={false} 
                  runNumber={runNumber}
                  onClick={() => handleCardClick(testRun)}
                />
              );
            })}
          </div>
        </div>
      )}

      {isModalOpen && selectedTestRun && (
        <FailedTestsModal 
          testRun={selectedTestRun}
          onClose={handleCloseModal}
        />
      )}

      {(!results?.current && (!results?.history || results.history.length === 0)) && (
        <div className="no-results">
          <p>No test results available. Run tests to see results here.</p>
        </div>
      )}
    </div>
  );
};

const TestRunCard = ({ testRun, isCurrent, runNumber, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return '#4CAF50';
      case 'failed': return '#F44336';
      case 'skipped': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getPassRate = (testRun) => {
    if (!testRun || testRun.totalTests === 0) return 0;
    return ((testRun.passedTests / testRun.totalTests) * 100).toFixed(1);
  };

  const passRate = getPassRate(testRun);
  const isHealthy = passRate >= 80;
  const failedTestsDetails = testRun.failedTestsDetails || testRun.failedTests || [];
  const failedTestsArray = Array.isArray(failedTestsDetails) ? failedTestsDetails : [];
  const failedTestsCount = typeof testRun.failedTests === 'number' ? testRun.failedTests : failedTestsArray.length;
  const hasFailedTests = failedTestsCount > 0 && failedTestsArray.length > 0;

  const getRunTitle = () => {
    if (isCurrent) return 'Current Run';
    if (runNumber) return `Run ${runNumber}`;
    return 'Unknown Run';
  };

  const handleClick = () => {
    if (hasFailedTests && onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`test-run-card ${isCurrent ? 'current' : ''} ${hasFailedTests ? 'clickable' : ''}`}
      onClick={handleClick}
      style={{ cursor: hasFailedTests ? 'pointer' : 'default' }}
    >
      <div className="card-header">
        <h3>{getRunTitle()}</h3>
        <span className={`status-badge ${isHealthy ? 'healthy' : 'unhealthy'}`}>
          {passRate}% Pass Rate
        </span>
      </div>

      <div className="card-body">
        <div className="stat-row">
          <div className="stat-item">
            <span className="stat-label">Total Tests</span>
            <span className="stat-value">{testRun.totalTests || 0}</span>
          </div>
          <div className="stat-item passed">
            <span className="stat-label">Passed</span>
            <span className="stat-value" style={{ color: getStatusColor('passed') }}>
              {testRun.passedTests || 0}
            </span>
          </div>
          <div className="stat-item failed">
            <span className="stat-label">Failed</span>
            <span className="stat-value" style={{ color: getStatusColor('failed') }}>
              {testRun.failedTests || 0}
            </span>
          </div>
          <div className="stat-item skipped">
            <span className="stat-label">Skipped</span>
            <span className="stat-value" style={{ color: getStatusColor('skipped') }}>
              {testRun.skippedTests || 0}
            </span>
          </div>
        </div>

        <div className="meta-row">
          <div className="meta-item">
            <span className="meta-label">Duration</span>
            <span className="meta-value">
              {testResultsService.formatDuration(testRun.duration || testRun.totalDuration || 0)}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Run Time</span>
            <span className="meta-value">
              {testResultsService.formatDate(testRun.timestamp || testRun.startTime)}
            </span>
          </div>
        </div>

        {testRun.coverage && (
          <div className="coverage-row">
            <div className="coverage-item">
              <span className="coverage-label">Code Coverage</span>
              <span 
                className="coverage-value"
                style={{
                  color: parseFloat(testRun.coverage.overall.percentage) >= 80 
                    ? '#4CAF50' 
                    : parseFloat(testRun.coverage.overall.percentage) >= 60 
                    ? '#FF9800' 
                    : '#F44336'
                }}
              >
                {testRun.coverage.overall.percentage}%
              </span>
            </div>
            <div className="coverage-details">
              <span className="coverage-detail">Lines: {testRun.coverage.lines.percentage}%</span>
              <span className="coverage-detail">Functions: {testRun.coverage.functions.percentage}%</span>
              <span className="coverage-detail">Branches: {testRun.coverage.branches.percentage}%</span>
            </div>
          </div>
        )}

        {failedTestsCount > 0 && (
          <div className="warning-banner">
            {failedTestsCount} test(s) failed in this run
            {hasFailedTests && <span className="click-hint"> - Click to view details</span>}
          </div>
        )}
      </div>
    </div>
  );
};

const FailedTestsModal = ({ testRun, onClose }) => {
  const failedTestsDetails = testRun.failedTestsDetails || (Array.isArray(testRun.failedTests) ? testRun.failedTests : []);
  const failedTestsArray = Array.isArray(failedTestsDetails) ? failedTestsDetails : [];
  const stripAnsiCodes = (text) => {
    if (!text) return text;
    return String(text)
      .replace(/\x1b\[[0-9;]*m/g, '')
      .replace(/\x1b\[[0-9;]*[A-Za-z]/g, '')
      .trim();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="failed-tests-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Failed Tests Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="failed-tests-summary">
            <div className="summary-item">
              <span className="summary-label">Total Failed Tests</span>
              <span className="summary-value">{failedTestsArray.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Run Date</span>
              <span className="summary-value">{testResultsService.formatDate(testRun.timestamp)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Duration</span>
              <span className="summary-value">{testResultsService.formatDuration(testRun.duration || testRun.totalDuration || 0)}</span>
            </div>
          </div>

          <div className="failed-tests-list">
            {failedTestsArray.map((test, index) => (
              <div key={index} className="failed-test-item">
                <div className="test-header">
                  <div className="test-number">{index + 1}</div>
                  <div className="test-title-section">
                    <div className="test-title-row">
                      <span className="test-status-badge failed">Failed</span>
                      <span className="test-name">{test.title || 'Unknown Test'}</span>
                    </div>
                    {test.error?.message && (
                      <div className="test-error-message">
                        {stripAnsiCodes(test.error.message)}
                      </div>
                    )}
                    <div className="test-header-meta">
                      <div className="test-meta-info">
                        {test.duration && (
                          <span className="meta-badge">Duration: {testResultsService.formatDuration(test.duration)}</span>
                        )}
                        {test.projectName && (
                          <span className="meta-badge">Project: {test.projectName}</span>
                        )}
                        {test.retries > 0 && (
                          <span className="meta-badge retry">Retries: {test.retries}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {test.location && (
                  <div className="test-file-location">
                    <span className="file-path">{test.location.file || 'Unknown file'}</span>
                    {test.location.line && (
                      <span className="file-line">Line: {test.location.line}:{test.location.column || 0}</span>
                    )}
                  </div>
                )}
                {test.error && (
                  <div className="test-details">
                    <div className="detail-section error-section">
                      <div className="detail-section-title">Error Details</div>
                      {test.error.message && (
                        <div className="error-message-box">
                          <strong>Error Message:</strong>
                          <pre className="error-message">{stripAnsiCodes(test.error.message)}</pre>
                        </div>
                      )}
                      {test.location && (
                        <div className="error-location">
                          <strong>Location:</strong>
                          <span> {test.location.file || 'Unknown'}</span>
                          {test.location.line && (
                            <span> at line {test.location.line}:{test.location.column || 0}</span>
                          )}
                        </div>
                      )}
                      {test.error.stack && (
                        <div className="error-stack">
                          <div className="stack-summary">Stack Trace</div>
                          <pre className="stack-trace">{stripAnsiCodes(test.error.stack)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {failedTestsArray.length === 0 && (
            <div className="no-failed-tests">
              No failed test details available.
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="close-modal-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CICDDashboardPage;
