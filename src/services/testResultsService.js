const TEST_RESULTS_STORAGE_KEY = 'ocbc_test_results_history';

const testResultsService = {
  async getCurrentResults() {
    try {
      const response = await fetch('/test-results/results.json');
      if (!response.ok) {
        throw new Error('Failed to fetch test results');
      }
      const data = await response.json();
      return this.parseTestResults(data);
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
    const testDetails = [];

    const processSpec = (spec) => {
      if (spec.specs && spec.specs.length > 0) {
        spec.specs.forEach(processSpec);
      }
      if (spec.tests && spec.tests.length > 0) {
        spec.tests.forEach(test => {
          test.results?.forEach(result => {
            totalTests++;
            totalDuration += result.duration || 0;
            
            const testIsFailed = test.status === 'unexpected' || test.status === 'timedOut';
            const resultIsFailed = result.status === 'failed' || result.status === 'timedOut';
            const isFailed = testIsFailed || resultIsFailed;
            
            if (isFailed) {
              failedTests++;
            } else if (result.status === 'passed') {
              passedTests++;
            } else if (result.status === 'skipped') {
              skippedTests++;
            }

            const startTime = new Date(result.startTime);
            const endTime = new Date(startTime.getTime() + (result.duration || 0));

            if (!earliestStartTime || startTime < earliestStartTime) {
              earliestStartTime = startTime;
            }
            if (!latestEndTime || endTime > latestEndTime) {
              latestEndTime = endTime;
            }

            testDetails.push({
              title: spec.title,
              status: isFailed ? 'failed' : result.status,
              duration: result.duration,
              startTime: result.startTime,
              projectName: test.projectName || 'unknown'
            });
          });
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
      failedTests,
      skippedTests,
      totalDuration,
      duration: latestEndTime && earliestStartTime 
        ? latestEndTime.getTime() - earliestStartTime.getTime() 
        : totalDuration,
      startTime: earliestStartTime ? earliestStartTime.toISOString() : null,
      endTime: latestEndTime ? latestEndTime.toISOString() : null,
      testDetails,
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
    
    const allResults = [];
    if (current) {
      allResults.push({ ...current, isCurrent: true });
    }
    
    history.slice(0, 5).forEach(run => {
      allResults.push({ ...run, isCurrent: false });
    });
    
    return {
      current: current || null,
      history: history.slice(0, 5),
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

