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
    const testDetails = [];
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
            
            const errorDetails = this.extractErrorDetails(lastResult, test);
            const attachments = this.extractAttachments(lastResult, test);
            
            const testDetail = {
              title: test.title || spec.title || 'Unknown Test',
              status: isFailed ? 'failed' : lastResult.status,
              duration: lastResult.duration,
              startTime: lastResult.startTime,
              projectName: test.projectName || 'unknown',
              error: errorDetails,
              location: test.location || lastResult.location || (test.titlePath ? { file: test.titlePath[test.titlePath.length - 1] } : null),
              retries: test.results ? test.results.length - 1 : 0,
              retry: test.results ? test.results.length - 1 : 0,
              attachments: attachments,
              stdout: lastResult.stdout || [],
              stderr: lastResult.stderr || [],
              file: test.location?.file || lastResult.location?.file || (test.titlePath ? test.titlePath[test.titlePath.length - 1] : null),
              line: test.location?.line || lastResult.location?.line,
              column: test.location?.column || lastResult.location?.column
            };
            
            testDetails.push(testDetail);
            
            if (isFailed) {
              failedTests++;
              failedTestsList.push(testDetail);
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
      testDetails: testDetails, // All test details
      failedTestsDetails: failedTestsList, // Array of failed test details only
      raw: data
    };
  },

  archiveCurrentResults(results) {
    if (!results || !results.id) return;

    const history = this.getHistory();
    console.log('=== ARCHIVE DEBUG ===');
    console.log('Archiving run with ID:', results.id);
    console.log('Current history length before archive:', history.length);
    console.log('Current history IDs:', history.map(r => r.id));
    
    const existingIndex = history.findIndex(run => run.id === results.id);
    
    if (existingIndex === -1) {
      console.log('Run not found in history, adding new run');
      history.unshift(results);
    } else {
      console.log(`Run found at index ${existingIndex}, replacing it`);
      history.splice(existingIndex, 1);
      history.unshift(results);
    }
    
    while (history.length > 6) {
      const removed = history.pop();
      console.log('Removed run from history (over limit):', removed.id);
    }
    
    history.forEach((run, index) => {
      run.runId = index + 1;
    });

    console.log('History length after archive:', history.length);
    console.log('History IDs after archive:', history.map(r => r.id));
    localStorage.setItem(TEST_RESULTS_STORAGE_KEY, JSON.stringify(history));
    console.log('Saved to localStorage');
  },

  getHistory() {
    try {
      const stored = localStorage.getItem(TEST_RESULTS_STORAGE_KEY);
      if (!stored) {
        console.log('No history found in localStorage');
        return [];
      }
      const history = JSON.parse(stored);
      const result = Array.isArray(history) ? history.slice(0, 6) : [];
      console.log('Retrieved history from localStorage, length:', result.length);
      return result;
    } catch (error) {
      console.error('Error reading test results history from localStorage:', error);
      return [];
    }
  },

  async getLatestResults() {
    const history = this.getHistory();
    const current = await this.getCurrentResults();
    
    if (current) {
      const existingRun = history.find(run => run.id === current.id);
      if (!existingRun) {
        this.archiveCurrentResults(current);
        return {
          current: current,
          history: this.getHistory()
        };
      }
    }
    
    return {
      current: current || null,
      history: history
    };
  },

  async getAllResults() {
    console.log('=== getAllResults START ===');
    const current = await this.getCurrentResults();
    console.log('Current run ID:', current?.id);
    let history = this.getHistory();
    console.log('Initial history length:', history.length);
    
    if (current) {
      const existingIndex = history.findIndex(run => run.id === current.id);
      console.log('Current run found in history at index:', existingIndex);
      
      if (existingIndex === -1) {
        console.log('Current run not in history, archiving it');
        this.archiveCurrentResults(current);
        history = this.getHistory();
      } else {
        console.log('Current run already in history, re-archiving it');
        history.splice(existingIndex, 1);
        this.archiveCurrentResults(current);
        history = this.getHistory();
      }
      console.log('History length after archiving:', history.length);
    }
    
    const allResults = [];
    if (current) {
      allResults.push({ ...current, isCurrent: true });
    }
    
    history.slice(0, 6).forEach(run => {
      allResults.push({ ...run, isCurrent: false });
    });
    
    const result = {
      current: current || null,
      history: history.slice(0, 6),
      all: allResults
    };
    console.log('=== getAllResults END ===');
    console.log('Returning history length:', result.history.length);
    console.log('Returning history IDs:', result.history.map(r => r.id));
    return result;
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
  },

  extractErrorDetails(result, test) {
    if (!result.error && !test.error) return null;

    const error = result.error || test.error;
    return {
      message: error.message || 'Test failed',
      stack: error.stack || null,
      value: error.value || null,
      snippet: error.snippet || null,
      location: error.location ? {
        file: error.location.file,
        line: error.location.line,
        column: error.location.column
      } : null
    };
  },

  extractAttachments(result, test) {
    const attachments = [];
    
    if (result.attachments) {
      result.attachments.forEach(attachment => {
        attachments.push({
          name: attachment.name,
          contentType: attachment.contentType,
          path: attachment.path,
          body: attachment.body,
          type: this.getAttachmentType(attachment.name, attachment.contentType)
        });
      });
    }

    if (test.attachments) {
      test.attachments.forEach(attachment => {
        attachments.push({
          name: attachment.name,
          contentType: attachment.contentType,
          path: attachment.path,
          body: attachment.body,
          type: this.getAttachmentType(attachment.name, attachment.contentType)
        });
      });
    }

    return attachments;
  },

  getAttachmentType(name, contentType) {
    if (!name && !contentType) return 'unknown';
    
    const nameLower = (name || '').toLowerCase();
    const contentTypeLower = (contentType || '').toLowerCase();

    if (nameLower.includes('screenshot') || contentTypeLower.includes('image')) {
      return 'screenshot';
    }
    if (nameLower.includes('trace') || contentTypeLower.includes('application')) {
      return 'trace';
    }
    if (nameLower.includes('video') || contentTypeLower.includes('video')) {
      return 'video';
    }
    if (nameLower.includes('har') || contentTypeLower.includes('har')) {
      return 'har';
    }
    return 'other';
  },

  formatErrorMessage(error) {
    if (!error) return null;
    
    if (error.message) {
      return this.stripAnsiCodes(error.message);
    }
    return 'Test failed without error message';
  },

  stripAnsiCodes(text) {
    if (!text) return text;
    return String(text)
      .replace(/\x1b\[[0-9;]*m/g, '')
      .replace(/\x1b\[[0-9;]*[A-Za-z]/g, '')
      .replace(/\x1b\[2m/g, '')
      .replace(/\x1b\[22m/g, '')
      .replace(/\x1b\[31m/g, '')
      .replace(/\x1b\[39m/g, '')
      .replace(/\x1b\[36m/g, '')
      .replace(/\x1b\[33m/g, '')
      .replace(/\x1b\[35m/g, '')
      .replace(/\x1b\[32m/g, '')
      .replace(/\x1b\[90m/g, '')
      .replace(/\x1b\[0m/g, '')
      .replace(/\x1b\[1m/g, '')
      .replace(/\\x1b\[[0-9;]*m/g, '')
      .replace(/\\x1b\[[0-9;]*[A-Za-z]/g, '')
      .replace(/\^\x1b\[22m/g, '^')
      .replace(/\x1b\[22m\^/g, '^')
      .trim();
  },

  formatStackTrace(stack) {
    if (!stack) return null;
    
    const lines = stack.split('\n');
    return lines.slice(0, 10).join('\n');
  },

  getFileName(filePath) {
    if (!filePath) return 'Unknown';
    const parts = filePath.split(/[/\\]/);
    return parts[parts.length - 1];
  }
};

export default testResultsService;

