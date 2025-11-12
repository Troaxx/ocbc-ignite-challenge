const TEST_RESULTS_STORAGE_KEY = 'ocbc_test_results_history';

const testResultsService = {
  async getCurrentResults() {
    try {
      const response = await fetch('/test-results/results.json');
      if (!response.ok) {
        throw new Error('Failed to fetch test results');
      }
      const data = await response.json();
      const testResults = this.parseTestResults(data);
      
      // Dynamically import coverage service to avoid circular dependencies
      const coverageServiceModule = await import('./coverageService.js');
      const coverageData = await coverageServiceModule.default.getCoverageData();
      if (coverageData) {
        testResults.coverage = coverageData;
      }
      
      return testResults;
    } catch (error) {
      console.error('Error fetching test results:', error);
      return null;
    }
  },

  parseTestResults(data) {
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let skippedTests = 0;
    let totalDuration = 0;
    let earliestStartTime = null;
    let latestEndTime = null;
    const failedTestsList = [];

    const processSpec = (spec, suiteTitle = '') => {
      if (spec.specs && spec.specs.length > 0) {
        spec.specs.forEach(subSpec => processSpec(subSpec, spec.title || suiteTitle));
      }
      if (spec.tests && spec.tests.length > 0) {
        spec.tests.forEach(test => {
          const lastResult = test.results && test.results.length > 0 
            ? test.results[test.results.length - 1] 
            : null;
          
          if (lastResult) {
            totalTests++;
            totalDuration += lastResult.duration || 0;
            
            const testIsFailed = test.status === 'unexpected' || test.status === 'timedOut';
            const resultIsFailed = lastResult.status === 'failed' || lastResult.status === 'timedOut';
            const isFailed = testIsFailed || resultIsFailed;
            
            if (isFailed) {
              failedTests++;
              failedTestsList.push({
                title: test.title || spec.title || 'Unknown Test',
                status: 'failed',
                duration: lastResult.duration,
                startTime: lastResult.startTime,
                projectName: test.projectName || 'unknown',
                error: test.error || lastResult.error || null,
                location: test.location || lastResult.location || (test.titlePath ? { file: test.titlePath[test.titlePath.length - 1] } : null),
                retries: test.results ? test.results.length - 1 : 0,
                attachments: test.attachments || lastResult.attachments || [],
                stdout: lastResult.stdout || [],
                stderr: lastResult.stderr || []
              });
            } else if (lastResult.status === 'passed') {
              passedTests++;
            } else if (lastResult.status === 'skipped') {
              skippedTests++;
            }

            const startTime = new Date(lastResult.startTime);
            const endTime = new Date(startTime.getTime() + (lastResult.duration || 0));

            if (!earliestStartTime || startTime < earliestStartTime) {
              earliestStartTime = startTime;
            }
            if (!latestEndTime || endTime > latestEndTime) {
              latestEndTime = endTime;
            }
          }
        });
      }
    };

    if (data.suites) {
      data.suites.forEach(suite => {
        if (suite.specs && suite.specs.length > 0) {
          suite.specs.forEach(processSpec);
        }
        if (suite.suites && suite.suites.length > 0) {
          suite.suites.forEach(processSpec);
        }
      });
    }

    const runTimestamp = earliestStartTime ? earliestStartTime.getTime() : new Date().getTime();
    
    return {
      id: runTimestamp,
      timestamp: earliestStartTime ? earliestStartTime.toISOString() : new Date().toISOString(),
      totalTests,
      passedTests,
      failedTests: failedTests, // Count of failed tests
      skippedTests,
      totalDuration,
      duration: latestEndTime && earliestStartTime 
        ? latestEndTime.getTime() - earliestStartTime.getTime() 
        : totalDuration,
      startTime: earliestStartTime ? earliestStartTime.toISOString() : null,
      endTime: latestEndTime ? latestEndTime.toISOString() : null,
      failedTestsDetails: failedTestsList, // Array of failed test details
      raw: data
    };
  },

  archiveCurrentResults(results) {
    if (!results || !results.id) return;

    const history = this.getHistory();
    
    const existingIndex = history.findIndex(run => run.id === results.id);
    if (existingIndex !== -1) {
      history.splice(existingIndex, 1);
    }
    
    history.unshift(results);
    
    while (history.length > 5) {
      history.pop();
    }

    localStorage.setItem(TEST_RESULTS_STORAGE_KEY, JSON.stringify(history));
  },

  getHistory() {
    const stored = localStorage.getItem(TEST_RESULTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  async getLatestResults() {
    const current = await this.getCurrentResults();
    if (current) {
      this.archiveCurrentResults(current);
    }
    const history = this.getHistory();
    
    return {
      current: current || null,
      history: history.slice(0, 5)
    };
  },

  async getAllResults() {
    const current = await this.getCurrentResults();
    if (current) {
      this.archiveCurrentResults(current);
    }
    const history = this.getHistory();
    
    // Try to fetch coverage for historical runs if they don't have it
    const coverageServiceModule = await import('./coverageService.js');
    const historyWithCoverage = await Promise.all(
      history.slice(0, 5).map(async (run) => {
        if (!run.coverage) {
          // Try to get coverage from the current coverage report
          // (coverage reports are cumulative, so this should work)
          const coverageData = await coverageServiceModule.default.getCoverageData();
          if (coverageData) {
            return { ...run, coverage: coverageData };
          }
        }
        return run;
      })
    );
    
    const allResults = [];
    if (current) {
      allResults.push({ ...current, isCurrent: true });
    }
    
    historyWithCoverage.forEach(run => {
      allResults.push({ ...run, isCurrent: false });
    });
    
    return {
      current: current || null,
      history: historyWithCoverage,
      all: allResults
    };
  },

  formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
  },

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  }
};

export default testResultsService;

