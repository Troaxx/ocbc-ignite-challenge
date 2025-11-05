import React, { useState, useEffect } from 'react';
import testResultsService from '../../services/testResultsService';
import Loader from '../../components/Loader/Loader';
import './CICDDashboardPage.css';

const CICDDashboardPage = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      const data = await testResultsService.getLatestResults();
      setResults(data);
      setError(null);
    } catch (err) {
      setError('Failed to load test results');
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          <TestRunCard testRun={results.current} isCurrent={true} />
        </div>
      )}

      {results?.history && results.history.length > 0 && (
        <div className="history-section">
          <h2>Past Test Runs (Last 5)</h2>
          <div className="history-grid">
            {results.history.map((testRun) => (
              <TestRunCard key={testRun.id} testRun={testRun} isCurrent={false} />
            ))}
          </div>
        </div>
      )}

      {(!results?.current && (!results?.history || results.history.length === 0)) && (
        <div className="no-results">
          <p>No test results available. Run tests to see results here.</p>
        </div>
      )}
    </div>
  );
};

const TestRunCard = ({ testRun, isCurrent }) => {
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

  return (
    <div className={`test-run-card ${isCurrent ? 'current' : ''}`}>
      <div className="card-header">
        <h3>{isCurrent ? 'Current Run' : `Run ${testRun.id ? new Date(testRun.id).toLocaleDateString() : 'Unknown'}`}</h3>
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

        {testRun.failedTests > 0 && (
          <div className="warning-banner">
            {testRun.failedTests} test(s) failed in this run
          </div>
        )}
      </div>
    </div>
  );
};

export default CICDDashboardPage;
