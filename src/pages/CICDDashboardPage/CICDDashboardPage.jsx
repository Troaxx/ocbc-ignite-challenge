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
    if (testRun.failedTests > 0) {
      setSelectedTestRun(testRun);
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

      {(() => {
        const history = results?.history || [];
        const currentRun = history.length > 0 ? history[0] : null;
        const pastRuns = history.slice(1, 5);

        return (
          <>
            {currentRun && (
              <div className="current-run">
                <h2>Most Recent Test Run</h2>
                <TestRunCard 
                  testRun={currentRun} 
                  isCurrent={true}
                  onClick={() => handleCardClick(currentRun)}
                />
              </div>
            )}

            {pastRuns.length > 0 && (
              <div className="history-section">
                <h2>Past Test Runs (Last {pastRuns.length})</h2>
                <div className="history-grid">
                  {pastRuns.map((testRun, index) => {
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
          </>
        );
      })()}

      {isModalOpen && selectedTestRun && (
        <FailedTestsModal 
          testRun={selectedTestRun}
          onClose={handleCloseModal}
        />
      )}

      {(!results?.history || results.history.length === 0) && (
        <div className="no-results">
          <p>No test results available. Run tests to see results here.</p>
        </div>
      )}
    </div>
  );
};

const TestRunCard = ({ testRun, isCurrent, runNumber, onClick }) => {
  const getPassRate = (testRun) => {
    if (!testRun || testRun.totalTests === 0) return 0;
    return ((testRun.passedTests / testRun.totalTests) * 100).toFixed(1);
  };

  const passRate = getPassRate(testRun);
  const isHealthy = passRate >= 80;
  const hasFailedTests = testRun.failedTests > 0;

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
      className={`test-run-card ${isCurrent ? 'current' : ''} ${hasFailedTests ? 'clickable' : ''} ${hasFailedTests ? 'has-cursor-pointer' : ''}`}
      onClick={handleClick}
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
            <span className="stat-value stat-value-passed">
              {testRun.passedTests || 0}
            </span>
          </div>
          <div className="stat-item failed">
            <span className="stat-label">Failed</span>
            <span className="stat-value stat-value-failed">
              {testRun.failedTests || 0}
            </span>
          </div>
          <div className="stat-item skipped">
            <span className="stat-label">Skipped</span>
            <span className="stat-value stat-value-skipped">
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

        {hasFailedTests && (
          <div className="warning-banner">
            <span>{testRun.failedTests} test(s) failed in this run</span>
            <span className="click-hint">Click to view details</span>
          </div>
        )}
      </div>
    </div>
  );
};

const FailedTestsModal = ({ testRun, onClose }) => {
  const failedTests = testRun.testDetails?.filter(test => test.status === 'failed') || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content failed-tests-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Failed Tests Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="failed-tests-summary">
            <div className="summary-item">
              <span className="summary-label">Total Failed Tests:</span>
              <strong className="summary-value">{testRun.failedTests}</strong>
            </div>
            <div className="summary-item">
              <span className="summary-label">Run Date:</span>
              <span className="summary-value">{testResultsService.formatDate(testRun.timestamp || testRun.startTime)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Duration:</span>
              <span className="summary-value">{testResultsService.formatDuration(testRun.duration || testRun.totalDuration || 0)}</span>
            </div>
          </div>
          {failedTests.length > 0 ? (
            <div className="failed-tests-list">
              {failedTests.map((test, index) => (
                <FailedTestDetail key={index} test={test} index={index + 1} />
              ))}
            </div>
          ) : (
            <div className="no-failed-tests">
              <p>No failed test details available.</p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="close-modal-btn">Close</button>
        </div>
      </div>
    </div>
  );
};

const FailedTestDetail = ({ test, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const hasDetails = test.error || test.attachments?.length > 0 || test.stdout?.length > 0 || test.stderr?.length > 0;

  return (
    <div className={`failed-test-item ${isExpanded ? 'expanded' : ''}`}>
      <div className="test-header" onClick={hasDetails ? toggleExpand : undefined}>
        <div className="test-header-main">
          <div className="test-number">{index}</div>
          <div className="test-title-section">
            <div className="test-title-row">
              <span className="test-status-badge failed">Failed</span>
              <span className="test-name">{test.title}</span>
            </div>
            {test.error?.message && (
              <div className="test-error-message">
                {testResultsService.stripAnsiCodes(test.error.message)}
              </div>
            )}
          </div>
        </div>
        <div className="test-header-meta">
          <div className="test-meta-info">
            {test.duration && (
              <span className="meta-badge">Duration: {testResultsService.formatDuration(test.duration)}</span>
            )}
            {test.projectName && test.projectName !== 'unknown' && (
              <span className="meta-badge">{test.projectName}</span>
            )}
            {test.retry > 0 && (
              <span className="meta-badge retry">Retry: {test.retry}</span>
            )}
          </div>
          {hasDetails && (
            <button className="expand-btn" aria-label={isExpanded ? 'Collapse' : 'Expand'}>
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
        </div>
      </div>

      {test.file && test.file !== 'unknown' && (
        <div className="test-file-location">
          <span className="file-path">{testResultsService.getFileName(test.file)}</span>
          {test.line && (
            <span className="file-line">Line {test.line}{test.column ? `:${test.column}` : ''}</span>
          )}
        </div>
      )}

      {isExpanded && hasDetails && (
        <div className="test-details">
          {test.error && (
            <div className="detail-section error-section">
              <h4 className="detail-section-title">Error Details</h4>
              {test.error.message && (
                <div className="error-message-box">
                  <strong>Error Message:</strong>
                  <pre className="error-message">{testResultsService.stripAnsiCodes(test.error.message)}</pre>
                </div>
              )}
              {test.error.location && (
                <div className="error-location">
                  <strong>Error Location:</strong>
                  <span>{testResultsService.getFileName(test.error.location.file)}</span>
                  <span>Line {test.error.location.line}</span>
                  {test.error.location.column && <span>Column {test.error.location.column}</span>}
                </div>
              )}
              {test.error.snippet && (
                <div className="error-snippet">
                  <strong>Code Snippet:</strong>
                  <div className="snippet-code">
                    {(() => {
                      const cleanedSnippet = testResultsService.stripAnsiCodes(test.error.snippet);
                      const lines = cleanedSnippet.split('\n');
                      const errorLineIndices = new Set();
                      
                      lines.forEach((line, index) => {
                        if (line.trim().startsWith('>') || line.includes('^') || line.trim().startsWith('|')) {
                          errorLineIndices.add(index);
                          if (index > 0) {
                            errorLineIndices.add(index - 1);
                          }
                        }
                      });
                      
                      return lines.map((line, index) => {
                        if (errorLineIndices.has(index)) {
                          return (
                            <div key={index} className="error-line">
                              {line || '\u00A0'}
                            </div>
                          );
                        }
                        return (
                          <div key={index} className="snippet-line">
                            {line || '\u00A0'}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
              {test.error.stack && (
                <div className="error-stack">
                  <details>
                    <summary className="stack-summary">Stack Trace</summary>
                    <pre className="stack-trace">{testResultsService.formatStackTrace(test.error.stack)}</pre>
                  </details>
                </div>
              )}
            </div>
          )}

          {test.attachments && test.attachments.length > 0 && (
            <div className="detail-section attachments-section">
              <h4 className="detail-section-title">Attachments</h4>
              <div className="attachments-list">
                {test.attachments.map((attachment, idx) => (
                  <div key={idx} className="attachment-item">
                    {attachment.type === 'screenshot' && (attachment.body || attachment.path) ? (
                      <div className="screenshot-attachment">
                        <img 
                          src={attachment.body 
                            ? `data:${attachment.contentType || 'image/png'};base64,${attachment.body}` 
                            : attachment.path 
                              ? attachment.path.startsWith('/') 
                                ? attachment.path 
                                : `/test-results/${attachment.path.split(/[\\\/]/).pop()}`
                              : ''} 
                          alt={attachment.name || 'Screenshot'} 
                          className="screenshot-image"
                          onError={(e) => {
                            const parent = e.target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="screenshot-error">Failed to load screenshot: ${attachment.name || 'Screenshot'}</div>`;
                            }
                          }}
                        />
                        <span className="attachment-name">{attachment.name || 'Screenshot'}</span>
                      </div>
                    ) : (
                      <div className="attachment-info">
                        <span className="attachment-type-badge">{attachment.type || 'other'}</span>
                        <span className="attachment-name">{attachment.name || 'Attachment'}</span>
                        {attachment.path && (
                          <span className="attachment-path">{attachment.path}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {((test.stdout && test.stdout.length > 0) || (test.stderr && test.stderr.length > 0)) && (
            <div className="detail-section console-section">
              <h4 className="detail-section-title">Console Output</h4>
              {test.stdout && test.stdout.length > 0 && (
                <div className="console-output stdout">
                  <strong>Standard Output:</strong>
                  <pre className="console-text">{test.stdout.join('\n')}</pre>
                </div>
              )}
              {test.stderr && test.stderr.length > 0 && (
                <div className="console-output stderr">
                  <strong>Error Output:</strong>
                  <pre className="console-text error">{test.stderr.join('\n')}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CICDDashboardPage;
