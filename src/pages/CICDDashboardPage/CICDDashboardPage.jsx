import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, AreaChart } from 'recharts';
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
        const allRuns = results?.all || [];
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

            {allRuns.length > 0 && (
              <div className="graphs-section">
                <h2>Test Run Analytics</h2>
                <div className="graphs-grid">
                  <TestRunGraphs runs={allRuns} />
                </div>
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
          <p>No test results available. Run tests to see results here. TEst</p>
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
      className={`test-run-card ${isCurrent ? 'current' : ''} ${hasFailedTests ? 'clickable has-cursor-pointer' : ''}`}
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
  const failedTests = testRun.failedTestsDetails || testRun.testDetails?.filter(test => test.status === 'failed') || [];

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
            {(test.retries > 0 || test.retry > 0) && (
              <span className="meta-badge retry">Retry: {test.retries || test.retry}</span>
            )}
          </div>
          {hasDetails && (
            <button className="expand-btn" onClick={toggleExpand} aria-label={isExpanded ? 'Collapse' : 'Expand'}>
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

      {test.location && test.location.file && (
        <div className="test-file-location">
          <span className="file-path">{testResultsService.getFileName(test.location.file)}</span>
          {test.location.line && (
            <span className="file-line">Line {test.location.line}{test.location.column ? `:${test.location.column}` : ''}</span>
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
                      
                      lines.forEach((line, idx) => {
                        if (line.trim().startsWith('>') || line.includes('^') || line.trim().startsWith('|')) {
                          errorLineIndices.add(idx);
                          if (idx > 0) {
                            errorLineIndices.add(idx - 1);
                          }
                        }
                      });
                      
                      return lines.map((line, idx) => {
                        if (errorLineIndices.has(idx)) {
                          return (
                            <div key={idx} className="error-line">
                              {line || '\u00A0'}
                            </div>
                          );
                        }
                        return (
                          <div key={idx} className="snippet-line">
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

const TestRunGraphs = ({ runs }) => {
  const prepareChartData = () => {
    return runs
      .slice()
      .reverse()
      .map((run, index) => {
        const passRate = run.totalTests > 0 
          ? ((run.passedTests / run.totalTests) * 100).toFixed(1) 
          : 0;
        const duration = run.duration || run.totalDuration || 0;
        const durationSeconds = (duration / 1000).toFixed(1);
        
        const date = run.timestamp || run.startTime;
        const dateObj = date ? new Date(date) : new Date();
        const dateLabel = dateObj.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        return {
          name: `Run ${runs.length - index}`,
          date: dateLabel,
          passRate: parseFloat(passRate),
          passed: run.passedTests || 0,
          failed: run.failedTests || 0,
          skipped: run.skippedTests || 0,
          total: run.totalTests || 0,
          duration: parseFloat(durationSeconds),
          coverage: run.coverage?.overall?.percentage 
            ? parseFloat(run.coverage.overall.percentage) 
            : null
        };
      });
  };

  const chartData = prepareChartData();
  const hasCoverage = chartData.some(d => d.coverage !== null);

  if (chartData.length === 0) {
    return null;
  }

  return (
    <>
      <div className="graph-card">
        <h3 className="graph-title">Pass Rate Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} label={{ value: 'Pass Rate (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value) => `${value}%`}
              labelFormatter={(label) => `Run: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="passRate" 
              stroke="#4CAF50" 
              strokeWidth={2}
              dot={{ fill: '#4CAF50', r: 5 }}
              name="Pass Rate (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="graph-card">
        <h3 className="graph-title">Test Results Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Number of Tests', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="passed" stackId="a" fill="#4CAF50" name="Passed" />
            <Bar dataKey="failed" stackId="a" fill="#F44336" name="Failed" />
            <Bar dataKey="skipped" stackId="a" fill="#FF9800" name="Skipped" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="graph-card">
        <h3 className="graph-title">Test Duration Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Duration (seconds)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value) => `${value}s`}
              labelFormatter={(label) => `Run: ${label}`}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="duration" 
              stroke="#2196F3" 
              fill="#2196F3" 
              fillOpacity={0.6}
              name="Duration (s)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {hasCoverage && (
        <div className="graph-card">
          <h3 className="graph-title">Code Coverage Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} label={{ value: 'Coverage (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value) => value !== null ? `${value}%` : 'N/A'}
                labelFormatter={(label) => `Run: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="coverage" 
                stroke="#9C27B0" 
                strokeWidth={2}
                dot={{ fill: '#9C27B0', r: 5 }}
                name="Coverage (%)"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
};

export default CICDDashboardPage;
