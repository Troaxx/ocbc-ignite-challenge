import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';
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
      console.log('Dashboard Results:', data);
      console.log('History length:', data?.history?.length);
      console.log('Past runs:', data?.history?.slice(1)?.slice(0, 5));
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
        const currentRun = results?.current || (history.length > 0 ? history[0] : null);
        const pastRuns = history.length > 1 ? history.slice(1, 6) : [];
        
        console.log('=== DASHBOARD DEBUG ===');
        console.log('Full results object:', results);
        console.log('History array:', history);
        console.log('History length:', history.length);
        console.log('Current run ID:', currentRun?.id);
        console.log('History[0] ID:', history[0]?.id);
        console.log('Past runs (slice 1-6):', history.slice(1, 6));
        console.log('Past runs count:', pastRuns.length);
        console.log('Past runs:', pastRuns);
        console.log('Will show past runs section:', pastRuns.length > 0);

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
  const COLORS = {
    passed: '#4CAF50',
    failed: '#F44336',
    skipped: '#FF9800',
    error: '#9C27B0'
  };

  const getBrowserName = (projectName) => {
    if (!projectName || projectName === 'unknown') return 'Unknown';
    const name = projectName.toLowerCase();
    if (name.includes('chromium') || name.includes('chrome')) return 'Chrome';
    if (name.includes('firefox')) return 'Firefox';
    if (name.includes('webkit') || name.includes('safari')) return 'Safari';
    if (name.includes('edge')) return 'Edge';
    return projectName;
  };

  const getTestCategory = (filePath) => {
    if (!filePath) return 'Other';
    const fileName = filePath.toLowerCase();
    if (fileName.includes('authentication') || fileName.includes('login')) return 'Authentication';
    if (fileName.includes('client') || fileName.includes('manage')) return 'Client Management';
    if (fileName.includes('transaction') || fileName.includes('deposit') || fileName.includes('withdraw')) return 'Transactions';
    if (fileName.includes('transfer')) return 'Transfers';
    return 'Other';
  };

  const prepareExecutionStatusData = () => {
    let totalPassed = 0;
    let totalFailed = 0;
    let totalSkipped = 0;
    let totalError = 0;

    runs.forEach(run => {
      totalPassed += run.passedTests || 0;
      totalFailed += run.failedTests || 0;
      totalSkipped += run.skippedTests || 0;
      
      if (run.testDetails) {
        run.testDetails.forEach(test => {
          if (test.status === 'failed' && test.error) {
            totalError += 1;
          }
        });
      }
    });

    return [
      { name: 'Passed', value: totalPassed, color: COLORS.passed },
      { name: 'Failed', value: totalFailed, color: COLORS.failed },
      { name: 'Skipped', value: totalSkipped, color: COLORS.skipped },
      { name: 'Error', value: totalError, color: COLORS.error }
    ].filter(item => item.value > 0);
  };

  const prepareDurationTrendData = () => {
    const browserData = {};
    
    runs.forEach(run => {
      if (!run.testDetails) return;
      
      run.testDetails.forEach(test => {
        const browser = getBrowserName(test.projectName);
        if (!browserData[browser]) {
          browserData[browser] = [];
        }
        if (test.duration) {
          browserData[browser].push(test.duration);
        }
      });
    });

    const chartData = runs
      .slice()
      .reverse()
      .map((run, index) => {
        const date = run.timestamp || run.startTime;
        const dateObj = date ? new Date(date) : new Date();
        const dateLabel = dateObj.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        const runTests = run.testDetails || [];
        const durations = runTests.map(t => t.duration || 0).filter(d => d > 0);
        const avgDuration = durations.length > 0 
          ? durations.reduce((a, b) => a + b, 0) / durations.length 
          : 0;
        const minDuration = durations.length > 0 ? Math.min(...durations) : 0;
        const maxDuration = durations.length > 0 ? Math.max(...durations) : 0;
        
        const sortedDurations = [...durations].sort((a, b) => a - b);
        const p90Index = Math.floor(sortedDurations.length * 0.9);
        const p90Duration = sortedDurations.length > 0 ? sortedDurations[p90Index] || sortedDurations[sortedDurations.length - 1] : 0;

        const browserAverages = {};
        ['Chrome', 'Firefox', 'Safari'].forEach(browser => {
          const browserTests = runTests.filter(t => getBrowserName(t.projectName) === browser);
          const browserDurations = browserTests.map(t => t.duration || 0).filter(d => d > 0);
          browserAverages[browser] = browserDurations.length > 0
            ? browserDurations.reduce((a, b) => a + b, 0) / browserDurations.length
            : null;
        });

        return {
          name: `Run ${runs.length - index}`,
          date: dateLabel,
          avgDuration: (avgDuration / 1000).toFixed(1),
          minDuration: (minDuration / 1000).toFixed(1),
          maxDuration: (maxDuration / 1000).toFixed(1),
          p90Duration: (p90Duration / 1000).toFixed(1),
          chrome: browserAverages.Chrome ? (browserAverages.Chrome / 1000).toFixed(1) : null,
          firefox: browserAverages.Firefox ? (browserAverages.Firefox / 1000).toFixed(1) : null,
          safari: browserAverages.Safari ? (browserAverages.Safari / 1000).toFixed(1) : null
        };
      });

    return chartData;
  };

  const prepareBrowserUtilizationData = () => {
    const browserStats = {};
    const concurrentSessions = {};

    runs.forEach(run => {
      if (!run.testDetails) return;
      
      const browserTimestamps = {};
      
      run.testDetails.forEach(test => {
        const browser = getBrowserName(test.projectName);
        if (!browserStats[browser]) {
          browserStats[browser] = { tests: 0, sessions: 0 };
        }
        browserStats[browser].tests += 1;

        if (test.startTime) {
          const startTime = new Date(test.startTime).getTime();
          const endTime = startTime + (test.duration || 0);
          
          if (!browserTimestamps[browser]) {
            browserTimestamps[browser] = [];
          }
          browserTimestamps[browser].push({ start: startTime, end: endTime });
        }
      });

      Object.keys(browserTimestamps).forEach(browser => {
        const timestamps = browserTimestamps[browser];
        let maxConcurrent = 0;
        
        const allEvents = [];
        timestamps.forEach(ts => {
          allEvents.push({ time: ts.start, type: 'start' });
          allEvents.push({ time: ts.end, type: 'end' });
        });
        
        allEvents.sort((a, b) => a.time - b.time);
        
        let current = 0;
        allEvents.forEach(event => {
          if (event.type === 'start') {
            current++;
            maxConcurrent = Math.max(maxConcurrent, current);
          } else {
            current--;
          }
        });
        
        if (!concurrentSessions[browser]) {
          concurrentSessions[browser] = [];
        }
        concurrentSessions[browser].push(maxConcurrent);
      });
    });

    const chartData = Object.keys(browserStats).map(browser => {
      const avgConcurrent = concurrentSessions[browser] && concurrentSessions[browser].length > 0
        ? concurrentSessions[browser].reduce((a, b) => a + b, 0) / concurrentSessions[browser].length
        : 0;
      
      return {
        browser: browser,
        tests: browserStats[browser].tests,
        concurrentSessions: Math.round(avgConcurrent),
        utilization: Math.min(100, Math.round((avgConcurrent / 4) * 100))
      };
    });

    return chartData;
  };

  const prepareFailureRateData = () => {
    const browserFailures = {};
    const categoryFailures = {};

    runs.forEach(run => {
      if (!run.testDetails) return;
      
      run.testDetails.forEach(test => {
        if (test.status === 'failed') {
          const browser = getBrowserName(test.projectName);
          const category = getTestCategory(test.file);

          browserFailures[browser] = (browserFailures[browser] || 0) + 1;
          categoryFailures[category] = (categoryFailures[category] || 0) + 1;
        }
      });
    });

    const browserData = Object.keys(browserFailures).map(browser => ({
      name: browser,
      failures: browserFailures[browser]
    })).sort((a, b) => b.failures - a.failures);

    const categoryData = Object.keys(categoryFailures).map(category => ({
      name: category,
      failures: categoryFailures[category]
    })).sort((a, b) => b.failures - a.failures);

    const combinedData = [
      ...browserData.map(item => ({ ...item, type: 'Browser' })),
      ...categoryData.map(item => ({ ...item, type: 'Category' }))
    ];

    return { browserData, categoryData, combinedData };
  };

  const renderCustomLabel = ({ name, value, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#333" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ fontSize: '14px', fontWeight: '600' }}
      >
        {`${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  const executionStatusData = prepareExecutionStatusData();
  const durationTrendData = prepareDurationTrendData();
  const browserUtilizationData = prepareBrowserUtilizationData();
  const failureRateData = prepareFailureRateData();

  if (runs.length === 0) {
    return null;
  }

  return (
    <>
      <div className="graph-card">
        <h3 className="graph-title">Test Execution Status Overview</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Pie
              data={executionStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={75}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
            >
              {executionStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ fontSize: '14px' }} />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="graph-card">
        <h3 className="graph-title">Test Duration Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={durationTrendData} margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 14 }} />
            <YAxis 
              label={{ value: 'Duration (seconds)', angle: -90, position: 'left', style: { fontSize: 14, textAnchor: 'middle' } }} 
              tick={{ fontSize: 14 }}
              width={60}
            />
            <Tooltip 
              formatter={(value) => value !== null ? `${value}s` : 'N/A'}
              labelFormatter={(label) => `Run: ${label}`}
              contentStyle={{ fontSize: '14px' }}
            />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
            <Line 
              type="monotone" 
              dataKey="avgDuration" 
              stroke="#2196F3" 
              strokeWidth={2}
              dot={{ fill: '#2196F3', r: 4 }}
              name="Average Duration"
            />
            <Line 
              type="monotone" 
              dataKey="p90Duration" 
              stroke="#FF9800" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#FF9800', r: 4 }}
              name="P90 Duration"
            />
            <Line 
              type="monotone" 
              dataKey="chrome" 
              stroke="#4285F4" 
              strokeWidth={1.5}
              dot={{ fill: '#4285F4', r: 3 }}
              name="Chrome Avg"
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="firefox" 
              stroke="#FF7139" 
              strokeWidth={1.5}
              dot={{ fill: '#FF7139', r: 3 }}
              name="Firefox Avg"
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="safari" 
              stroke="#000000" 
              strokeWidth={1.5}
              dot={{ fill: '#000000', r: 3 }}
              name="Safari Avg"
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="graph-card">
        <h3 className="graph-title">Browser Utilization / Parallel Execution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={browserUtilizationData} margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="browser" tick={{ fontSize: 14 }} />
            <YAxis 
              label={{ value: 'Count', angle: -90, position: 'left', style: { fontSize: 14, textAnchor: 'middle' } }} 
              tick={{ fontSize: 14 }}
              width={60}
            />
            <Tooltip contentStyle={{ fontSize: '14px' }} />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
            <Bar dataKey="tests" fill="#4CAF50" name="Tests Executed" />
            <Bar dataKey="concurrentSessions" fill="#2196F3" name="Concurrent Sessions" />
            <Bar dataKey="utilization" fill="#FF9800" name="Utilization %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="graph-card">
        <h3 className="graph-title">Failure Rate by Browser or Test Category</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={failureRateData.combinedData} margin={{ left: 20, right: 20, top: 30, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={80} 
              tick={{ fontSize: 14 }} 
            />
            <YAxis 
              tick={{ fontSize: 14 }}
              width={70}
            >
              <Label 
                value="Number of Failures"
                angle={-90}
                position="insideLeft"
                style={{ fontSize: 14, textAnchor: 'middle' }}
                offset={-15}
              />
            </YAxis>
            <Tooltip contentStyle={{ fontSize: '14px' }} />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
            <Bar dataKey="failures" fill="#F44336" name="Failures" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default CICDDashboardPage;
